import { api } from '@/src/services/api';
import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '@/src/utils/convertDurationToTimeString';
import { ParsedUrlQuery } from 'querystring';
import styles from './episodes.module.scss';
import Image from 'next/image';
import Link from 'next/link';

interface Episode {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  duration: number;
  durationAsString: string;
  descrition: string;
  url: string;
}

interface Props {
  episode: Episode;
}

interface ParamsContext extends ParsedUrlQuery {
  slug: string;
}

export default function Episodes({ episode }: Props) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button
            type='button'
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#8257E5',
            }}
          >
            <img
              src='/arrow-left.svg'
              alt='Voltar'
            />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          style={{ objectFit: 'cover', width: '100%' }}
        />
        <button type='button'>
          <img
            src='/play.svg'
            alt='Tocar episódio'
          />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.descrition }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as ParamsContext;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    descrition: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //24hours
  };
};
