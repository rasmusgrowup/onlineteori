// Components
import Sidebar from '../../../components/Sidebar' // Sidebar for page
import User from '../../../components/User' // User profile
import Footer from '../../../components/Footer' // Footer for page
import TeoriNav from '../../../components/TeoriNav' // Navigation for pages in theory book

import style from '../../../styles/dashboard.module.scss' // Styling import

import { getSession } from 'next-auth/react'; // Session import
import { useState } from 'react'; // useState() import

// Hygraph imports
import { hygraphClient } from '../../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request';
import components from "../../../styles/components.module.scss";
import Link from "next/link";
import { useRouter } from "next/router"; // gql

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

const GetTheoryBook = gql`
	query GetTheoryBook {
		theoryBook(where: {title: "Kategori B"}) {
			id
			slug
			title
			intro {
				html
			}
			parts {
				id
				title
				slug
				pages {
				content {
					html
				}
				title
				slug
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

function Content({ content }) {
	const [page, setPage] = useState(content.parts[0].pages[0]);
	console.log(page)

	return (
		<div className={style.chapterContent}>
			<h1>{content.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: `${content.intro.html}` }}></div>
			<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${page.slug}`}><a className={components.darkButton}>Fortsæt</a></Link>
		</div>
	)
}

export default function Teori({ user, theoryBook }) {
	const [parts, setParts] = useState([...theoryBook.parts])

	return (
		<section className={style.main}>
			<Sidebar />
			<header className={style.header}>
				<User navn={user.name} src={user.userPic.url}/>
			</header>
			<TeoriNav array={parts}/>
			<Content content={theoryBook} />
			<Footer />
		</section>
	)
}