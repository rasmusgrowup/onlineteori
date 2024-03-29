import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Components
import User from '../../../components/User' // User profile
import Sidebar from "../../../components/Sidebar";
import Preferences from "../../../components/Preferences";

import style from '../../../styles/test.module.scss' // Styling import
import components from '../../../styles/components.module.scss' // Styling import
import header from '../../../styles/header.module.scss' // Styling import

// Hygraph imports
import { hygraphClient } from '../../../lib/hygraph'; // GraphCMS
import { getSession } from 'next-auth/react'; // Session import
import { gql } from 'graphql-request';
import Speaker from "../../../components/Icons/Speaker";
import SpeakerMute from "../../../components/Icons/SpeakerMute"; // gql

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
                id
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

    return (
        <div className={ active || completed ? `${style.questionContainer} ${style.activeQuestion}` : `${style.questionContainer}`} key={i}>
            <div className={style.imageContainer}>
                <Image src={question.image.url} width="550" height="400" objectFit="cover" layout="responsive" />
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
                        Rigtige svar: { expectedAnswers.map((e, i) => (
                            <span key={i}>{e === true ? 'ja' : 'nej'}, </span>
                        ))}
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
    const [speaker, setSpeaker] = useState(true);

    return (
        <>
            <Sidebar />
            <section className={style.main}>
                <header className={header.header}>
                    <User navn={user.name} src={user.userPic.url}/>
                    <Preferences />
                </header>
                { completed &&
                    <div className={style.theoryTestResult}>
                        <div className={style.testResult}>
                            Du fik {result.filter(Boolean).length} ud af {theoryTest.questions.length} rigtige.
                        </div>
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
                {
                    !completed && (
                    <div className={style.bottomContainer}>
                        <div className={style.leftContainer}>
                            <div className={style.questionIndex}>{index + 1} / {theoryTest.questions.length}</div>
                            <div className={style.speakerIcon} onClick={() => setSpeaker(!speaker)}>{ speaker ? <Speaker /> : <SpeakerMute />}</div>
                        </div>
                        <div className={style.buttonsContainer}>
                            { index > 0 && index <= theoryTest.questions.length -1
                                ? <button onClick={() => setIndex(index-1)} className={components.blueButton}>Forrige</button>
                                : <div className={components.blueButton} style={{ opacity: 0.2}}>Forrige</div>
                            }
                            { index < theoryTest.questions.length -1 && <button onClick={() => setIndex(index+1)} className={components.blueButton}>Næste</button>
                            }
                            { index === theoryTest.questions.length -1 && <button onClick={() => {
                                setIndex(index + 1);
                                setCompleted(true)
                            }} className={components.blueButton}>Afslut</button>}
                        </div>
                    </div>
                    )
                }
            </section>
        </>
    )
}
