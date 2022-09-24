import Image from "next/image" // image component
import style from "../styles/user.module.scss"
import { PROFILE_PLACEHOLDER } from '../lib/constants.js' // constants

function User({ src, navn, konto, username }) {
  return (
    <>
      <div className={style.user}>
        <div className={style.imageContainer} >
          <Image
            src={src}
            width='90'
            height='90'
            objectFit='cover'
            objectPosition='top'
            priority='true'
          />
        </div>
        <div className={style.info} >
          <span className={style.name}>{navn}</span>
          <span className={style.account}>{konto}</span>
          <span className={style.username}>#{username}</span>
        </div>
      </div>
    </>
  )
}

User.defaultProps = {
  src: `${PROFILE_PLACEHOLDER}`,
  navn: 'Anders Andersen',
  konto: 'anders@andersen.dk'
}

export default User
