// SCSS
import scss from '../styles/stats.module.scss'

// Components
import Image from "next/image"
import { motion } from "framer-motion"
import IconStatistik from '../components/IconStatistik'
import IconBeskeder from '../components/IconBeskeder'
import { PLACEHOLDER } from '../lib/constants.js'

const cards = {
  initial: {
    y: 30,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.5
    }
  },
  hover: {
    scale: 1.025,
  },
  tap: {
    scale: 0.975,
  }
}

export default function Stats() {
  return (
    <>
      <section className={scss.container}>
        <motion.header animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45}} initial={{ y: 30, opacity: 0 }} className={scss.header}>
          <IconStatistik />
          <span>Statistik</span>
        </motion.header>
        <div className={scss.inner}>
          <motion.div
            variants={cards}
            initial='initial'
            animate='animate'
            whileHover='hover'
            whileTap='tap'
            className={scss.card}>
            <div className={scss.cardImage}>
              <Image src={PLACEHOLDER} layout='fill'/>
            </div>
            <div className={scss.cardText}>Du har gennemført 22% af teorihåndbogen</div>
          </motion.div>
          <motion.div
            variants={cards}
            initial='initial'
            animate='animate'
            whileHover='hover'
            whileTap='tap'
            className={scss.card}>
            <div className={scss.cardImage}>
              <Image src={PLACEHOLDER} layout='fill'/>
            </div>
            <div className={scss.cardText}>Du har gennemført 8 teoriprøver</div>
          </motion.div>
          <motion.div
            variants={cards}
            initial='initial'
            animate='animate'
            whileHover='hover'
            whileTap='tap'
            className={scss.card}>
            <div className={scss.cardImage}>
              <Image src={PLACEHOLDER} layout='fill'/>
            </div>
            <div className={scss.cardText}>75% af dine fejl er indenfor teori om hastighed</div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
