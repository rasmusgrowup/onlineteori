// Imports
import Sidebar from '../../components/Sidebar'
import Preferences from '../../components/Preferences'
import User from '../../components/User'
import Calendar from '../../components/Calendar'
import { useState, useEffect } from 'react'

import style from '../../styles/dashboard.module.scss'
import header from '../../styles/header.module.scss'
import typo from '../../styles/typo.module.scss'
import components from '../../styles/components.module.scss' // Styling import
import styled from 'styled-components'

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
      pages {
        slug
      }
      point
    }
  }
`;

const GetTheoryBook = gql`
	query GetTheoryBook {
		theoryBook(where: {title: "Kategori B"}) {
			id
			parts {
				contents {
					... on Page {
						id
					}
					... on StopTest {
						id
					}
				}
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

  const { theoryBook } = await hygraphClient.request(GetTheoryBook);

  return {
    props: {
      user,
      theoryBook,
    },
  };
}

const PieChart = styled.div`
  --p: ${props => props.percent || "0"};
  --w: 100px;
  --c: var(--greenAccent);
  --b: 8px;
  width: var(--w);
  height: var(--w);
  aspect-ratio: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  font-size: 25px;
  font-weight: bold;
  font-family: monospace;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: 0;
    background: radial-gradient(farthest-side, var(--c) 98%, #0000) top/var(--b) var(--b) no-repeat,
    conic-gradient(var(--c) calc(var(--p) * 1%), #0000 0),
    conic-gradient(var(--primaryLineColor) 100%, #0000 0);
    -webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - var(--b)), #000 calc(100% - var(--b)));
    mask: radial-gradient(farthest-side, #0000 calc(99% - var(--b)), #000 calc(100% - var(--b)));
  }

  &:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    inset: calc(50% - var(--b) / 2);
    background: var(--c);
    transform: rotate(calc(var(--p) * 3.6deg)) translateY(calc(50% - var(--w) / 2));
  }
`

export default function Dashboard({ user, theoryBook }) {
  const [loaded, setLoaded] = useState(false)
  const [fullname, setFullname] = useState((user.name).split(' '))
  const [firstname, setFirstname] = useState(fullname[0])
  const [lastname, setLastname] = useState(fullname[1])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [contents, setContents] = useState(theoryBook.parts.map((p) => p.contents).flat())
  const [userPages, setUserPages] = useState([...user.pages])
  const [percent, setPercent] = useState(Math.round((100 / contents.length) * userPages.length))
  const [points, setPoints] = useState(user.point)

  useEffect(() => {
    setLoaded(true)
  }, [])

  console.log(percent)

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
            { loaded ? <PieChart percent={percent}>{percent}%</PieChart> : <div style={{ height: '100px', width: '100px'}} /> }
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
            <h1 className={typo.gradient} style={{ fontSize: '3em' }}>{points}</h1>
            <span>Samlede point</span>
          </div>
          <div className={style.gridItem} data-width='third' data-height='1' data-mobile-width='full'>
            <h1 className={typo.gradient} style={{ fontSize: '3em' }}>#1</h1>
            <span>Placering på dit hold</span>
          </div>
        </div>
        <Calendar />
      </section>
    </>
  )
}