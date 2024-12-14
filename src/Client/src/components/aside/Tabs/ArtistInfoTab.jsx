import React, { useState, useContext, useEffect } from "react";
import LikeButton from "../../button/favorite/"; // Assuming LikeButton is in the same directory
import CopyLink from "../../button/copy";
import { PlayerContext } from "../../context/MusicPlayer";
import { getArtistById } from "services/artist";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { 
  useToggleFollowArtistMutation,
  useGetUserFollowedArtistsQuery,
  useGetTopFollowedArtistsQuery
} from "../../../../../../src/redux/slice/followSlice";
import { useSelector } from "react-redux";
import { MdPersonAdd, MdCheck } from "react-icons/md";

const ArtistInfoTab = ({ onTabChange }) => {
  const { playerState } = useContext(PlayerContext);
  const {
    title,
    artist,
    Image,
    lyrics,
    album,
    playCount,
    TotalDuration,
    songId,
    is_premium,
    artistID,
    artistName
  } = playerState;


  const [artistInfo, setArtistInfo] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const currentUser = useSelector((state) => state.auth.user);
  const [toggleFollowArtist] = useToggleFollowArtistMutation();
  
  const { data: userFollowedArtists, refetch: refetchFollowed } = useGetUserFollowedArtistsQuery(undefined, {
    skip: !currentUser,
    refetchOnMountOrArgChange: true
  });

  const { data: topFollowedArtists, refetch: refetchTop } = useGetTopFollowedArtistsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const getArtistInfo = async () => {
    try {
      if (!artistID && artistID !== 0) {
        setArtistInfo([]);
        return;
      }
      
      // Xử lý cả trường hợp số và chuỗi
      const artistIds = typeof artistID === 'string' 
        ? artistID.split(',').map(id => id.trim()).filter(id => id)
        : [artistID.toString()];

      const artistsData = await Promise.all(
        artistIds.map(async id => {
          const data = await getArtistById(id);
          return data;
        })
      );
      const validArtists = artistsData.filter(data => data != null);
      setArtistInfo(validArtists);
    } catch (error) {
      setArtistInfo([]);
    }
  };

  useEffect(() => {
    getArtistInfo();
  }, [artistID]);

  useEffect(() => {
    if (artistInfo && userFollowedArtists) {
      const isCurrentlyFollowing = userFollowedArtists.some(
        followedArtist => followedArtist.id === artistInfo[0]?.id
      );
      setIsFollowing(isCurrentlyFollowing);
    }
  }, [artistInfo, userFollowedArtists]);

  const handleFollow = async (artistId) => {
    try {
      if (!currentUser) return;
      
      const response = await toggleFollowArtist(artistId).unwrap();
      if (response.data) {
        setIsFollowing(response.data.isFollowing);
        
        await Promise.all([
          refetchFollowed(),
          refetchTop()
        ]);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  return (
    <div className="p-4 h-screen text-white">
      {/* Detail song for Artist */}
      <div className="mb-1">
        <img
          src={Image}
          alt={title}
          className="w-96 h-80 object-cover rounded-md"
        />
        <div className="flex flex-col">
          {/* Bố cục tên bài hát, nghệ sĩ và icon */}
          <div className="flex items-center justify-between mb-2">
            {/* Tên bài hát và nghệ sĩ */}
            <div>
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="text-sm text-gray-300">{artist}</p>
            </div>
            {/* Icon Like và Copy Link */}
            <div className="flex items-center space-x-2">
              <LikeButton likedSongs={false} handleLikeToggle={() => { }} />
              <CopyLink copyLink={false} handleCopyLink={() => { }} />
            </div>
          </div>
        </div>
      </div>

      {artistInfo.map((artist, index) => (
        <div key={index} className="mb-8 rounded-md border-b border-gray-700 pb-8">
          <Link to={`/artist/${slugify(artist.name)}`}>
          <img
            src={artist.avatar || Image}
            alt={artist.name}
            className="w-96 h-80 object-cover rounded-md mb-2"
          />
          </Link>
          <span className="text-lg font-bold relative -top-80 left-2">
            About the artist
          </span>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
              <p className="text-sm text-gray-300">
                {typeof artist.monthlyListeners === 'number'
                  ? artist.monthlyListeners.toLocaleString()
                  : '0'} monthly listeners
              </p>
            </div>
            <button
              onClick={() => handleFollow(artist.id)}
              className={`flex items-center px-4 py-2 border rounded-md transition duration-300 ml-4 ${
                isFollowing
                  ? "bg-sky-500 text-white border-transparent"
                  : "border-sky-500 text-white-500 hover:bg-sky-500 hover:border-transparent hover:text-white"
              }`}
            >
              {isFollowing ? (
                <>
                  <MdCheck className="mr-2 h-5 w-5" />
                  Following
                </>
              ) : (
                <>
                  <MdPersonAdd className="mr-2 h-5 w-5" />
                  Follow
                </>
              )}
            </button>
          </div>
          {/* Artist bio */}
          <p className="text-sm mt-2">
            {artist.biography || 'No biography available'}
          </p>
        </div>
      ))}

      {/* Participants section */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-bold my-2">Participants</h3>
        {artistInfo?.participants?.map((participant, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">{participant.artistName}</p>
              <p className="text-sm text-gray-300">{participant.artistRole}</p>
            </div>
            <button
              onClick={() => handleFollow(participant.artistName)}
              className={`flex items-center px-4 py-2 border rounded-md transition duration-300 ${
                isFollowing(participant.artistName)
                  ? "bg-sky-500 text-white border-transparent"
                  : "border-sky-500 text-white-500 hover:bg-sky-500 hover:border-transparent hover:text-white"
              }`}
            >
              {isFollowing(participant.artistName) ? <>Following</> : <>Follow</>}
            </button>
          </div>
        ))}
        <button variant="text" size="small" className="text-blue-400 mt-2">
          Show all
        </button>
      </div> */}

      {/* Next on the waiting list */}
      {/* <div>
        <h3 className="text-lg font-bold mb-2">Next on the waiting list</h3>
        <div className="flex items-center">
          <img
            src={artistInfo.artistAvatar}
            alt={artistInfo.title}
            className="w-12 h-12 object-cover rounded-md mr-3"
          />
          <div>
            <p className="font-bold">{artistInfo.title}</p>
            <p className="text-sm text-gray-300">
              {artistInfo.nextSong.artist}
            </p>
          </div>
          <div className="ml-auto">
            <LikeButton likedSongs={false} handleLikeToggle={() => {}} />
          </div>
        </div>
        <button
          onClick={() => onTabChange(0)} // Chuyển về tab "Playlist"
          variant="text"
          size="small"
          className="text-blue-400 mt-2"
        >
          Open waiting list
        </button>
      </div> */}
    </div>
  );
};

export default ArtistInfoTab;
