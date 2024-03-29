import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Components
import Sidebar from '../../../components/Sidebar' // Sidebar for page
import User from '../../../components/User' // User profile
import TeoriNav from '../../../components/TeoriNav' // Navigation for pages in theory book
import Preferences from '../../../components/Preferences'

import style from '../../../styles/theory.module.scss' // Styling import
import components from '../../../styles/components.module.scss' // Styling import
import header from '../../../styles/header.module.scss' // Styling import

import ChevronRight from '../../../components/Icons/ChevronRight' // Chevron right SVG icon
import ChevronLeft from '../../../components/Icons/ChevronLeft' // Chevron right SVG icon

import { getSession } from 'next-auth/react'; // Session import

// Hygraph imports
import { hygraphClient } from '../../../lib/hygraph'; // GraphCMS
import { gql } from 'graphql-request'; // gql

const GetUserProfileById = gql`
	query GetUserProfileById($id: ID!) {
	    user: nextUser(where: { id: $id }) {
	    	id
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
			slug
			title
			intro { html }
			parts {
				id
				title
				slug
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

function StopTest({ question, i}) {
	const [answers, setAnswers] = useState(question.answers)
	const [userAnswers, setUserAnswers] = useState(question.answers.map((a) => null))
	const [expectedAnswers, setExpectedAnswers] = useState(question.answers.map((a) => a.expectedAnswer))
	const [passed, setPassed] = useState(null)
	const [showResult, setShowResult] = useState(false)

	const checkIfPassed = () => {
		if (JSON.stringify(userAnswers) == JSON.stringify(expectedAnswers)) {
			setPassed(true)
		} else (
			setPassed(false)
		)
		setShowResult(false)
	}

	return (
		<div className={style.questionContainer} key={i}>
			<div className={style.imageContainer} style={{ display: 'none' }}>
				<Image src={question.image.url} width={question.image.width} height={question.image.height} objectFit="cover" layout="responsive" />
			</div>
			<div className={style.inner}>
				<h2 className={style.question}>{question.question}</h2>
				{question.answers.map((answer, i) => (
					<div key={i} className={style.answerContainer}>
						<div className={style.answer}>{answer.answer}</div>
						<div className={components.testButtonContainer}>
							<button
								onClick={() => {
								setUserAnswers([userAnswers[i] = true, ...userAnswers].slice(1));
								checkIfPassed()}}
								className={ userAnswers[i] === true ? `${components.testButtonSelected}` : `${components.testButton}`}
							>
								Ja
							</button>
							<button
								onClick={() => {
								setUserAnswers([userAnswers[i] = false, ...userAnswers].slice(1));
								checkIfPassed()}}
								className={ userAnswers[i] === false ? `${components.testButtonSelected}` : `${components.testButton}`}
							>
								Nej
							</button>
						</div>
					</div>
				))}
				<button className={components.blueButton} onClick={() => setShowResult(true)}>Afgiv svar</button>
				{ showResult &&
					<div className={ passed? `${style.testResult} ${style.testPassed}` : `${style.testResult} ${style.testFailed}`}>Dine svar er { passed ? "korrekte" : "IKKE korrekte"}</div>
				}
			</div>
		</div>
	)
}


export default function Page({ user, theoryBook, page, stopTest }) {
	const router = useRouter()
	const slug = router.query.slug || [];
	const slugString = slug.toString();
	const [userPoints, setUserPoints] = useState(user.point)
	const [parts, setParts] = useState([...theoryBook.parts])
	const [userPages, setUserPages] = useState([...user.pages])
	const [partsIndex, setPartsIndex] = useState(parts.findIndex(e => e.contents.some(p => p.slug === slug.toString())))
	const [contents, setContents] = useState(parts.map((p) => p.contents).flat())
	const [contentIndex, setContentIndex] = useState(contents.findIndex(e => e.slug === slug.toString()))
	const [nextPage, setNextPage] = useState(contents[contentIndex+1])
	const [prevPage, setPrevPage] = useState(contents[contentIndex-1])

	const updateProgress = async ({slugString}) => {
		try {
			const res = await fetch('/api/update-progress', {
				method: 'POST',
				body: JSON.stringify({slugString}),
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const updatePoints = async ({points}) => {
		try {
			const res = await fetch('/api/update-points', {
				method: 'POST',
				body: JSON.stringify({points}),
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		updateProgress({slugString, userPoints})
		if (!userPages.some(e => e.slug === slug.toString())) {
			console.log("true")
			let points = userPoints + 50;
			updatePoints({points})
		}
	}, [])

	return (
		<>
			<Sidebar />
			<section className={style.main}>
				<header className={header.header}>
					<User navn={user.name} src={user.userPic.url}/>
					<Preferences />
				</header>
				<TeoriNav array={parts} userPages={userPages}/>
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
							<StopTest question={question} key={i} />
						))}
						<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${nextPage.slug}`}>
							<a className={components.darkButton}>Afslut test og gå videre</a>
						</Link>
					</>
					}
				</div>
			</section>
		</>
	)
}