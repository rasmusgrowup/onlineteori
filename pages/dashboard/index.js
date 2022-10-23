// Imports
import Sidebar from '../../components/Sidebar'
import Preferences from '../../components/Preferences'
import User from '../../components/User'
import Calendar from '../../components/Calendar'
import { useState } from 'react'

import style from '../../styles/dashboard.module.scss'
import header from '../../styles/header.module.scss'
import typo from '../../styles/typo.module.scss'
import components from '../../styles/components.module.scss' // Styling import

// Charts
import CircleChart from "../../components/Icons/CircleChart";
import BoxChart from "../../components/Icons/BoxChart";
import BigGraph from "../../components/Icons/BigGraph";

// Hygraph
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request';

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
  const [selectedAnswer, setSelectedAnswer] = useState(null)

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
          <div className={style.gridItem} data-width='full' data-height='3' data-mobile-width='full'>
            <h2 className={typo.gradient}>Dagens spørgsmål</h2>
            <div className={style.quote}>Hvad er den lovmæssige minimumsdybde på bilens dækmønster?</div>
            <div className={components.testButtonContainer}>
              <button
                  onClick={() => setSelectedAnswer('0')}
                  className={ selectedAnswer === '0' ? `${components.altTestButtonSelected}` : `${components.altTestButton}`}
              >
                1,6 cm.
              </button>
              <button
                  onClick={() => setSelectedAnswer('1')}
                  className={ selectedAnswer === '1' ? `${components.altTestButtonSelected}` : `${components.altTestButton}`}
              >
                0,6 cm.
              </button>
              <button
                  onClick={() => setSelectedAnswer('2')}
                  className={ selectedAnswer === '2' ? `${components.altTestButtonSelected}` : `${components.altTestButton}`}
              >
                1,6 mm.
              </button>
            </div>
          </div>
          <div className={style.gridItem} data-width='fourth' data-height='2' data-mobile-width='full'>
            <h2 className={typo.gradient}>Udvikling i point</h2>
            <div className={style.bigGraph}><BigGraph /></div>
            <span>Antal point pr. login</span>
          </div>
          <div className={style.gridItem} data-width='third' data-height='1' data-mobile-width='full'>
            <h1 className={typo.gradient} style={{ fontSize: '3em' }}>2.445</h1>
            <span>Samlede point</span>
          </div>
          <div className={style.gridItem} data-width='third' data-height='1' data-mobile-width='full'>
            <h1 className={typo.gradient} style={{ fontSize: '3em' }}>#3</h1>
            <span>Placering på dit hold</span>
          </div>
        </div>
        <Calendar />
      </section>
    </>
  )
}