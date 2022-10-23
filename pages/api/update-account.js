import { gql } from 'graphql-request';
import { getSession } from 'next-auth/react';

import { hygraphClient } from '../../lib/hygraph';

const UpdateNextUser = gql`
mutation UpdateNextUser($userId: ID!, $name: String, $username: String) {
  user: updateNextUser(
    data: { name: $name, username: $username}
    where: { id: $userId }
  ) {
    id
    name
    username
    email
  }
}
`;

export default async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const { name, username } = JSON.parse(req.body);

    const { user } = await hygraphClient.request(UpdateNextUser, {
      userId: session.userId,
      name,
      username,
    });

    res.json(user);
  } else {
    res.send({
      error: 'You must be signed in to update your account.',
    });
  }
};