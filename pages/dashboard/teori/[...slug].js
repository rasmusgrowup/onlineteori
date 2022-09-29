import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'

// Components
import Sidebar from '../../../components/Sidebar' // Sidebar for page
import User from '../../../components/User' // User profile
import Footer from '../../../components/Footer' // Footer for page
import TeoriNav from '../../../components/TeoriNav' // Navigation for pages in theory book

import style from '../../../styles/dashboard.module.scss' // Styling import
import components from '../../../styles/components.module.scss' // Styling import

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

const GetTheoryBook = gql`
	query GetTheoryBook {
		theoryBook(where: {title: "Kategori B"}) {
			id
			slug
			title
			intro { html }
			parts {
				id
				title
				slug
				pages {
					content { html }
					title
					slug
				}
			}
		}
	}
`;

const GetPageBySlug = gql`
	query GetPageBySlug($slug: String!) {
	    page: page(where: { slug: $slug }) {
			content { html }
			title
			slug
	    	id
	    }
	}
`;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	console.log(context.query.slug)

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

	const { page } = await hygraphClient.request(GetPageBySlug, {
		slug: context.query.slug.toString(),
	});

	return {
		props: {
			user,
			theoryBook,
			page,
		},
	};
}


export default function Page({ user, theoryBook, page }) {
	const router = useRouter()
	const slug = router.query.slug || [];
	const [parts, setParts] = useState([...theoryBook.parts])
	const [pages, setPages] = useState([...parts[0].pages])
	const [index, setIndex] = useState(pages.findIndex(e => e.slug === slug.toString()))
	const [nextPage, setNextPage] = useState(pages[index+1])
	const [prevPage, setPrevPage] = useState(pages[index-1])

	console.log(pages.length)

	return (
		<section className={style.main}>
			<Sidebar />
			<header className={style.header}>
        		<User navn={user.name} src={user.userPic.url}/>
			</header>
			<TeoriNav array={parts}/>
			<div className={style.chapterContent}>
				<h1>{page.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: `${page.content.html}` }}></div>
				<div className={style.buttonsContainer}>
					{ index > 0 &&  <Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${prevPage.slug}`}><a className={components.darkButton}>Forrige</a></Link>}
					{ index < pages.length -1 && <Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${nextPage.slug}`}><a className={components.darkButton}>Næste</a></Link>}
				</div>
			</div>
			<Footer />
		</section>
	)
}