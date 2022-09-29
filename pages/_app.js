import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import { IndexProvider } from '../lib/IndexContext';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {

  return (
      <SessionProvider session={session}>
      <IndexProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </IndexProvider>
      </SessionProvider>
  )
}

export default MyApp