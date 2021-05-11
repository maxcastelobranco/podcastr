import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { usePlayerContext } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/formatDuration';

const THUMBNAIL_WIDTH = 1000;
const THUMBNAIL_HEIGHT = 500;

export default function Player() {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setIsPlaying,
    playNextEpisode,
    playPreviousEpisode,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
  } = usePlayerContext();

  const currentEpisode = episodeList[currentEpisodeIndex];

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const handleSliderChange = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={styles.container}>
      <header>
        <img src="/playing.svg" alt="now playing" />
        <strong>Now playing</strong>
      </header>
      {currentEpisode ? (
        <div className={styles.currentEpisode}>
          <Image
            src={currentEpisode.thumbnail}
            width={THUMBNAIL_WIDTH}
            height={THUMBNAIL_HEIGHT}
            objectFit="cover"
          />
          <strong>{currentEpisode.title}</strong>
          <span>{currentEpisode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Pick a podcast to play</strong>
        </div>
      )}
      <footer className={!currentEpisode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{formatDuration(progress)}</span>
          <div className={styles.slider}>
            {currentEpisode ? (
              <Slider
                trackStyle={{
                  backgroundColor: '#04d361',
                }}
                railStyle={{
                  backgroundColor: '#9f75ff',
                }}
                handleStyle={{
                  borderColor: '#04d361',
                  borderWidth: 4,
                }}
                onChange={handleSliderChange}
                max={currentEpisode?.file.duration}
                value={progress}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          {currentEpisode ? (
            <span>{formatDuration(currentEpisode.file.duration)}</span>
          ) : (
            <span>00:00</span>
          )}
        </div>
      </footer>
      {currentEpisode && (
        <audio
          ref={audioRef}
          src={currentEpisode.file.url}
          autoPlay
          loop={isLooping}
          onPlay={() => {
            setIsPlaying(true);
          }}
          onPause={() => {
            setIsPlaying(false);
          }}
          onLoadedMetadata={setupProgressListener}
        />
      )}
      <div
        className={[styles.buttons, !currentEpisode ? styles.empty : ''].join(
          ' ',
        )}
      >
        <button
          type="button"
          disabled={!currentEpisode || episodeList.length === 1}
          onClick={toggleShuffle}
          style={{
            filter:
              isShuffling &&
              'invert(.35) sepia(1) saturate(3) hue-rotate(100deg)',
          }}
        >
          <img src="/shuffle.svg" alt="shuffle" />
        </button>
        <button
          type="button"
          disabled={!currentEpisode || currentEpisodeIndex === 0}
          onClick={playPreviousEpisode}
        >
          <img src="/play-previous.svg" alt="play previous" />
        </button>
        <button
          type="button"
          className={styles.playButton}
          disabled={!currentEpisode}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <img src="/pause.svg" alt="pause" />
          ) : (
            <img src="/play.svg" alt="play" />
          )}
        </button>
        <button
          type="button"
          disabled={
            !currentEpisode || currentEpisodeIndex + 1 === episodeList.length
          }
          onClick={playNextEpisode}
        >
          <img src="/play-next.svg" alt="play next" />
        </button>
        <button
          type="button"
          disabled={!currentEpisode}
          onClick={toggleLoop}
          style={{
            filter:
              isLooping &&
              'invert(.35) sepia(1) saturate(3) hue-rotate(100deg)',
          }}
        >
          <img src="/repeat.svg" alt="repeat" />
        </button>
      </div>
    </div>
  );
}
