import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns' //parseISO serve para converter uma string em uma data
import ptBR from 'date-fns/locale/pt-BR'
import Image from 'next/image'  //Usamos esse componente no lugar das tags img.
import Head from 'next/head'
import { api } from '../services/api'
import Link from 'next/link'  //Mantermos o conteito de SPA
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string,
  publishedAt: string
}

type HomeProps = {
  latestEpisodes: Episode[] //ou Array<Episode>
  allEpisodes: Episode[]  //ou Array<Episode>
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
 
 const { playList } = usePlayer()
 const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podecastr</title>  
      </Head> {/* pode jodar esse Head em qualquer lugar da página que o efeito será o mesmo */}
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
                {/* substitui a tag img */}
                {/* é uma imagem que precisa de otimização, pois como está vindo de um link externo(google api) não sabemos o tamanho que essa imagem foi feito upload e o Next trata isso de forma totalmente automatizada para nós. A largura e altura que passamos como props desse componente não é a largura e altura que vamos mostrar a imagem e sim as dimensões que estamos carregando elas. Usa o tamanho 3x maior do qual queremos. Se quisermos uma imagem de 64px, seria legal carregar com o tamanho 192, mas isso não é uma regra */}
                {/* por padrão o nosso componente Image não funciona pra qualquer endereço de imagem, então precisamos criar um arquivo na raiz do projeto chamado next.config.js */}
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podecast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                      <img src="play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              ) 
            })}
          </tbody>
        </table>
      </section>
      {/* <p>{JSON.stringify(props.episodes)}</p>  imprimir o json na tela */}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api('episodes', {
    //com o json-server é possível passarmos parâmetros. Queremos 12 registros(_limit=12), ordernar pelo publisher_at(_sort=published_at) e na ordem decrescente(_order=desc)
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  //fazer a formatação dos dados ainda no lado do servidor, pois fazendo essa formatação do lado do front-end, acarretará em renderizações automáticas e desnecessárias do componente
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2) //pega da posição 0 até a posição 2
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 //estamos definindo que a cada 8h sairá um podcast novo
  }
}