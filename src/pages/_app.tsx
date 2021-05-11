import styles from '../../styles/app.module.scss';
import '../../styles/global.scss';
import Header from '../components/Header';
import Player from '../components/Player';
import PlayerProvider from '../context/PlayerContext';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerProvider>
      <div className={styles.container}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  );
}

export default MyApp;
