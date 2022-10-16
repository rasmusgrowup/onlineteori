import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import { IndexProvider } from '../lib/IndexContext';
import { ThemeProvider } from 'next-themes'

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {

  return (
      <SessionProvider session={session}>
      <IndexProvider>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
      </IndexProvider>
      </SessionProvider>
  )
}

export default MyApp