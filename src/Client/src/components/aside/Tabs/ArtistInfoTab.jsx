import React, { useState } from "react";
import LikeButton from "../../button/favorite/"; // Assuming LikeButton is in the same directory
import CopyLink from "../../button/copy";
const ArtistInfoTab = ({ onTabChange }) => {
  const [followingArtists, setFollowingArtists] = useState([]);

  const detailSong = {
    title: "Em là",
    artist: "MONO",
    imageUrl:
      "https://galaxylands.com.vn/wp-content/uploads/2022/10/tieu-su-ca-si-mono-17.jpg",
  };

  const artistInfo = {
    name: "MONO",
    monthlyListeners: "428,284",
    bio: "MONO (Nguyen Viet Hoang), who was born in 21/01/2000, is an artist representing dynamic but profound young people...",
    imageUrl:
      "https://media.molistar.com/thumb_w/editors/2023/12/01/sdff_680.png", // Update with actual image URL
    participants: [
      { name: "MONO", role: "Artist" },
      { name: "ONIONN", role: "Artist" },
    ],
    nextSong: {
      title: "Em xinh",
      artist: "Mono",
      coverUrl:
        "	https://i.scdn.co/image/ab67616d0000b2730eddb908568880a2a5bc822a", // Update with actual cover URL
    },
  };

  // Hàm xử lý logic theo dõi/hủy theo dõi
  const handleFollow = (artistName) => {
    if (followingArtists.includes(artistName)) {
      // Logic hủy theo dõi
      setFollowingArtists(
        followingArtists.filter((name) => name !== artistName)
      );
    } else {
      // Theo logic
      setFollowingArtists([...followingArtists, artistName]);
    }
  };

  const isFollowing = (artistName) => followingArtists.includes(artistName);

  return (
    <div className="p-4 h-screen text-white">
      {/* Detail song for Artist */}
      <div className="mb-1">
        <img
          src={detailSong.imageUrl}
          alt={detailSong.name}
          className="w-96 h-80 object-cover rounded-md"
        />
        <div className="flex flex-col">
          {/* Bố cục tên bài hát, nghệ sĩ và icon */}
          <div className="flex items-center justify-between mb-2">
            {/* Tên bài hát và nghệ sĩ */}
            <div>
              <h2 className="text-3xl font-bold">{detailSong.title}</h2>
              <p className="text-sm text-gray-300">{detailSong.artist}</p>
            </div>
            {/* Icon Like và Copy Link */}
            <div className="flex items-center space-x-2">
              <LikeButton likedSongs={false} handleLikeToggle={() => {}} />
              <CopyLink copyLink={false} handleCopyLink={() => {}} />
            </div>
          </div>
        </div>
      </div>

      {/* Artist image and info */}
      <div className="mb-4 rounded-md">
        <img
          src={artistInfo.imageUrl}
          alt={artistInfo.name}
          className="w-96 h-80 object-cover rounded-md mb-2"
        />
        <span className="text-lg font-bold relative -top-80 left-2">
          About the artist
        </span>
        <div className="flex items-center justify-between">
          {/* Thông tin nghệ sĩ */}
          <div>
            <h2 className="text-3xl font-bold mb-2">{artistInfo.name}</h2>
            <p className="text-sm text-gray-300">
              {artistInfo.monthlyListeners} monthly listeners
            </p>
          </div>
          {/* Nút Follow */}
          <button
            onClick={() => handleFollow(artistInfo.name)}
            className={`flex items-center px-4 py-2 border rounded-md transition duration-300 ml-4 ${
              isFollowing(artistInfo.name)
                ? "bg-sky-500 text-white border-transparent"
                : "border-sky-500 text-white-500 hover:bg-sky-500 hover:border-transparent hover:text-white"
            }`}
          >
            {isFollowing(artistInfo.name) ? <>Following</> : <>Follow</>}
          </button>
        </div>
        {/* Artist bio */}
        <p className="text-sm mt-2">{artistInfo.bio}</p>
      </div>

      {/* Participants section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold my-2">Participants</h3>
        {artistInfo.participants.map((participant, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">{participant.name}</p>
              <p className="text-sm text-gray-300">{participant.role}</p>
            </div>
            <button
              onClick={() => handleFollow(participant.name)}
              className={`flex items-center px-4 py-2 border rounded-md transition duration-300 ${
                isFollowing(participant.name)
                  ? "bg-sky-500 text-white border-transparent"
                  : "border-sky-500 text-white-500 hover:bg-sky-500 hover:border-transparent hover:text-white"
              }`}
            >
              {isFollowing(participant.name) ? <>Following</> : <>Follow</>}
            </button>
          </div>
        ))}
        <button variant="text" size="small" className="text-blue-400 mt-2">
          Show all
        </button>
      </div>

      {/* Next on the waiting list */}
      <div>
        <h3 className="text-lg font-bold mb-2">Next on the waiting list</h3>
        <div className="flex items-center">
          <img
            src={artistInfo.nextSong.coverUrl}
            alt={artistInfo.nextSong.title}
            className="w-12 h-12 object-cover rounded-md mr-3"
          />
          <div>
            <p className="font-bold">{artistInfo.nextSong.title}</p>
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
      </div>
    </div>
  );
};

export default ArtistInfoTab;
