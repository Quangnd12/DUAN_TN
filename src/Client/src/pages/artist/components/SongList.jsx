import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { 
    MdPlayArrow, 
    MdShuffle, 
    MdCheckBoxOutlineBlank, 
    MdCheck 
} from "react-icons/md";

import SongItem from "../../../components/dropdown/dropdownMenu";
import { getArtistById, getAllArtists } from "../../../../../../src/services/artist";
import { slugify } from "Client/src/components/createSlug";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import useAge from "Client/src/components/calculateAge";
import { handleWarning } from "../../../components/notification";
import { formatDuration } from "Client/src/components/format";

const AllSong = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [likedSongs, setLikedSongs] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [artistSongs, setArtistSongs] = useState([]);
    const [artist, setArtist] = useState(null);

    const { artistName } = useParams();
    const dropdownRefs = useRef({});
    const { setPlayerState, clickedIndex, setClickedIndex } = useContext(PlayerContext);
    const age = useAge();

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const { artists } = await getAllArtists();
                const currentArtist = artists.find(
                    (artist) => slugify(artist.name) === artistName
                );

                if (currentArtist) {
                    const artistDetails = await getArtistById(currentArtist.id);
                    setArtist(artistDetails);

                    const formattedSongs = artistDetails.songs.map(song => ({
                        id: song.id,
                        title: song.title,
                        file_song: song.file,
                        image: song.image,
                        lyrics: song.lyrics,
                        name: artistDetails.name,
                        is_explicit: song.is_explicit || 0,
                        listens_count: song.listens_count || 0,
                        duration: song.duration || 0,
                        is_premium: song.is_premium,
                        artistID: artistDetails.id,
                        releaseDate: song.releaseDate,
                        albumID: song.albumId,
                        albumName: song.albumTitle
                    }));

                    setArtistSongs(formattedSongs);
                }
            } catch (error) {
                console.error("Error fetching artist songs:", error);
            }
        };

        fetchArtistData();
    }, [artistName]);

    const handleRowClick = (song, index) => {
        if (song.is_explicit === 1 && age < 18) {
            handleWarning();
            setClickedIndex(null);
            return;
        }
        
        setPlayerState({
            audioUrl: song.file_song,
            title: song.title,
            artist: song.name,
            Image: song.image,
            lyrics: song.lyrics,
            album: song.title,
            playCount: song.listens_count,
            TotalDuration: song.duration,
            songId: song.id,
            is_premium:song.is_premium,
            artistID:song.artistID
        });
        setClickedIndex(index);
        
        try {
            localStorage.setItem("songs", JSON.stringify(artistSongs));
        } catch (error) {
            console.error("Error saving songs to localStorage:", error);
        }
    };

    const handlePlayAll = () => {
        if (artistSongs.length > 0) {
            const validSongs = artistSongs.filter(song => 
                song.is_explicit !== 1 || age >= 18
            );
            
            if (validSongs.length > 0) {
                handleRowClick(validSongs[0], 0);
            } else {
                handleWarning();
            }
        }
    };

    const handleShufflePlay = () => {
        if (artistSongs.length > 0) {
            const validSongs = artistSongs.filter(song => 
                song.is_explicit !== 1 || age >= 18
            );
            
            if (validSongs.length > 0) {
                const randomIndex = Math.floor(Math.random() * validSongs.length);
                handleRowClick(validSongs[randomIndex], randomIndex);
            } else {
                handleWarning();
            }
        }
    };

    const isAnyCheckboxSelected = () => {
        return selectedCheckboxes.size > 0;
    };

    const handleCheckboxToggle = (index) => {
        setSelectedCheckboxes(prevSelectedCheckboxes => {
            const updatedCheckboxes = new Set(prevSelectedCheckboxes);
            if (updatedCheckboxes.has(index)) {
                updatedCheckboxes.delete(index);
            } else {
                updatedCheckboxes.add(index);
            }

            if (updatedCheckboxes.size === artistSongs.length) {
                setIsSelectAllChecked(true);
            } else if (updatedCheckboxes.size === 0) {
                setIsSelectAllChecked(false);
            } else {
                setIsSelectAllChecked(false);
            }

            return updatedCheckboxes;
        });
    };

    const handleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedCheckboxes(new Set());
        } else {
            const allIndices = artistSongs.map((_, idx) => idx);
            setSelectedCheckboxes(new Set(allIndices));
        }
        setIsSelectAllChecked(!isSelectAllChecked);
    };

    const handleLikeToggle = (index) => {
        setLikedSongs((prevLikedSongs) => ({
            ...prevLikedSongs,
            [index]: !prevLikedSongs[index],
        }));
    };

    const handleDropdownToggle = (index, e) => {
        e.stopPropagation(); 
        setDropdownIndex(index === dropdownIndex ? null : index);
    };

    const handleOptionSelect = (action) => {
        console.log('Selected action:', action);
        // Xử lý action tại đây
    };

    const isReleased = (releaseDate) => {
        if (!releaseDate) return true;
        const today = new Date();
        const release = new Date(releaseDate);
        return release <= today;
    };

    if (!artist) {
        return <div className="text-white p-4">Loading artist songs...</div>;
    }

    return (
        <div className="p-6 text-white bg-zinc-900 rounded-md overflow-hidden">
            <div className="max-w-full mx-auto">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold">{artist.name} - All songs</h2>
                            <button 
                                className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3"
                                onClick={handlePlayAll}
                            >
                                <MdPlayArrow size={24} />
                            </button>
                        </div>
                        <button 
                            className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition"
                            onClick={handleShufflePlay}
                        >
                            <MdShuffle size={24} className="mr-2" />
                            Random Play
                        </button>
                    </div>

                    {/* Phần hiển thị checkbox và các nút chức năng */}
                    <div className="flex items-center">
                        {isAnyCheckboxSelected() && (
                            <div
                                className="relative flex items-center p-2 rounded-lg mb-2 cursor-pointer"
                                onClick={handleSelectAll}
                            >
                                <div className="flex items-center">
                                    <div className="relative">
                                        <MdCheckBoxOutlineBlank
                                            className="text-gray-400 cursor-pointer hover:text-gray-600"
                                            size={23}
                                        />
                                        {isSelectAllChecked && (
                                            <MdCheck
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400"
                                                size={16}
                                            />
                                        )}
                                    </div>
                                    <p className="text-gray-400 ml-2 border border-gray-600 p-1 rounded-[30px] w-[100px] text-center flex items-center justify-center">
                                        Select all
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedCheckboxes.size > 0 && artistSongs.length > 0 && (
                            <div className="flex ml-4 mb-2 items-center">
                            </div>
                        )}
                    </div>

                    {/* Danh sách bài hát */}
                    <div className="flex flex-col gap-4 pt-2">
                        {artistSongs
                            .filter(song => isReleased(song.releaseDate))
                            .map((song, index) => (
                                <div
                                    key={song.id}
                                    className={`relative flex items-center p-2 rounded-lg transition-colors hover:bg-gray-700 
                                        ${hoveredIndex === index || clickedIndex === index ? "bg-gray-700" : ""}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => handleRowClick(song, index)}
                                >
                                    {/* Checkbox và các nút chức năng */}
                                    {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                                        <div 
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4" 
                                            style={{ zIndex: 2 }}
                                        >
                                            <div
                                                className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? 'text-blue-400' : 'text-gray-400'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckboxToggle(index);
                                                }}
                                            >
                                                <MdCheckBoxOutlineBlank size={23} />
                                                {selectedCheckboxes.has(index) && (
                                                    <MdCheck 
                                                        size={16} 
                                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nội dung bài hát */}
                                    <p className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0 ? "opacity-0" : ""}`}>
                                        {index + 1}
                                    </p>
                                    <img
                                        src={song.image}
                                        alt={song.title}
                                        className="w-14 h-14 object-cover rounded-lg ml-2"
                                    />
                                    <div className="flex flex-grow flex-col ml-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-semibold w-48 whitespace-nowrap overflow-hidden text-ellipsis w-[370px]">
                                                {song.title}
                                            </p>
                                            <div className="absolute top-[25px] justify-end right-[200px]">
                                                <Link to={`/album/${song.albumID}`}>
                                                    <p className="text-gray-500 text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis w-[370px] hover:text-blue-500 hover:underline no-underline">
                                                        {song.albumName}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div className="absolute top-[25px] justify-end right-[10px]">
                                                <p
                                                    className={`text-gray-500 text-sm w-20 text-right mr-2 ${
                                                        hoveredIndex === index ? "opacity-0" : ""
                                                    }`}
                                                >
                                                   {formatDuration(song.duration)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1" style={{ zIndex: 1 }}>
                                            <span className="flex items-center">
                                                <Link to={`/artist/${slugify(song.name)}`}>
                                                    <p className="text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:text-blue-500 hover:underline">
                                                        {song.name}
                                                    </p>
                                                </Link>
                                            </span>
                                        </div>
                                        
                                        <SongItem
                                            song={song}
                                            index={index}
                                            hoveredIndex={hoveredIndex}
                                            clickedIndex={clickedIndex}
                                            setHoveredIndex={setHoveredIndex}
                                            setClickedIndex={setClickedIndex}
                                            likedSongs={likedSongs}
                                            handleLikeToggle={handleLikeToggle}
                                            handleDropdownToggle={handleDropdownToggle}
                                            dropdownIndex={dropdownIndex}
                                            dropdownRefs={dropdownRefs}
                                            setShowShareOptions={setShowShareOptions}
                                            showShareOptions={showShareOptions}
                                            align={'right'}
                                            type="song"
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllSong;