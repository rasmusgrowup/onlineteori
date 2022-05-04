// SCSS
import headerStyles from '../styles/header.module.scss'

// Components
import Image from "next/image"
import Logo from '../components/Logo'
import { useRouter } from 'next/router'
import { motion } from "framer-motion"

// Icons
import IconSignOut from '../components/IconSignOut'
import IconSettings from '../components/IconSettings'
import IconOverblik from '../components/IconOverblik'
import IconTeori from '../components/IconTeori'
import IconTests from '../components/IconTests'
import IconStatistik from '../components/IconStatistik'
import IconDokumenter from '../components/IconDokumenter'
import IconBegivenheder from '../components/IconBegivenheder'
import IconBeskeder from '../components/IconBeskeder'

// NextAuth
import { useSession, signOut } from "next-auth/react";

function SignOut() {
  const { data: session, status } = useSession();

  return (
    <>
        <button className={headerStyles.signOutSidebar} onClick={signOut}>
          <IconSignOut/>
          <span>Log ud</span>
        </button>
    </>
  );
}

function Settings() {
  return (
    <>
      <button className={headerStyles.settings}>
        <IconSettings/>
        <span>Indstillinger</span>
      </button>
    </>
  )
}

export default function Sidebar() {
  const router = useRouter();

  return (
    <>
      <header className={headerStyles.sidebar}>
        <div className={headerStyles.inner}>
          <div className={headerStyles.top}>
            <Logo />
          </div>
          <ul className={headerStyles.list}>
            <li className={`${headerStyles.listItem} ${router.pathname == '/account' ? `${headerStyles.active}` : ''}`} onClick={() => router.push('/account')}>
              <IconOverblik />
              <span>Overblik</span>
            </li>
            <li className={`${headerStyles.listItem} ${router.pathname == '/account/teori' ? `${headerStyles.active}` : ''}`} onClick={() => router.push('/account/teori')}>
              <IconTeori />
              <span>Teori</span>
            </li>
            <li className={headerStyles.listItem}>
              <IconTests />
              <span>Prøver</span>
            </li>
            <li className={headerStyles.listItem} style={{ display: 'none'}}>
              <IconStatistik />
              <span>Statistik</span>
            </li>
            <li className={headerStyles.listItem}>
              <IconDokumenter />
              <span>Dokumenter</span>
            </li>
            <li className={headerStyles.listItem}>
              <IconBegivenheder />
              <span>Begivenheder</span>
            </li>
            <li className={headerStyles.listItem}>
              <IconBeskeder />
              <span>Beskeder</span>
            </li>
          </ul>
          <div className={headerStyles.bottom}>
            <Settings />
            <SignOut />
          </div>
        </div>
      </header>
    </>
  )
}
