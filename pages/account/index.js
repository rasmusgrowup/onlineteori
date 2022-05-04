//Components
import BackendLayout from '../../components/BackendLayout'
import User from '../../components/User'
import Continue from '../../components/Continue'

// Session
import { getSession } from 'next-auth/react';

// GraphCMS
import { graphcmsClient } from '../../lib/graphcms';
import { gql } from 'graphql-request';

const GetUserProfileById = gql`
  query GetUserProfileById($id: ID!) {
    user: nextUser(where: { id: $id }) {
      navn
      email
      image {
        url
      }
    }
  }
`;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { user } = await graphcmsClient.request(GetUserProfileById, {
    id: session.userId,
  });

  return {
    props: {
      user,
    },
  };
}

export default function AccountPage({ user }) {
  console.log({ user })

  return (
    <BackendLayout>
      <User
        src={user.image.url}
        navn={user.navn}
        konto={user.email}
      />
      <Continue />
    </BackendLayout>
  )
}
