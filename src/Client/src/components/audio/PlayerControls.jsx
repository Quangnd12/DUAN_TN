import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { MdShuffle, MdRepeat } from "react-icons/md";
import Volume from "./VolumeTemplate";
import CurrentTrack from "./ArtistInfo";
import "../../assets/css/artist/playercontroll.css";

const PlayerControls = ({ audioUrl, title, artist, Image, onDurationChange, next, prevsong, onTrackEnd }) => {
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

  const handlePlayPause = (e) => {
    e.stopPropagation();
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
    <div className="container-controls">
      <div className="controls">
        <CurrentTrack
          title={title}
          artist={artist}
          image={Image}
        />
        <div className="control-buttons">
          <MdRepeat className="icon-custom" title="Repeat" />
          <CgPlayTrackPrev className="icon" onClick={prevsong} />
          <div className="state" onClick={handlePlayPause}>
            {isPlaying ? <BsFillPauseCircleFill className="icon" /> : <BsFillPlayCircleFill className="icon" />}
          </div>
          <CgPlayTrackNext className="icon" onClick={next} />
          <MdShuffle className="icon-custom" title="Shuffle" />
        </div>
        <div className="parent-container">
        <Volume volume={volume} onVolumeChange={(e) => setVolume(parseFloat(e.target.value))} />
        </div>
      </div>
      <div className="progress-container">
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
      </div>
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
    </div>
  );
};

export default PlayerControls;
