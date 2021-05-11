import Link from 'next/link';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import styles from './episode.module.scss';
import { api } from '../../services/api';
import { EpisodeData, FormattedEpisodeData } from '../index';
import { formatDuration } from '../../utils/formatDuration';
import { usePlayerContext } from '../../context/PlayerContext';

const THUMBNAIL_WIDTH = 700;
const THUMBNAIL_HEIGHT = 350;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<EpisodeData[]>('episodes');

  const paths = data.map(({ id }) => ({
    params: {
      slug: id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{
  episode: FormattedEpisodeData;
}> = async ctx => {
  const { slug } = ctx.params;

  const { data: episode } = await api.get<EpisodeData>(`episodes/${slug}`);

  const formattedEpisode = {
    ...episode,
    publishedAt: format(parseISO(episode.publishedAt), 'EEEEEEE, MMMM do'),
    formattedDuration: formatDuration(episode.file.duration),
  };

  return {
    props: {
      episode: formattedEpisode,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default function Episode({
  episode,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    title,
    thumbnail,
    members,
    formattedDuration,
    publishedAt,
    description,
  } = episode;

  const { playEpisode } = usePlayerContext();

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="go back" />
          </button>
        </Link>
        <Image
          src={thumbnail}
          width={THUMBNAIL_WIDTH}
          height={THUMBNAIL_HEIGHT}
          objectFit="cover"
        />
        <button type="button" onClick={() => playEpisode(episode)}>
          <img src="/play.svg" alt="play episode" />
        </button>
      </div>
      <header>
        <h1>{title}</h1>
        <span>{members}</span>
        <span>{publishedAt}</span>
        <span>{formattedDuration}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
