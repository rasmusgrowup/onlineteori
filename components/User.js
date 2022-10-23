import Image from "next/image" // image component
import Link from 'next/link' // link component
import style from "../styles/user.module.scss"
import Chevron from '../components/Icons/ChevronDown'
import { PROFILE_PLACEHOLDER } from '../lib/constants.js'
import {useState} from "react";

function User({ src, navn, konto, username }) {
  const [fullname, setFullname] = useState((navn).split(' '))
  const [firstname, setFirstname] = useState(fullname[0])
  const [lastname, setLastname] = useState(fullname[1])

  return (
    <>
      <Link href='/dashboard/profile' passHref>
        <a>
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
              { firstname && <span className={style.name}>{firstname}</span> }
              { firstname && <span className={style.name}>{lastname}</span> }
            </div>
            <Chevron />
          </div>
        </a>
      </Link>
    </>
  )
}

User.defaultProps = {
  src: `${PROFILE_PLACEHOLDER}`,
  navn: 'Anders Andersen'
}

export default User
