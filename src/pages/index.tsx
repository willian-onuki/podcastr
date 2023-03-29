import { GetStaticProps } from "next";
import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

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
      type:string;
      duration: number;
    }
}

interface HomeProps {
  episodes: Episode[];
}

export default function Home(props: HomeProps) { 
  return (
    <div>
      <h1>Home Page</h1> 
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
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      descrition: episode.description,
      url: episode.file.url,
    }
  })

  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 * 8, 
  }
}