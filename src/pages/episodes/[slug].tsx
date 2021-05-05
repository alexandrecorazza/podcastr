import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string,
  publishedAt: string,
  description: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()
  //const router = useRouter()

  return (
    //<h1>{router.query.slug}</h1>
    <div className={styles.episode}>

      <Head>
        <title>{episode.title} | Podecastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} /> {/* explicação - aula 3 1:22:35 */}
    </div>
  )
}

//O método getStaticPaths é obrigatório para páginas estáticas que são dinâmicas. Na nossa página Home isso não foi necessário pois é única. Nesse caso, nosso arquivo por ser [slug] entre colchetes indica que podemos receber diversos valores diferentes, o que indica um comportamento dinâmico 
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'  //explicação no início da aula 4
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params     //O { slug } é exatamente o nome que chamamos o arquivo
  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24 //24 horas
  }
}