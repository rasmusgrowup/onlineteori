// Imports
import Image from 'next/image'
import Link from 'next/link'
import User from '../../../components/User'
import Sidebar from '../../../components/Sidebar'
import Preferences from '../../../components/Preferences'

import style from '../../../styles/dashboard.module.scss'
import header from '../../../styles/header.module.scss'

import Plus from '../../../public/gradients/plus.png' // Big plus gradient icon
import { motion } from "framer-motion" // Animation library

// Hygraph imports
import { getSession } from 'next-auth/react'; // Session
import { hygraphClient } from '../../../lib/hygraph'; // GraphCMS
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

function NewTest() {
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className={style.newTest}>
      <Link href="proever/test-af-teoriprove">
        <a>
          <p><strong>Start en ny prøve.</strong> Du har taget 10 ud af 15 mulige prøver.</p>
          <div className={style.plusContainer}>
            <Image src={Plus} layout='responsive' quality='100' priority='true'/>
          </div>
        </a>
      </Link>
    </motion.div>
  )
}

const proever = [
  ['Bestået', '97/100', '11/10/22'],
  ['Bestået', '98/100', '11/10/22'],
  ['Ikke bestået', '90/100', '11/10/22'],
  ['Bestået', '95/100', '11/10/22'],
  ['Ikke bestået', '82/100', '11/10/22'],
  ['Ikke bestået', '92/100', '11/10/22'],
  ['Bestået', '83/100', '11/10/22'],
  ['Ikke bestået', '74/100', '11/10/22'],
  ['Ikke bestået', '73/100', '11/10/22'],
  ['Ikke bestået', '73/100', '11/10/22']
];

export default function Proever({ user }) {
	return (
    <>
      <Sidebar />
      <section className={style.main}>
        <header className={header.header}>
          <User navn={user.name} src={user.userPic.url}/>
          <Preferences />
        </header>
        <div className={style.grid}>
          <div className={style.col1}>
            <NewTest />
            <div className={style.testContainer}>
              <h2>Seneste 5 prøver</h2>
              <div className={style.testList}>
                {proever.slice(0, 5).map((proeve, i) => (
                  <div key={i} className={ proeve[0] == 'Bestået' ? `${style.testItem} ${style.passed}` : `${style.testItem}`}>
                    <div className={style.result}>{proeve[0]}</div>
                    <div className={style.score}>{proeve[1]}</div>
                    <div className={style.date}>{proeve[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={style.col2}>
            <div className={style.recommendations}>
              <div className={style.recommendation}>
                <h2>To i streg.</h2>
                <p>Du har bestået to tests i træk. Din seneste score var 97/100. Meget flot!</p>
              </div>
              <div className={style.recommendation}>
                <h2>Læs om dette.</h2>
                <p>Vi anbefaler at du læser afsnittet om <span stlye={{ color: 'var(--linkBlue)'}}>højresving</span>, inden du tager flere prøver, da dine fejl ofte sker i den katagori.</p>
              </div>
              <div className={style.recommendation}>
                <h2>Du er snart klar.</h2>
                <p>Vi anbefaler at du består fem test i streg, før du melder dig til en køreprøve.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}