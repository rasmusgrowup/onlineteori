// Components
import Sidebar from '../../../components/Sidebar'
import User from '../../../components/User'
import Footer from '../../../components/Footer'
import Image from 'next/image'
import { useState } from 'react'

import GreenDot from '../../../components/icons/GreenDot'
import List from '../../../components/icons/List'

import style from '../../../styles/dashboard.module.scss' // Styling import

import { getSession } from 'next-auth/react'; // Session import

// Hygraph imports
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

const GetSubjectsAndChapters = gql`
  query SubjectsAndChapters {
	subjects {
	    id
	    titel
	    chapters {
	    	id
	    	titel
	    	completed
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

  const { subjects } = await hygraphClient.request(GetSubjectsAndChapters);

  return {
    props: {
      user,
      subjects,
    },
  };
}

function Nav({ array }) {
	const [openNav, setOpenNav] = useState(false);
	const handleNav = () => {
		setOpenNav(!openNav)
	}
	console.log(openNav)

	return (
		<aside className={ openNav ? `${style.teoriNav} ${style.open}` : `${style.teoriNav} ${style.close}`}>
			<header className={style.navHeader} onClick={() => setOpenNav(!openNav)}>
				Afsnit
				<List />
			</header>
			<div className={style.teoriNavTable}>
			{ array.map((subject, i) => (
				<ul key={i}>
				<div>{subject.titel}</div>
				{ subject.chapters.map((chapter, i) => (
					<li key={i}>
						{chapter.titel}
						{ chapter.completed && <span className={style.checkmark}><GreenDot /></span>}
					</li>
				))}
				</ul>
			))}
			</div>
		</aside>
	)
}

function Content() {
	return (
		<div className={style.chapterContent}>
			<span>Introduktion</span>
			<h1>Første kapitel</h1>
			<p>
	          Importantly, Next.js lets you choose which pre-rendering form you&apos;d like to use for each page. You can create a &quot;hybrid&quot; Next.js app by using Static Generation for most pages and using Server-side Rendering for others.<br/><br/>
	          We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.<br/><br/>
	          You can also use Client-side Rendering along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by client side JavaScript. To learn more, take a look at the Data Fetching documentation.
	        </p>
	        <p>
	          Importantly, Next.js lets you choose which pre-rendering form you&apos;d like to use for each page. You can create a &quot;hybrid&quot; Next.js app by using Static Generation for most pages and using Server-side Rendering for others.<br/><br/>
	          We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.<br/><br/>
	          You can also use Client-side Rendering along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by client side JavaScript. To learn more, take a look at the Data Fetching documentation.
	        </p>
	        <p>
	          Importantly, Next.js lets you choose which pre-rendering form you&apos;d like to use for each page. You can create a &quot;hybrid&quot; Next.js app by using Static Generation for most pages and using Server-side Rendering for others.<br/><br/>
	          We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.<br/><br/>
	          You can also use Client-side Rendering along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by client side JavaScript. To learn more, take a look at the Data Fetching documentation.
	        </p>
		</div>
	)
}

export default function Teori({ user, subjects }) {

	return (
		<section className={style.main}>
			<Sidebar />
			<header className={style.header}>
	          <User navn={user.name} src={user.userPic.url}/>
	        </header>
	        <Nav array={subjects}/>
	        <Content />
	        <Footer />
		</section>
	)
}