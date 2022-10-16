import Image from 'next/image'; // import image component
import Link from 'next/link'; // import link component
import Logo from '../public/OnlineteoriLogo.png'; // import logo file
import sidebar from '../styles/sidebar.module.scss'; // styling specific to header
import components from '../styles/components.module.scss'; // component related styling
import { useRouter } from 'next/router';
import { useState } from 'react';

// NextAuth import
import { useSession, signIn, signOut } from "next-auth/react";

// Import Icons for menu
import Overblik from '../components/Icons/Overblik';
import Settings from '../components/Icons/Settings';
import Teori from '../components/Icons/Teori';
import Tests from '../components/Icons/Overblik';
import Chat from '../components/Icons/Chat';
import SignOut from '../components/Icons/SignOut';
import MenuIcon from '../components/Icons/MenuIcon';
import CloseIcon from '../components/Icons/CloseIcon';

function BackendSidebar({ displayMenu }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className={ displayMenu ? `${sidebar.displaySidebar} ${sidebar.sidebar}` : `${sidebar.sidebar}`}>
      <div className={sidebar.mainLogo}>
        <h1 className={sidebar.logoType}>Onlineteori</h1>
      </div>
      <div className={sidebar.sidebarMenu} >
        <div className={sidebar.inner}>
          <Link href='/dashboard' passHref>
            <a className={router.pathname === '/dashboard' ? `${sidebar.sidebarItem} ${sidebar.active}` : `${sidebar.sidebarItem}`}>
              <Overblik />
              <span>Hjem</span>
            </a>
          </Link>
          <Link href='/dashboard/teori' passHref>
            <a className={router.pathname === '/dashboard/teori' || router.pathname === '/dashboard/teori/[...slug]' ? `${sidebar.sidebarItem} ${sidebar.active}` : `${sidebar.sidebarItem}`}>
              <Teori />
              <span>Teori</span>
            </a>
          </Link>
          <Link href='/dashboard/proever' passHref>
            <a className={router.pathname === '/dashboard/proever' || router.pathname === '/dashboard/proever/[...slug]' ? `${sidebar.sidebarItem} ${sidebar.active}` : `${sidebar.sidebarItem}`}>
              <Tests />
              <span>Prøver</span>
            </a>
          </Link>
          <Link href='/dashboard/profile' passHref>
            <a className={router.pathname === '/dashboard/profile' ? `${sidebar.sidebarItem} ${sidebar.active}` : `${sidebar.sidebarItem}`}>
              <Settings />
              <span>Profil</span>
            </a>
          </Link>
        </div>
        <div className={sidebar.signOut}>
          <div className={sidebar.sidebarItem}>
            <Chat />
            <span>Support</span>
          </div>
          <div className={sidebar.sidebarItem} onClick={signOut}>
            <SignOut />
            <span>Log ud</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { data: session, status } = useSession();
  const [ handleMenu, setHandleMenu ] = useState(false);
  const handleDisplayMenu = () => {setHandleMenu(!handleMenu);}

	return (
		<>
			<BackendSidebar displayMenu={handleMenu}/>
      <div className={sidebar.toggle} onClick={handleDisplayMenu}>
        { !handleMenu ? <MenuIcon /> : <CloseIcon /> }
      </div>
		</>
	)
}