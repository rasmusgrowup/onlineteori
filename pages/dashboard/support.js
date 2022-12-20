// Imports
import Sidebar from '../../components/Sidebar'
import Preferences from '../../components/Preferences'
import Calendar from "../../components/Calendar";
import User from '../../components/User'
import { useState, useEffect } from 'react'

import style from '../../styles/support.module.scss'
import header from '../../styles/header.module.scss'
import typo from '../../styles/typo.module.scss'

// Icons
import RocketChat from "../../components/Icons/RocketChat";
import Phone from "../../components/Icons/Phone";

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
      id
      userPic {
        url
      }
      pages {
        slug
      }
      point
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
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <>
            <Sidebar />
            <section className={style.main}>
                <header className={header.header}>
                    <User navn={user.name} src={user.userPic.url}/>
                    <Preferences />
                </header>
                <div className={style.grid}>
                    <div className={`${style.gridItem} ${style.driftStatus}`} data-width='half' data-height='2'>
                        <p>Der er ingen driftforstyrrelser</p>
                    </div>
                    <div className={style.gridItem} data-width='half' data-height='2'>
                        <p>Dit bruger-id er:<br/><span style={{ fontFamily: 'monospace', color: 'var(--pinkAccent)' }}> {user.id}</span></p>
                    </div>
                    <div className={style.gridItem} data-width='half' data-height='2'>
                        <RocketChat />
                        <p>Chat med os direkte mellem <br/> 08:00 - 20:00</p>
                    </div>
                    <div className={style.gridItem} data-width='half' data-height='2'>
                        <Phone />
                        <h3>+45 70 80 70 90</h3>
                        <p>Ring til os mellem <br/>08:00 - 20:00</p>
                    </div>
                    <div className={style.gridItem} data-width='full' data-height='4'>
                        <h3>Ofte stillede spørgsmål</h3>
                        <ul>
                            <li>Hvordan ændrer jeg mit password?</li>
                            <li>Hvordan ændrer jeg mine betalingsoplysninger?</li>
                            <li>Hvilke data indsamler Onlineteori om mig?</li>
                            <li>Hvor mange køreprøver er der inkluderet i jeres abonnementer?</li>
                            <li>Hvordan nulstiller jeg min bruger?</li>
                        </ul>
                    </div>
                </div>
                <Calendar />
            </section>
        </>
    )
}