// SCSS
import scss from '../../../styles/teori.module.scss'

//Components
import BackendLayout from '../../../components/BackendLayout'
import TeoriNav from '../../../components/TeoriNav'
import { motion } from "framer-motion"

export default function Teori({ subjects }) {
  console.log({ subjects })
  return (
    <>
    <BackendLayout>
      <TeoriNav />
      <section className={scss.teoriInner}>
        <h1>Teorilære</h1>
        <p>
          Importantly, Next.js lets you choose which pre-rendering form you&apos;d like to use for each page. You can create a &quot;hybrid&quot; Next.js app by using Static Generation for most pages and using Server-side Rendering for others.<br/><br/>
          We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.<br/><br/>
          You can also use Client-side Rendering along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by client side JavaScript. To learn more, take a look at the Data Fetching documentation.
        </p>
        <motion.button whileTap={{ scale: 0.975 }} className={scss.button}>Start</motion.button>
      </section>
    </BackendLayout>
    </>
  )
}
