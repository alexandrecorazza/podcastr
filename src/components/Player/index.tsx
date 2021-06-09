import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
  //uma boa prática é iniciar a ref como nulo
  //Todos os elementos do html estão disponíveis de forma global no typescript
  const audioRef = useRef<HTMLAudioElement >(null)
  const[progress, setProgress] = useState(0)
  const[showPlayer, setShowPlayer] = useState(false)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayingState
  } = usePlayer()

  useEffect( () => {
    if(!audioRef.current) {
      return
    }

    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayingState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={ showPlayer ? `${styles.playerContainer} ${styles.active}` : styles.playerContainer}>
      <button className={styles.showPlayerButton} onClick={() => {setShowPlayer(!showPlayer)}}>
        {!showPlayer &&
          <img src="/playing.svg" alt=" Tocando agora"/>
        }
      </button>
      <header>
        <img src="/playing.svg" alt=" Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }

      <footer className={!episode? styles.empty : ''}>  {/* caso não tenha o episódio, então aplica o styles.empty */}
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            { episode? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor:  '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
              />
            ) : (
              <div className={styles.emptySlider}/>
            ) }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {/* O player foi colocado aqui, mas tanto faz onde ele vai entrar, pq ficará invisível */}
        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}/>
        ) }
        
        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            { isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/> }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button 
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}