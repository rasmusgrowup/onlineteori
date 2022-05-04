// SCSS
import scss from '../styles/user.module.scss'

//Components
import Image from "next/image"
import { motion } from "framer-motion"
import { PROFILE_PLACEHOLDER } from '../lib/constants.js'

function User({ src, navn, konto }) {
  return (
    <>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 30, opacity: 0 }}
        className={scss.container}
      >
        <div className={scss.profilePic}>
          <Image
            src={src}
            width='55'
            height='55'
            objectFit='cover'
            objectPosition='center'
          />
        </div>
        <div className={scss.userInfo}>
          <span className={scss.navn}>{navn}</span>
          <span className={scss.konto}>{konto}</span>
        </div>
      </motion.div>
    </>
  )
}

User.defaultProps = {
  src: `${PROFILE_PLACEHOLDER}`,
  navn: 'Anders Andersen',
  konto: 'anders@andersen.dk'
}

export default User
