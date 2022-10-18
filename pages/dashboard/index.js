// Imports
import Sidebar from '../../components/Sidebar'
import Preferences from '../../components/Preferences'
import User from '../../components/User'
import Calendar from '../../components/Calendar'
import { useState } from 'react'

import style from '../../styles/dashboard.module.scss'
import header from '../../styles/header.module.scss'
import typo from '../../styles/typo.module.scss'

// Charts
import CircleChart from "../../components/Icons/CircleChart";
import BoxChart from "../../components/Icons/BoxChart";

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
  const [fullname, setFullname] = useState((user.name).split(' '))
  const [firstname, setFirstname] = useState(fullname[0])
  const [lastname, setLastname] = useState(fullname[1])
  console.log(fullname)

  return (
    <>
      <Sidebar />
      <section className={style.main}>
        <header className={header.header}>
          <User navn={user.name} src={user.userPic.url}/>
          <Preferences />
        </header>
        <div className={style.grid}>
          <div className={style.gridItem} data-width='third' data-height='2' data-mobile-width='full'>
            <h1 className={typo.gradient}>Halløj, <br />{firstname}</h1>
            <span>Login streak: 5 dage</span>
          </div>
          <div className={style.gridItem} data-width='third' data-height='2' data-mobile-width='half'>
            <div className={style.circleChart}><CircleChart /></div>
            <span>Teori gennemført</span>
          </div>
          <div className={style.gridItem} data-width='third' data-height='2' data-mobile-width='half'>
            <div className={style.boxChart}><BoxChart /></div>
            <span>Seneste prøver</span>
          </div>
          <div className={style.gridItem} data-width='full' data-height='2' data-mobile-width='full'>
            <div className={style.leftInner}></div>
            <div className={style.rightInner}></div>
          </div>
          <div className={style.gridItem} data-width='fourth' data-height='2' data-mobile-width='full'></div>
          <div className={style.gridItem} data-width='third' data-height='2' data-mobile-width='full'></div>
        </div>
        <Calendar />
      </section>
    </>
  )
}