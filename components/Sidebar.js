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
import Overblik from '../components/icons/Overblik';
import Settings from '../components/icons/Settings';
import Teori from '../components/icons/Teori';
import Tests from '../components/icons/Overblik';
import Chat from '../components/icons/Chat';
import SignOut from '../components/icons/SignOut';
import MenuIcon from '../components/icons/MenuIcon';
import CloseIcon from '../components/icons/CloseIcon';

function BackendSidebar({ displayMenu }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div className={ displayMenu ? `${sidebar.displaySidebar} ${sidebar.sidebar}` : `${sidebar.hideSidebar} ${sidebar.sidebar}`}>
      <div className={sidebar.mainLogo}>
        <Image src={Logo} layout='responsive' priority='true' quality='100'/>
      </div>
      <div className={sidebar.sidebarMenu} >
        <div className={sidebar.inner}>
          <Link href='/dashboard'>
            <a className={router.pathname === '/dashboard' ? `${sidebar.sidebarItem} ${sidebar.active}` : `${sidebar.sidebarItem}`}>
              <Overblik />
              <span>Hjem</span>
            </a>
          </Link>
          <Link href='/dashboard'>
            <a className={sidebar.sidebarItem}>
              <Teori />
              <span>Teori</span>
            </a>
          </Link>
          <Link href='/dashboard'>
            <a className={sidebar.sidebarItem}>
              <Tests />
              <span>Prøver</span>
            </a>
          </Link>
          <Link href='/dashboard/profile'>
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
		<header className={sidebar.mainSidebar}>
			<BackendSidebar/>
      <div className={sidebar.toggle} onClick={handleDisplayMenu}>
        { !handleMenu ? <MenuIcon /> : <CloseIcon /> }
      </div>
		</header>
	)
}