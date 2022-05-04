// scss
import scss from '../styles/nav.module.scss'

// components
import Link from "next/link"
import { motion } from "framer-motion"

// GraphCMS
import { graphcmsClient } from '../lib/graphcms';
import { gql, request } from 'graphql-request';
import useSWR from 'swr'

const fetcher = query => request('https://api-eu-central-1.graphcms.com/v2/cl2kc821g03rk01xu5yylbr07/master', query)

export default function TeoriNav() {
  const { data, error } = useSWR(`
    query SubjectsAndChapters {
      subjects {
        id
        titel
        chapters {
          id
          titel
        }
      }
    }
`, fetcher)

  if (error) return <div>Der skete en fejl</div>
  if (!data) return <div>Indlæser...</div>

  console.log({ data })

  const list = {
    initial: {
      y: 30,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const subjects = {
    initial: { y: 30, opacity: 0},
    animate: { y: 0, opacity: 1}
  }

  const chapters = {
    initial: { y: 30, opacity: 0},
    animate: { y: 0, opacity: 1}
  }

  return (
    <>
      <nav className={scss.teoriNav}>
        <motion.h1 initial="initial" animate="animate" variants={list} className={scss.titel}>Dokumentation</motion.h1>
        <div className={scss.inner}>
          <motion.ul initial="initial" animate="animate" variants={list} className={scss.subjectList}>
            { data.subjects.map((subject) => (
              <motion.li variants={subjects} className={scss.subject} key={subject.id}>
                <h2 className={scss.subjectTitel}>{subject.titel}</h2>
                <ul className={scss.chapterList}>
                  { subject.chapters.map((chapter) => (
                    <li className={scss.chapter} key={chapter.id}>
                      {chapter.titel}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </nav>
    </>
  )
}
