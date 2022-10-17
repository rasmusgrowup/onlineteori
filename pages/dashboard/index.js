// Imports
import Sidebar from '../../components/Sidebar'
import Preferences from '../../components/Preferences'
import User from '../../components/User'
import Calendar from '../../components/Calendar'

import style from '../../styles/dashboard.module.scss'
import header from '../../styles/header.module.scss'

// Hygraph
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request'; // gql

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

export default function Dashboard({ user, children }) {
	return (
    <>
      <Sidebar />
      <section className={style.main}>
        <header className={header.header}>
          <User navn={user.name} src={user.userPic.url}/>
          <Preferences />
        </header>
        <h1>Velkommen tilbage, <br /> {user.name}</h1>
        <Calendar />
      </section>
    </>
  )
}