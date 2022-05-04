// SCSS
import scss from '../styles/header.module.scss'

// Components
import Image from "next/image"
import Link from "next/link"
import LogoImage from '../public/Logo.png'

export default function Logo() {
  return (
    <>
      <div className={scss.logo}>
        <Link href='/'><a>
          <Image src={LogoImage} priority='true'/>
        </a></Link>
      </div>
    </>
  )
}
