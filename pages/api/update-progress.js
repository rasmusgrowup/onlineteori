import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { hygraphClient } from '../../lib/hygraph';

const UpdateProgress = gql`
mutation UpdateProgress($userId: ID!, $slugString: String!) {
  user: updateNextUser(
    where: { id: $userId }
    data: { 
      pages: { connect: { where: {slug: $slugString} } } 
    }
  ) {
    id
    pages {
      id
      slug
    }
  }
}
`;

export default async (req, res) => {
    const session = await getSession({ req });

    if (session) {
        const { slugString } = JSON.parse(req.body);

        const { user } = await hygraphClient.request(UpdateProgress, {
            userId: session.userId,
            slugString,
        });

        res.json(user);
    } else {
        res.send({
            error: 'You must be signed in to update your account.',
        });
    }
};