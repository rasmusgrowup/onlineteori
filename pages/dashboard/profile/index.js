import { gql } from 'graphql-request';
import { useForm } from 'react-hook-form';
import { getSession } from 'next-auth/react';
import style from '../../../styles/dashboard.module.scss' // Dashboard styling
import component from '../../../styles/components.module.scss' // Component styling
import Image from "next/image";
import Sidebar from '../../../components/Sidebar'


import { hygraphClient } from '../../../lib/hygraph';

const GetUserProfileById = gql`
query GetUserProfileById($id: ID!) {
  user: nextUser(where: { id: $id }) {
    name
    email
    username
    userPic {
      url
    }
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

export default function AccountPage({ user }) {
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
    }
  };

  return (
    <>
      <Sidebar />
      <section className={style.main}>
        <h1>Din profil</h1>
        <div className={style.userForm} >
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
            <button type="submit" className={component.darkButton} >Gem</button>
          </form>
        </div>
        <div className={style.category}>
        </div>
      </section>
    </>
  );
}