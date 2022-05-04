// SCSS
import scss from '../styles/header.module.scss'

// Components
import Image from "next/image"
import { useRouter } from 'next/router'
import Link from "next/link"
import Logo from '../components/Logo'
import Chevron from '../public/icons/chevron-down.svg'

// NextAuth
import { useSession, signIn, signOut } from "next-auth/react";

function AuthLinks() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";

  if (loading) return (
    <div className={scss.signIn}>Log ind</div>
  )

  return (
    <>
      {session ? (
        <button className={scss.signOut} onClick={signOut}>Log ud</button>
      ) : (
        <>
          <button className={scss.signIn} onClick={() => signIn({ callbackUrl: 'http://localhost:3000/account'})}>Log ind</button>
        </>
      )}
    </>
  );
}

export default function Header() {
  return (
    <>
      <header className={scss.main}>
        <Logo />
        <nav className={scss.nav}>
          <div className={scss.dropdowns}>
            <Link href='/'>
              <a className={scss.navItem}>
                <span>Private</span>
                <Image src={Chevron} />
              </a>
            </Link>
            <Link href='/'>
              <a className={scss.navItem}>
                <span>Køreskoler</span>
                <Image src={Chevron} />
              </a>
            </Link>
          </div>
          <div className={scss.buttons}>
            <Link href='/'><a className={scss.contactUs}>Kontakt os</a></Link>
            <AuthLinks />
          </div>
        </nav>
      </header>
    </>
  )
}
