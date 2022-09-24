import Image from 'next/image'; // import image component
import Link from 'next/link'; // import link component
import Logo from '../public/OnlineteoriLogo.png'; // import logo file
import header from '../styles/header.module.scss'; // styling specific to header
import components from '../styles/components.module.scss'; // component related styling
import { useRouter } from 'next/router';
import { useState } from 'react';

// NextAuth import
import { useSession, signIn, signOut } from "next-auth/react";

// Import Icons for menu
import MenuIcon from '../components/Icons/MenuIcon';
import CloseIcon from '../components/Icons/CloseIcon';

function SignInOut() {
  return (
    <>
      <button className={components.lightButton} onClick={() => router.push('/')}>Kontakt support</button>
      <button className={`${components.darkButton} ${header.signInBtn}`} onClick={signIn}>Log ind</button>
    </>
  );
}

function FrontendHeader({session, displayMenu}) {
  return (
    <div className={displayMenu ? `${header.displayMenu} ${header.inner}` : `${header.hideMenu} ${header.inner}`}>
      <div className={header.top}>
        <div className={header.mainLogo}>
          <Image src={Logo} layout='responsive' priority='true' quality='100'/>
        </div>
      </div>
      <div className={header.menu}>
        <ul className={header.mainMenuList}>
          <li className={header.active}>Features</li>
          <li>Priser</li>
          <li>Students</li>
          <li>Teachers</li>
        </ul>
      </div>
      <div className={header.backend}>
        { !session && <SignInOut />}
      </div>
    </div>
  )
}

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ handleMenu, setHandleMenu ] = useState(false);
  const handleDisplayMenu = () => {
    setHandleMenu(!handleMenu);
  }

	return (
		<header className={header.mainHeader} style={{ height: `${ handleMenu ? 
      '100%' : '70px' }`}} >
			<FrontendHeader displayMenu={handleMenu}/>
      <div className={header.toggle} onClick={handleDisplayMenu}>
        { !handleMenu ? <MenuIcon /> : <CloseIcon /> }
      </div>
		</header>
	)
}