import React, { createContext, useContext, useState } from 'react';
import { FormattedEpisodeData } from '../pages';

interface PlayerContextData {
  episodeList: FormattedEpisodeData[];
  currentEpisodeIndex: number;
  playEpisode: (episode: FormattedEpisodeData) => void;
  togglePlay: () => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isLooping: boolean;
  toggleLoop: () => void;
  isShuffling: boolean;
  toggleShuffle: () => void;
  playEpisodeList: (episodes: FormattedEpisodeData[], index: number) => void;
  playNextEpisode: () => void;
  playPreviousEpisode: () => void;
}

const PlayerContext = createContext({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<FormattedEpisodeData[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const playEpisode = (episode: FormattedEpisodeData) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playEpisodeList = (episodes: FormattedEpisodeData[], index: number) => {
    setEpisodeList(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(prevState => !prevState);
  };

  const toggleLoop = () => {
    setIsLooping(prevState => !prevState);
  };

  const toggleShuffle = () => {
    setIsShuffling(prevState => !prevState);
  };

  const playNextEpisode = () => {
    setCurrentEpisodeIndex(prevState => {
      if (isShuffling) {
        return Math.floor(Math.random() * episodeList.length);
      }
      if (prevState + 1 < episodeList.length) {
        return prevState + 1;
      }
      return prevState;
    });
  };

  const playPreviousEpisode = () => {
    setCurrentEpisodeIndex(prevState => {
      if (prevState > 0) {
        return prevState - 1;
      }
      return prevState;
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        playEpisode,
        togglePlay,
        playEpisodeList,
        isPlaying,
        setIsPlaying,
        playNextEpisode,
        playPreviousEpisode,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  return useContext(PlayerContext);
};

export default PlayerProvider;
