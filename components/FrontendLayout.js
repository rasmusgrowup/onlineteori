// SCSS
import scss from '../styles/main.module.scss'

// Components
import Header from '../components/Header'

export default function FrontendLayout({children}) {
  return (
    <>
      <Header />
      <main className={scss.main}>{children}</main>
    </>
  )
}
