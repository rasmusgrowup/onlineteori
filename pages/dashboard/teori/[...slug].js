import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'

// Components
import Sidebar from '../../../components/Sidebar' // Sidebar for page
import User from '../../../components/User' // User profile
import Footer from '../../../components/Footer' // Footer for page
import TeoriNav from '../../../components/TeoriNav' // Navigation for pages in theory book

import style from '../../../styles/dashboard.module.scss' // Styling import
import components from '../../../styles/components.module.scss' // Styling import
import ChevronRight from '../../../components/Icons/ChevronRight' // Chevron right SVG icon
import ChevronLeft from '../../../components/Icons/ChevronLeft' // Chevron right SVG icon

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
					__typename
					content { html }
					title
					slug
				}
				stopTests {
					__typename
					title
					slug
					questions {
						question
						isCompleted
						answers {
							answer
							userAnswer
							expectedAnswer
						}
					}
				}
				contents {
					... on Page {
						id
						__typename
						content { html }
						title
						slug
					}
					... on StopTest {
						id
						__typename
						title
						slug
						questions {
							id
							question
							isCompleted
							image {
								url
							}
							answers {
								id
								answer
								userAnswer
								expectedAnswer
							}
						}
					}
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

const GetStopTestBySlug = gql`
	query GetStopTestBySlug($slug: String!) {
	    stopTest: stopTest(where: { slug: $slug }) {
			__typename
			title
			slug
			questions {
				question
				isCompleted
				image {
					url
					height
					width
				}
				answers {
					answer
					userAnswer
					expectedAnswer
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

	const { page } = await hygraphClient.request(GetPageBySlug, {
		slug: context.query.slug.toString(),
	});

	const { stopTest } = await hygraphClient.request(GetStopTestBySlug, {
		slug: context.query.slug.toString(),
	});

	return {
		props: {
			user,
			theoryBook,
			page,
			stopTest,
		},
	};
}

function Pill() {
	const [on, setOn] = useState(false);
	return (
		<div className={style.pill} onClick={() => setOn(!on)}>
			<span className={ on ? `${style.dot} ${style.dotOn}` : `${style.dot}`}></span>
		</div>
	)
}


export default function Page({ user, theoryBook, page, stopTest }) {
	const router = useRouter()
	const slug = router.query.slug || [];
	const [parts, setParts] = useState([...theoryBook.parts])
	const [partsIndex, setPartsIndex] = useState(parts.findIndex(e => e.contents.some(p => p.slug === slug.toString())))
	const [contents, setContents] = useState(parts.map((p) => p.contents).flat())
	const [contentIndex, setContentIndex] = useState(contents.findIndex(e => e.slug === slug.toString()))
	const [nextPage, setNextPage] = useState(contents[contentIndex+1])
	const [prevPage, setPrevPage] = useState(contents[contentIndex-1])

	return (
		<section className={style.main}>
			<Sidebar />
			<header className={style.header}>
        		<User navn={user.name} src={user.userPic.url}/>
			</header>
			<TeoriNav array={parts}/>
			<div className={style.chapterContent}>
				{ contents[contentIndex].__typename === 'Page' ?
				<>
					<span>{parts[partsIndex].contents.findIndex(e => e.slug === slug.toString()) + 1} / {parts[partsIndex].contents.length}</span>
 					<h1 className={style.title}>{page.title}</h1>
					<div dangerouslySetInnerHTML={{__html: `${page.content.html}`}} className={style.richText}></div>
					<div className={style.buttonsContainer}>
						{contentIndex > 0 && contentIndex < contents.length -1 &&
							<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${prevPage.slug}`}>
								<a className={components.lightButton}><span className={style.prev}><ChevronLeft /></span>Forrige</a>
							</Link>
						}
						{contentIndex < contents.length -1 &&
							<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${nextPage.slug}`}>
								<a className={components.lightButton}>Næste<span className={style.next}><ChevronRight /></span></a>
							</Link>
						}
						{contentIndex === contents.length -1 &&
							<Link href="/dashboard/teori">
								<a className={components.blueButton}>Afslut</a>
							</Link>
						}
					</div>
				</> :
				<>
					<h1 className={style.title}>{stopTest.title}</h1>
					<p className={style.richText}>Du kan nu lade dig teste i læsestoffet, du netop har gennemgået. Testen er for din egen skyld, så du kan holde øje med dine fremskridt. Du kan tage testen så mange gange du vil.</p>
					{ stopTest.questions.map((question, i) => (
						<div className={style.questionContainer} key={i}>
							<div className={style.imageContainer}>
								<Image src={question.image.url} width={question.image.width} height={question.image.height} objectFit="cover" layout="responsive" />
							</div>
							<div className={style.inner}>
							<h2 className={style.question}>{question.question}</h2>
							{question.answers.map((answer, i) => (
								<div key={i} className={style.answerContainer}>
									<div className={style.answer}>{answer.answer}</div>
									<Pill />
								</div>
							))}
							</div>
						</div>
					))}
					<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${nextPage.slug}`}>
						<a className={components.blueButton}>Afslut test</a>
					</Link>
				</>
				}
			</div>
			<Footer />
		</section>
	)
}