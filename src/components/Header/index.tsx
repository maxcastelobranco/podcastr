import { format } from 'date-fns';
import styles from './styles.module.scss';

export default function Header() {
  const today = new Date();
  const formattedToday = format(today, 'EEEEEEE, MMMM do');

  return (
    <header className={styles.container}>
      <img src="/logo.svg" alt="podcastr" />
      <p>#1 podcast player in the world</p>
      <span>{formattedToday}</span>
    </header>
  );
}
