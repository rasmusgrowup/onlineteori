import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { hygraphClient } from '../../lib/hygraph';

const UpdatePoints = gql`
mutation UpdatePoints($userId: ID!, $points: Int!) {
  user: updateNextUser(
    where: { id: $userId }
    data: { point: $points}
  ) {
    id
    point
  }
}
`;

export default async (req, res) => {
    const session = await getSession({ req });

    if (session) {
        const { points } = JSON.parse(req.body);

        const { user } = await hygraphClient.request(UpdatePoints, {
            userId: session.userId,
            points,
        });

        res.json(user);
    } else {
        res.send({
            error: 'You must be signed in to update your account.',
        });
    }
};