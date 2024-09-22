import React, { useState, useEffect } from "react";
import PlayerControls from "../audio/PlayerControls";

const songs = [
  {
    image: "https://i.scdn.co/image/ab67616d00001e027c17174be9cdaa69349f47d6",
    name: "Ai Mà Biết Được (feat. tlinh)",
    artist: "Adele",
    details: "1,947,983",
    duration: "4:00",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e027c17174be9cdaa69349f47d6",
    name: "NGÁO NGƠ- LYRICS (feat. HIEUTHUHAI, JSOL, Erik, Anh Tú ATUS, Orange) | ANH TRAI SAY HI",
    artist: "HIEUTHUHAI, JSOL, Erik, Anh Tú ATUS, Orange, HIEUTHUHAI, JSOL, Erik, Anh Tú ATUS, Orange",
    details: "4,065,807",
    duration: "3:43",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e022922307c16bb852a0849bea0",
    name: "Anh Đã Quen Với Cô Đơn",
    artist: "HIEUTHUHAI, JSOL, Erik, Anh Tú ATUS",
    details: "10,119,884",
    duration: "4:28",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e027c17174be9cdaa69349f47d6",
    name: "Ai Mà Biết Được (feat. tlinh)",
    artist: "Adele",
    details: "1,947,983",
    duration: "4:00",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e027c17174be9cdaa69349f47d6",
    name: "giá như",
    artist: "Adele",
    details: "4,065,807",
    duration: "3:43",
  },
  {
    image: "https://i.scdn.co/image/ab67616d00001e022922307c16bb852a0849bea0",
    name: "Anh Đã Quen Với Cô Đơn",
    artist: "Adele",
    details: "10,119,884",
    duration: "4:28",
  },
];

const GridItems = () => {

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleRowClick = (song, index) => {
    setSelectedPlayer(song);
    setClickedIndex(index);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {songs.map((song, index) => (
        <div
          key={index}
          className={`relative rounded-md bg-zinc-900 hover:bg-zinc-700 overflow-hidden
         ${clickedIndex === index ? "bg-gray-700" : ""}`}       
          onClick={() => handleRowClick(song, index)}
        >
          <img
            src={song.image}
            alt={song.name}
            className="w-20 h-20 object-cover"
          />
          <div className="absolute top-6 left-20  text-white p-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-[300px]">
            {song.name}
          </div>
        </div>
      ))}
      {selectedPlayer && (
        <PlayerControls
          title={selectedPlayer.name}
          artist={selectedPlayer.artist}
          Image={selectedPlayer.image}
          next={() => {/*  next track */ }}
          prevsong={() => {/*  previous track */ }}
          onTrackEnd={() => {/* Handle track end */ }}
        />
      )}
    </div>
  );
};

export default GridItems;
