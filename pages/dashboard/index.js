// Imports
import User from '../../components/User'
import style from '../../styles/dashboard.module.scss'
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request'; // gql
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'

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
        <header className={style.header}>
          <User navn={user.name} src={user.userPic.url}/>
        </header>
        <h1>Velkommen tilbage, <br /> {user.name}</h1>
        <div>{children}</div>
        <Footer />
      </section>
    </>
  )
}