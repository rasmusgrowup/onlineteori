import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { hygraphClient } from '../../lib/hygraph';

const AddNewTestToUser = gql`
mutation AddNewTestToUser($userId: ID!, $id: ID!, $testId: String) {
    updateNextUser(
        where: {
            id: $userId
        },
        data: {
            testResults: {
                upsert: {
                    where: { id: $id }
                    data: {
                        create: { testId: $testId}
                        update: { testId: $testId} 
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
        const { id, testId } = JSON.parse(req.body);

        const { user } = await hygraphClient.request(AddNewTestToUser, {
            userId: session.userId,
            id,
            testId,
        });

        res.json(user);
    } else {
        res.send({
            error: 'An error occured.',
        });
    }
};