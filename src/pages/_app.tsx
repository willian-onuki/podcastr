import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google';
import { Lexend } from 'next/font/google';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';

const lexend = Lexend({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return(
    <div className={`${lexend.className} ${inter.className} ${styles.appWrapper}`}>
      <main>
        <Header/>
        <Component {...pageProps} />
      </main>
      <Player/>
    </div>
  );
}