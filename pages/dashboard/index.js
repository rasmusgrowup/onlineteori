// Imports
import User from '../../components/User'
import style from '../../styles/dashboard.module.scss'
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request'; // gql
import Sidebar from '../../components/Sidebar'

const GetUserProfileById = gql`
  query GetUserProfileById($id: ID!) {
    user: nextUser(where: { id: $id }) {
      email
      name
      username
      userPic {
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

  const { user } = await hygraphClient.request(GetUserProfileById, {
    id: session.userId,
  });

  return {
    props: {
      user,
    },
  };
}

export default function Dashboard({ user }) {
  console.log({ user })

	return (
    <>
      <Sidebar />
      <section className={style.main}>
        <h1>Hej, {user.username}</h1>
        <User
          navn={user.name}
          src={user.userPic.url}
          konto={user.email}
          username={user.username}
          />
      </section>
    </>
  )
}