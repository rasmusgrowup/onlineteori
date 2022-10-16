import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Components
import User from '../../../components/User' // User profile
import Footer from '../../../components/Footer' // Footer for page
import Sidebar from "../../../components/Sidebar";

import dash from '../../../styles/dashboard.module.scss' // Styling import
import style from '../../../styles/test.module.scss' // Styling import
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

const GetTestBySlug = gql`
	query GetTestBySlug($slug: String!) {
	    theoryTest: theoryTest(where: { slug: $slug }) {
			id
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
                    expectedAnswer
                    id
                    userAnswer
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

    const { theoryTest } = await hygraphClient.request(GetTestBySlug, {
        slug: context.query.slug.toString(),
    });

    return {
        props: {
            user,
            theoryTest
        },
    };
}

function Test ({ question, i, index, questionsLength, active, completed, ...props }) {
    const [answers, setAnswers] = useState(question.answers)
    const [userAnswers, setUserAnswers] = useState(question.answers.map((a) => null))
    const [expectedAnswers, setExpectedAnswers] = useState(question.answers.map((a) => a.expectedAnswer))
    const [passed, setPassed] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const {result, setResult} = props;

    const checkIfPassed = () => {
        if (JSON.stringify(userAnswers) == JSON.stringify(expectedAnswers)) {
            setPassed(true),
            setResult([result[index] = true, ...result].slice(1))
        } else (
            setPassed(false)
        )
        setShowResult(false)
    }

    console.log(expectedAnswers)

    return (
        <div className={ active || completed ? `${style.questionContainer} ${style.activeQuestion}` : `${style.questionContainer}`} key={i}>
            <div className={style.imageContainer}>
                <Image src={question.image.url} width={question.image.width} height={question.image.height} objectFit="cover" layout="responsive" />
            </div>
            <div className={style.inner}>
                <h2 className={style.question}>{question.question}</h2>
                { answers.map((answer, i) => (
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
                { completed &&
                    <div>
                        Rigtige svar: { expectedAnswers.map((e) => (<span>{e === true ? 'ja' : 'nej'}, </span>))}
                    </div>
                }
            </div>
        </div>
    )
}

export default function Page({ user, theoryTest }) {
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState(theoryTest.questions.map(q => null))
    const [completed, setCompleted] = useState(null)

    return (
        <section className={dash.main}>
            <Sidebar />
            <header className={dash.header}>
                <User navn={user.name} src={user.userPic.url}/>
            </header>
            { completed &&
                <div>
                    Du fik {result.filter(Boolean).length} ud af {theoryTest.questions.length} rigtige.
                </div>
            }
            { theoryTest.questions.map((question, i) => (
                <Test
                    question={question}
                    key={i}
                    index={index}
                    active={index === i}
                    completed={completed}
                    questionsLength={theoryTest.questions.length}
                    setResult={setResult}
                    result={result}
                />
            ))}
            <div className={style.buttonsContainer}>
                { index > 0 && index < theoryTest.questions.length -1 && <button onClick={() => setIndex(index-1)} className={components.blueButton}>Forrige</button>}
                { index < theoryTest.questions.length -1 && <button onClick={() => setIndex(index+1)} className={components.blueButton}>Næste</button>}
                { index === theoryTest.questions.length -1 && <button onClick={() => {
                    setIndex(index + 1);
                    setCompleted(true)
                }} className={components.blueButton}>Vis resultat</button>}
            </div>
            <Footer />
        </section>
    )
}
