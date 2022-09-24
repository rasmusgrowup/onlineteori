import typo from '../styles/typo.module.scss'; // typography related styling
import layout from '../styles/layout.module.scss'; // layout related styling
import component from '../styles/components.module.scss'; // component related styling
import { useRouter } from 'next/router'
import Header from '../components/Header';


// NextAuth import
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  return (
    <> 
      <Header />
      <section className={layout.hero}>
        <div className={layout.centerText}>
          <h1 className={typo.h1}>
            <span className={typo.gradient}>Teoriprøver.</span>
            Gjort smarte.
          </h1>
          <p className={typo.p} style={{ marginBottom : '3em' }}>
            Tag din teori til køreprøven i ro og mag derhjemme.
            Eller på farten. Følg din udvikling, og få en fornemmelse for,
            om du er klar til din køreprøve.
          </p>
          <button className={component.darkButton} onClick={signIn}>Log ind</button>
          <p className={typo.link} onClick={() => alert("Created new user")}>Opret bruger</p>
        </div>
      </section>
    </>
  )
}
