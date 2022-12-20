import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { hygraphClient } from '../../lib/hygraph';

const TestResult = gql`
mutation TestResult($userId: ID!, $testId: String, $correctAnswers: Int!, $incorrectAnswers: Int!) {
    updateNextUser(
        where: {
            id: $userId
        },
        data: {
            testResults: {
                create: {
                    data: {
                        correctAnswers: $correctAnswers,
                        incorrectAnswers: $incorrectAnswers,
                        testId: $testId
                    }
                }
            }
        }
    ){
        id
        testResults {
            testId
        }
    }
}
`;

export default async (req, res) => {
    const session = await getSession({ req });

    if (session) {
        const { testId, correctAnswers, incorrectAnswers } = JSON.parse(req.body);

        const { user } = await hygraphClient.request(TestResult, {
            userId: session.userId,
            testId,
            correctAnswers,
            incorrectAnswers
        });

        res.json(user);
    } else {
        res.send({
            error: 'An error occurred.',
        });
    }
};