import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import { api } from '../services/api';
import { formatDuration } from '../utils/formatDuration';
import styles from './index.module.scss';
import { usePlayerContext } from '../context/PlayerContext';

export interface EpisodeData {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  file: { url: string; type: string; duration: number };
}

export interface FormattedEpisodeData extends EpisodeData {
  formattedDuration: string;
}

const IMAGE_SIZE = 500;

export const getStaticProps: GetStaticProps<{
  episodes: FormattedEpisodeData[];
}> = async () => {
  const { data: episodes } = await api.get<EpisodeData[]>('episodes', {
    params: {
      _sort: 'publishedAt',
      _order: 'desc',
    },
  });

  const formattedEpisodes = episodes.map(episode => ({
    ...episode,
    publishedAt: format(parseISO(episode.publishedAt), 'EEEEEEE, MMMM do'),
    formattedDuration: formatDuration(episode.file.duration),
  }));

  return {
    props: {
      episodes: formattedEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};

export default function Home({
  episodes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const latestEpisodes = episodes.slice(0, 2);
  const remainingEpisodes = episodes.slice(2);

  const { playEpisodeList } = usePlayerContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Latest episodes</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            const {
              id,
              title,
              thumbnail,
              members,
              formattedDuration,
              publishedAt,
            } = episode;

            return (
              <li key={id}>
                <Image
                  src={thumbnail}
                  alt={title}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${id}`}>{title}</Link>
                  <p>{members}</p>
                  <span>{publishedAt}</span>
                  <span>{formattedDuration}</span>
                </div>
                <button
                  type="button"
                  onClick={() => playEpisodeList(episodes, index)}
                >
                  <img src="/play-green.svg" alt="play episode" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>All episodes</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th />
              <th>Podcast</th>
              <th>Participants</th>
              <th>Date</th>
              <th>Duration</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {remainingEpisodes.map((episode, index) => {
              const {
                id,
                title,
                thumbnail,
                members,
                formattedDuration,
                publishedAt,
              } = episode;

              return (
                <tr key={id}>
                  <td>
                    <Image
                      src={thumbnail}
                      width={IMAGE_SIZE}
                      height={IMAGE_SIZE}
                      alt={title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${id}`}>{title}</Link>
                  </td>
                  <td>{members}</td>
                  <td>{publishedAt}</td>
                  <td>{formattedDuration}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playEpisodeList(episodes, index + latestEpisodes.length)
                      }
                    >
                      <img src="play-green.svg" alt="play episode" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
