import { GetStaticProps } from "next";
import Image from 'next/image';

import { format, parseISO } from 'date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../services/api";

import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from './home.module.scss';

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

interface Response {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  durationAsString: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode) =>
            <li key={episode.id}>
              <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} style={{objectFit: 'cover'}}/>

              <div className={styles.episodeDetails}>
                <a href="#">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src='/play-green.svg' alt='tocar episódio' />
              </button>
            </li>
          )}
        </ul>
      </section>
      <section className={styles.allEpisodes}></section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<Response[]>('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      descrition: episode.description,
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}