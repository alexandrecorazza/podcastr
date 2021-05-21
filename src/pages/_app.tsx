import GlobalStyle from '../styles/global'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../styles/theme'

import styles from '../styles/app.module.scss'
import { Header } from "../components/Header";
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
  
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <PlayerContextProvider>
        <GlobalStyle />
        <div className={styles.wrapper}>
          <main>
            <Header toggleTheme={toggleTheme} theme={theme}/>
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeProvider>
  )

}

export default MyApp
