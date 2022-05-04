// SCSS
import scss from '../styles/main.module.scss'

// Components
import React from 'react'
import Logo from '../components/Logo'
import Sidebar from '../components/Sidebar'

export default function BackendLayout({children}) {
  return (
    <>
      <Sidebar />
      <main className={scss.mainBackend}>
      <div className={scss.backendInner}>{children}</div>
      <footer className={scss.footerBackend}>
        <span className={scss.copyright}>©{new Date().getFullYear()} Onlineteori ApS · Få hjælp · Handelsbetingelser</span>
      </footer>
      </main>
    </>
  )
}
