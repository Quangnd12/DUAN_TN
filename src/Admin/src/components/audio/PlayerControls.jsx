import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import Volume from "./VolumeTemplate";
import CurrentTrack from "./CurrentTrack";

const PlayerControls = ({ audioUrl, title, artist, Image, onDurationChange,next,prevsong ,onTrackEnd}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);


  const playerRef = useRef(null);

  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };


  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    if (onDurationChange) {
      onDurationChange(state.loadedSeconds);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleSliderMouseUp = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime, 'seconds');
    }
  };

  const handleTrackEnd = () => {
    onTrackEnd();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Container>
      <div className="controls">
        <CurrentTrack
          title={title}
          artist={artist}
          image={Image}
        />
        <div className="control-buttons">
          <CgPlayTrackPrev className="icon" onClick={prevsong}  />
          <div className="state" onClick={handlePlayPause}>
            {isPlaying ? <BsFillPauseCircleFill className="icon" /> : <BsFillPlayCircleFill className="icon" />}
          </div>
          <CgPlayTrackNext className="icon" onClick={next} />
        </div>
        <Volume volume={volume} onVolumeChange={(e) => setVolume(parseFloat(e.target.value))} />
      </div>
      <ProgressContainer>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSliderChange}
          onMouseUp={handleSliderMouseUp}
          step="0.1"
        />
        <span>{formatTime(duration)}</span>
      </ProgressContainer>
      <ReactPlayer
        ref={playerRef}
        url={audioUrl}
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleTrackEnd}
        width="0"
        height="0"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #181818;
  padding: 0.5rem 0;
  z-index: 1000;

  .controls {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 1rem;

    .control-buttons {
      display: flex;
      align-items: center;
      position: absolute;
      left: 717px;
      top: 18px;
      gap: 1rem;

      .icon {
        color: #b3b3b3;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s ease-in-out;

        &:hover {
          color: white;
        }
      }

      .state .icon {
        color: white;
        font-size: 2rem;
      }
    }
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 30%;
  padding: 0 1rem;
  justify-content: center;

  input[type="range"] {
    flex: 1;
    cursor: pointer;
    appearance: none;
    background: #535353;
    height: 4px;
    border-radius: 2px;

    &::-webkit-slider-thumb {
      appearance: none;
      background: #3b82f6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    &::-moz-range-thumb {
      background: #3b82f6;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }

  span {
    color: white;
    font-size: 0.875rem;
  }
`;

export default PlayerControls;
