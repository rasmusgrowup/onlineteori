// Default imports
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import style from '../../../styles/profile.module.scss' // Dashboard styling
import components from '../../../styles/components.module.scss' // Component styling
import header from "../../../styles/header.module.scss";
import User from "../../../components/User";
import Preferences from "../../../components/Preferences";
import Image from "next/image";
import Sidebar from '../../../components/Sidebar'

// Icon imports
import Pencil from "../../../components/Icons/Pencil";
import Contact from "../../../components/Icons/Contact";
import Address from "../../../components/Icons/Address";
import Face from "../../../components/Icons/Face";
import Id from "../../../components/Icons/Id";
import Car from "../../../components/Icons/Car";
import Card from "../../../components/Icons/Card";
import Email from "../../../components/Icons/Email";
import Trashcan from "../../../components/Icons/Trashcan";
import ChineseSign from "../../../components/Icons/ChineseSign";

// Smooth scroll
import smoothscroll from 'smoothscroll-polyfill';

// Hygraph imports
import { gql } from 'graphql-request';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import { hygraphClient } from '../../../lib/hygraph';

const GetUserProfileById = gql`
query GetUserProfileById($id: ID!) {
  user: nextUser(where: { id: $id }) {
    id
    name
    email
    phone
    username
    userPic {
      url
    }
    address {
      street
      floor
      city
      zip
    }
    theoryProgress
    age
    gender
  }
}
`;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { user } = await hygraphClient.request(GetUserProfileById, {
    id: session.userId,
  });

  return {
    props: {
      user,
    },
  };
}

const SmoothScroll = ({ user }) => {
  const router = useRouter()
  const [checked, setChecked] = useState(true)
  const { handleSubmit, register } = useForm({ defaultValues: user });

  const onSubmit = async ({ name, username }) => {
    try {
      const res = await fetch('/api/update-account', {
        method: 'POST',
        body: JSON.stringify({ name, username }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
    } catch (err) {
      console.log(err);
    } router.reload(window.location.pathname)
  };

  useEffect(() => {
    smoothscroll.polyfill();
  }, [])

  return (
    <>
      <Sidebar />
      <section className={style.main} style={{ scrollBehavior: 'smooth' }}>
        <header className={header.header}>
          <User navn={user.name} src={user.userPic.url}/>
          <Preferences />
        </header>
        <nav className={style.nav}>
          <ul>
            <Link className={style.active} href="#info"><a><Face />Brugerinfo</a></Link>
            <Link href="#contact"><a><Contact />Kontaktoplsyninger</a></Link>
            <Link href="#address"><a><Address />Addresse</a></Link>
            <Link href="#id"><a><Id />ID</a></Link>
            <Link href="#school"><a><Car />Køreskole</a></Link>
            <Link href="#sub"><a><Card />Abonnement</a></Link>
            <Link href="#lang"><a><ChineseSign />Sprog</a></Link>
            <Link href="#emails"><a><Email />Emails</a></Link>
            <Link href="#delete"><a><Trashcan />Slet</a></Link>
          </ul>
        </nav>
        <div className={style.container}>
          <h1>Indstillinger</h1>
          <section className={style.section} id="info">
            <header className={style.header}>
              <h3>Brugerinfo</h3>
              <button className={style.pencil}><Pencil /></button>
            </header>
            <div className={style.name}>
              <p>{user.name}</p>
              <p>@{user.username}</p>
              <p>{user.age} år, {user.gender}</p>
            </div>
          </section>
          <section className={style.section} id="contact">
            <header className={style.header}>
              <h3>Kontaktoplysninger</h3>
              <button className={style.pencil}><Pencil /></button>
            </header>
            <div className={style.name}>
              <p>{user.email}</p>
              <p>+45 {user.phone}</p>
            </div>
          </section>
          <section className={style.section} id="address">
            <header className={style.header}>
              <h3>Adresse</h3>
              <button className={style.pencil}><Pencil /></button>
            </header>
            <div className={style.address}>{user.address.street} {user.address.floor}, {user.address.city} {user.address.zip}</div>
          </section>
          <section className={style.section} id="id">
            <header className={style.header}>
              <h3>ID</h3>
            </header>
            <div className={style.userId}>{user.id}</div>
            <p className={style.explainor}>Dit personlige id bruges bl.a.
              når der oprettes support-sager, til fakturering eller hvis din kørelærer
              skal oprette nye produkter til dig.</p>
          </section>
          <section className={style.section} id="school">
            <header className={style.header}>
              <h3>Tilknyttet køreskole</h3>
            </header>
            <div className={style.school}>Åløkke Køreskole v/Tai Lien Lu</div>
            <p className={style.explainor}>Du er tilknyttet en køreskole, når du begynder på dit kørekort.
            Du kan knytte din profil op med en køreskole efter dit eget valg. Køreskolen kan herefter
            følge med i dine fremskridt, se dine point, oprette begivenheder i din kalender og uddele
            opgaver.</p>
          </section>
          <section className={style.section} id="sub">
            <header className={style.header}>
              <h3>Abonnement</h3>
            </header>
            <div className={style.userId}>90 dage, betales gennem køreskole</div>
            <p className={style.explainor}>Dit personlige id bruges bl.a.
              når der oprettes support-sager, til fakturerings eller hvis din kørelærer
              skal oprette nye produkter til dig.</p>
          </section>
          <section className={style.section} id="lang">
            <header className={style.header}>
              <h3>Sprog</h3>
              <button className={style.pencil}><Pencil /></button>
            </header>
            <div className={style.userId}>Dansk</div>
            <p className={style.explainor}>Dit valg af sprog afgør, hvilket sprog du vil
            benytte dig af i programmet her. Det gælder både når du tager prøver, læser i teoribogen og
            på selve interfacet.</p>
          </section>
          <section className={style.section} id="emails">
            <header className={style.header}>
              <h3>Emails</h3>
            </header>
            <form>
              <input type='checkbox' name='emails' defaultChecked={checked} onChange={() => setChecked(!checked)}/>
              <label>Jeg ønsker at modtage email markedsføring fra Onlineteori</label>
            </form>
            <p className={style.explainor}>Dit valg af sprog afgør, hvilket sprog du vil
              benytte dig af i programmet her. Det gælder både når du tager prøver, læser i teoribogen og
              på selve interfacet.</p>
          </section>
          <section className={style.section} id='delete'>
            <header className={style.header}>
              <h3>Slet konto</h3>
            </header>
            <button className={components.deleteButton} onClick={() => alert('Er du heeeeeeeeelt sikker?')}>Slet din bruger permanent</button>
            <p className={style.explainor}>Ønsker du at slette din konto helt, bedes du trykke på knappen herover.
              Du vil blive bedt om at bekræfte din handling.
              Handlingen kan ikke fortrydes, så være sikker på, at du virkelig ønsker at slette kontoen</p>
          </section>

          <div className={style.userForm} style={{ display: 'none' }}>
            <div className={style.userPic} >
              <Image
                  width='120'
                  height='120'
                  objectFit='cover'
                  objectPosition='top'
                  priority='true'
                  src={user.userPic.url} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
              <input
                  type="text"
                  name="name"
                  {...register('name', { required: true })}
                  placeholder="name"
                  id="name"
              />
              <input
                  type="text"
                  name="username"
                  {...register('username', { required: true })}
                  placeholder="username"
                  id="username"
              />
              <button type="submit" className={components.darkButton} >Gem</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Profile({ user }) {
  return <SmoothScroll user={user}/>
}