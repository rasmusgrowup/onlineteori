// Imports
import User from '../../../components/User'
import style from '../../../styles/dashboard.module.scss'
import typo from '../../../styles/typo.module.scss'
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request'; // gql
import Sidebar from '../../../components/Sidebar'
import Footer from '../../../components/Footer'

import Image from 'next/image'
import Plus from '../../../public/gradients/Plus.png' // Big plus gradient icon

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

function NewTest() {
  return (
    <div className={style.newTest}>
      <p><strong>Start en ny prøve.</strong> Du har taget 10 ud af 15 mulige prøver.</p>
      <div className={style.plusContainer}>
        <Image src={Plus} layout='responsive' quality='100'/>
      </div>
    </div>
  )
}

export default function Proever({ user }) {
	return (
    <>
      <Sidebar />
      <section className={style.main}>
        <header className={style.header}>
          <User navn={user.name} src={user.userPic.url}/>
        </header>
        <NewTest />
        <Footer />
      </section>
    </>
  )
}