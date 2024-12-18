import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
    MdPlayArrow,
    MdShuffle,
    MdCheckBoxOutlineBlank,
    MdCheck
} from "react-icons/md";
import { getAlbumById } from "../../../../../services/album";
import { PlayerContext } from "Client/src/components/context/MusicPlayer";
import SongItem from "../../../components/dropdown/dropdownMenu";
import "../../../assets/css/artist/artist.css";
import useAge from "Client/src/components/calculateAge";
import { formatDuration } from "Admin/src/components/formatDate";
import { handleWarning } from "../../../components/notification";
import LikeButton from "../../../components/button/favorite";
import { slugify } from "Client/src/components/createSlug";

const ListSongOfAlbums = () => {
    const [album, setAlbum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [likedSongs, setLikedSongs] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState(new Set());
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    const { id } = useParams();
    const dropdownRefs = useRef({});
    const { setPlayerState, Songs, clickedIndex, setClickedIndex } = useContext(PlayerContext);
    const age = useAge();

    // Fetch album details
    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const response = await getAlbumById(id);
                console.log('Album API Response:', response);
                console.log('Album Songs:', response.songs);
                if (response) {
                    setAlbum(response);
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching album:', err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [id]);

    // Song click handler
    const handleSongClick = (song, index) => {
        console.log('Song clicked - Full song object:', song);
        console.log('Song File URL:', song.songFile || song.file_song);
        console.log('Album context:', album);
        
        if (song.is_explicit === 1 && age < 18) {
            handleWarning();
            setClickedIndex(null);
            return;
        }

        const playerData = {
            audioUrl: song.songFile || song.file_song || song.file,  // Thêm song.file
            title: song.title,
            artist: album.artistName,
            Image: song.image,
            lyrics: song.lyrics,
            album: album.title,
            playCount: song.songListensCount || song.listens_count,
            TotalDuration: song.songDuration || song.duration,
            songId: song.id,
            is_premium: song.songIsPremium || song.is_premium,
            artistID: song.artistIds?.[0] || album.artistId
        };

        console.log('Setting player state with:', playerData);
        setPlayerState(playerData);
        
        setClickedIndex(index);
        setHoveredIndex(index);

        try {
            const songsToStore = album.songs.map(s => {
                const songData = {
                    ...s,
                    audioUrl: s.songFile || s.file_song || s.file,
                    title: s.title,
                    artist: album.artistName,
                    Image: s.image,
                    lyrics: s.lyrics,
                    album: album.title,
                    playCount: s.songListensCount || s.listens_count,
                    TotalDuration: s.songDuration || s.duration,
                    songId: s.id,
                    is_premium: s.songIsPremium || s.is_premium,
                    artistID: s.artistIds?.[0] || album.artistId
                };
                console.log('Processed song for storage:', songData);
                return songData;
            });
            
            localStorage.setItem("songs", JSON.stringify(songsToStore));
        } catch (error) {
            console.error("Error saving songs to localStorage:", error);
        }
    };

    // Checkbox and selection methods
    const handleCheckboxToggle = (index) => {
        setSelectedCheckboxes(prevSelectedCheckboxes => {
            const updatedCheckboxes = new Set(prevSelectedCheckboxes);
            if (updatedCheckboxes.has(index)) {
                updatedCheckboxes.delete(index);
            } else {
                updatedCheckboxes.add(index);
            }

            if (updatedCheckboxes.size === album.songs.length) {
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
            const allIndices = album.songs.map((_, idx) => idx);
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

    const handleDropdownToggle = (index) => {
        setDropdownIndex(index === dropdownIndex ? null : index);
    };

    const isAnyCheckboxSelected = () => {
        return selectedCheckboxes.size > 0;
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!album) return <p>No album found</p>;

    return (
        <div className="w-full text-white">
            {/* Song List */}
            <div className="pt-4 w-full">
                <div className="flex flex-col">
                    {/* Play and Control Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <button className="bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-3">
                                <MdPlayArrow size={24} />
                            </button>
                            <button className="flex items-center bg-icon text-white p-2 rounded-full hover:bg-blue-700 transition ml-4">
                                <MdShuffle size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Select All and Checkboxes */}
                    <div className="flex">
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
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Song List */}
                    <div className="flex flex-col gap-4 pt-2">
                        {album.songs.map((song, index) => (
                            <div
                                key={index}
                                className={`relative flex items-center p-2 rounded-lg transition-colors
                                    ${hoveredIndex === index ? "bg-gray-700" : ""}
                                    ${clickedIndex === index ? "bg-gray-600" : "hover:bg-gray-700"}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => handleSongClick(song, index)}
                            >
                                {/* Checkbox */}
                                {(hoveredIndex === index || selectedCheckboxes.size > 0) && (
                                    <div
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-4"
                                        style={{ zIndex: 2 }}
                                    >
                                        <div
                                            className={`relative cursor-pointer ${selectedCheckboxes.has(index) ? 'text-gray-400' : 'text-gray-400'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCheckboxToggle(index);
                                            }}
                                        >
                                            <MdCheckBoxOutlineBlank size={23} />
                                            {selectedCheckboxes.has(index) && (
                                                <MdCheck
                                                    size={16}
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Song Index */}
                                <p
                                    className={`text-sm font-semibold w-8 text-center ${hoveredIndex === index || selectedCheckboxes.size > 0
                                        ? "opacity-0"
                                        : ""
                                        }`}
                                >
                                    {index + 1}
                                </p>

                                {/* Song Image */}
                                <img
                                    src={song.image}
                                    alt={song.title}
                                    className="w-14 h-14 object-cover rounded-lg ml-2"
                                />

                                {/* Song Details */}
                                <div className="flex flex-grow flex-col ml-3 relative">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center w-[400px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            <p className="text-sm font-semibold overflow-hidden text-ellipsis">
                                                {song.title}
                                            </p>
                                            {song.is_premium === 1 && (
                                                <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded ml-2 shrink-0">
                                                    PREMIUM
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 flex items-center justify-end">
                                            {hoveredIndex === index && (
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <LikeButton 
                                                        songId={song.id}
                                                        className="mr-[50px]"
                                                    />
                                                </div>
                                            )}

                                            <p
                                                className={`text-gray-500 text-sm w-20 text-right ${hoveredIndex === index ? "opacity-0" : ""}`}
                                            >
                                                {formatDuration(song.duration)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm mt-1 relative z-10">
                                        <Link
                                            to={`/artist/${slugify(album.artistName)}`}
                                            className="text-gray-400 text-sm hover:text-blue-500 hover:underline"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {album.artistName}
                                        </Link>
                                    </p>

                                    <SongItem
                                        key={index}
                                        song={song}  // Truyền toàn bộ object song
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

export default ListSongOfAlbums;
