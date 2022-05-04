// SCSS
import scss from '../styles/continue.module.scss'

// Components
import Image from "next/image"
import { motion } from "framer-motion"
import IconThumbsUp from '../components/IconThumbsUp'
import IconBeskeder from '../components/IconBeskeder'
import { PLACEHOLDER } from '../lib/constants.js'

//Placeholders
import Scribble1 from '../public/placeholders/Scribble_1.png'
import Scribble2 from '../public/placeholders/Scribble_2.png'
import Scribble3 from '../public/placeholders/Scribble_3.png'

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

export default function Continue() {
  return (
    <>
      <section className={scss.container}>
        <motion.header animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45}} initial={{ y: 30, opacity: 0 }} className={scss.header}>
          <IconThumbsUp />
          <span>Fortsæt, hvor du slap</span>
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
              <Image src={Scribble1} layout='fill'/>
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
              <Image src={Scribble2} layout='fill'/>
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
              <Image src={Scribble3} layout='fill'/>
            </div>
            <div className={scss.cardText}>75% af dine fejl er indenfor teori om hastighed</div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
