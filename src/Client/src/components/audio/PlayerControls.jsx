import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { MdShuffle, MdRepeat } from "react-icons/md";
import Volume from "./VolumeTemplate";
import CurrentTrack from "./ArtistInfo";
import "../../assets/css/artist/playercontroll.css";
import { PlayerContext } from "../context/MusicPlayer";
import useAge from "../calculateAge";
import { handleWarning, handleWarningUser } from "../notification";
import { updatePlayCount } from "services/songs";
import { addHistory } from "services/history";
import { getHistoryById } from "services/history";
import { formatDate } from "../format";
import { getPaymentByUser } from "services/payment";


const PlayerControls = () => {
  const [isPlaying, setIsPlaying] = useState(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [hasAddedHistory, setHasAddedHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [payment, setPayments] = useState([]);

  const playerRef = useRef(null);
  const { playerState, setPlayerState, Songs, clickedIndex, setClickedIndex } = useContext(PlayerContext);
  const { audioUrl, title, artist, Image, lyrics, album, playCount, TotalDuration, songId, is_premium } = playerState;
  const age = useAge();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userData = JSON.parse(localStorage.getItem('user'));
  const user_id = userData ? userData.id : null;

  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl) {
      setPlayerState(prevState => ({
        ...prevState,
        audioUrl,
        title,
        artist,
        Image,
        lyrics,
        album,
        playCount,
        TotalDuration,
        songId,
        is_premium
      }));
    }
  }, [audioUrl, title, artist, Image, lyrics, album, playCount, TotalDuration, songId, is_premium, setPlayerState]);

  const handlePlayPause = () => {
    if (currentTime >= 30 && !user) {
      handleWarningUser();
      navigate('/login');
      return;
    }
    if (currentTime >= 30 && user && is_premium === 1 && !payment.user_id) {
      navigate('/upgrade');
      return;
    }
    setIsPlaying(prev => !prev);
  };

  const getPayment = async () => {
    try {
      if (user) {
        const data = await getPaymentByUser();
        setPayments(data || []);
      }
    } catch (error) {
      console.error("Error fetching payment data", error);
      setPayments([]);
    }
  };

  useEffect(() => {
    if (user) {
      getPayment();
    }
  }, [user]);

  const getHistory = async () => {
    try {
      if (user) {
        const history = await getHistoryById(user_id);
        setHistory(history);
      }
    } catch (error) {
      setHistory([]);
    }
  }

  useEffect(() => {
    if (user) {
      getHistory();
    }
  }, [user])


  const handleAddHistory = async () => {
    try {
      const historyForSong = history.find(item => item.songId === songId);
      if (!historyForSong) {
        await addHistory(user_id, songId);
        setHasAddedHistory(true);
        await getHistory();
      }
      return;

    } catch (error) {
      console.error("Failed to add history:", error);
    }
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    if (!user && state.playedSeconds > 30) {
      setIsPlaying(false);
      return;
    }
    if (user) {
      if (is_premium === 1 && state.playedSeconds > 30) {
        if (payment.user_id) {
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
          navigate('/upgrade');
          return;
        }
      }
    }

    const seventyPercent = duration * 0.7;
    if (state.playedSeconds > seventyPercent && !hasAddedHistory) {
      handleAddHistory();
      setHasAddedHistory(true);
    }
    if (user && state.playedSeconds > seventyPercent && !hasListened) {
      incrementPlayCount(); 
      setHasListened(true);
    }
  };


  const incrementPlayCount = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
      const historyForSong = history.find(item => item.songId === songId); // Kiểm tra xem bài hát này đã có trong lịch sử chưa
      
      if (historyForSong) {
        const historyDate = formatDate(historyForSong.listeningDate); // Định dạng lại ngày lịch sử
        if (historyDate !== today) { // Nếu ngày lịch sử khác ngày hiện tại, tính lượt nghe
          const updatedPlayCount = await updatePlayCount(songId);
          setPlayerState(prevState => ({
            ...prevState,
            playCount: updatedPlayCount, // Cập nhật lượt nghe mới
          }));
          setHasListened(true); // Đánh dấu là đã tính lượt nghe
        }
      } else {
        // Nếu bài hát chưa có trong lịch sử, tính lượt nghe mới
        const updatedPlayCount = await updatePlayCount(songId);
        setPlayerState(prevState => ({
          ...prevState,
          playCount: updatedPlayCount,
        }));
        setHasListened(true);
      }
    } catch (error) {
      console.error("Error updating play count:", error);
    }
  };
  
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSliderChange = (e) => {
    if (is_premium === 1) {
      if (payment.user_id) {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
      }
      else {
        navigate('/upgrade');
      }
    } else {
      const newTime = parseFloat(e.target.value);
      setCurrentTime(newTime);
    }
  };

  const handleSliderMouseUp = () => {
    if (is_premium === 1 && playerRef.current) {
      if (payment.user_id) {
        playerRef.current.seekTo(currentTime, 'seconds');
      }
      else {
        navigate('/upgrade');
      }
    } else {
      playerRef.current.seekTo(currentTime, 'seconds');
    }
  };

  const handleTrackEnd = () => {
    if (isRepeat) {
      setPlayerState({
        ...playerState,
        audioUrl: playerState.audioUrl,
      });
      setIsPlaying(true);
    } else {
      nextSong();
    }
  };

  const handleRepeatToggle = () => {
    setIsRepeat((prevState) => !prevState);
  };

  const handleShuffleToggle = () => {
    setIsShuffle((prevState) => !prevState);
  };

  const currentIndex = clickedIndex !== null ? clickedIndex : Songs.findIndex((song) => song.file_song === playerState.audioUrl);

  const nextSong = () => {
    let nextIndex = currentIndex;
    let checkedSongs = 0;

    const findNextValidSong = () => {
      while (checkedSongs < Songs.length) {
        if (isShuffle) {
          nextIndex = Math.floor(Math.random() * Songs.length);
        } else {
          nextIndex = (nextIndex + 1) % Songs.length;
        }
        const nextSong = Songs[nextIndex];
        checkedSongs++;
        if (nextSong.is_explicit === 0 || age >= 18) {
          setPlayerState({
            audioUrl: nextSong.file_song,
            title: nextSong.title,
            artist: nextSong.artist,
            Image: nextSong.image,
            lyrics: nextSong.lyrics,
            album: nextSong.album,
            playCount: nextSong.listens_count,
            TotalDuration: nextSong.duration,
            songId: nextSong.songId,
            is_premium: nextSong.is_premium
          });
          setClickedIndex(nextIndex);
          return;
        }
        // if(is_premium && !payment.user_id){
        //   return
        // }
        handleWarning();
      }
    };
    findNextValidSong();
  };


  const prevSong = () => {
    if (currentIndex === 0) {
      return;
    }
    let prevIndex = currentIndex;
    let checkedSongs = 0;

    while (checkedSongs < Songs.length) {
      prevIndex = (prevIndex - 1 + Songs.length) % Songs.length;

      const prevSong = Songs[prevIndex];
      checkedSongs++;
      if (prevSong.is_explicit === 0 || age >= 18) {
        setPlayerState({
          audioUrl: prevSong.file_song,
          title: prevSong.title,
          artist: prevSong.artist,
          Image: prevSong.image,
          lyrics: prevSong.lyrics,
          album: prevSong.album,
          playCount: prevSong.listens_count,
          TotalDuration: prevSong.duration,
          songId: prevSong.songId,
          is_premium: prevSong.is_premium
        });
        setClickedIndex(prevIndex);
        return;
      }
      if (is_premium && !payment.user_id) {
        return
      }
      handleWarning();
    }
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
          lyrics={lyrics}
          user_id={payment.user_id}
        />
        <div className="control-buttons">
          <MdRepeat
            className={`icon-custom ${isRepeat ? 'text-blue-500' : ''}`}
            title="Repeat"
            onClick={handleRepeatToggle}  // Toggle Repeat
          />
          <CgPlayTrackPrev className="icon" onClick={prevSong} />
          <div className="state" onClick={handlePlayPause}>
            {isPlaying ? <BsFillPauseCircleFill className="icon" /> : <BsFillPlayCircleFill className="icon" />}
          </div>
          <CgPlayTrackNext className="icon" onClick={nextSong} />
          <MdShuffle className={`icon-custom ${isShuffle ? 'text-blue-500' : ''}`} title="Shuffle" onClick={handleShuffleToggle} />
        </div>
        <div className="parent-container">
          <Volume volume={volume} onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
            lyrics={lyrics}
            title={title}
            artist={artist}
            album={album}
            image={Image}
            playCount={playCount}
            audio={audioUrl}
            currentTime={currentTime}
            TotalDuration={TotalDuration}
            user_id={payment.user_id}
          />
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
