import React, { useState } from "react";
import { MdPersonAdd, MdCheck } from "react-icons/md";
import { useParams } from "react-router-dom";

import "../../../assets/css/artist/artist.css";
import data from "../../../data/fetchSongData";
import MoreButton from "../../../components/button/more";
import {slugify} from "Client/src/components/createSlug";

const ArtistInfo = () => {

  const [isFollowing, setIsFollowing] = useState(false);

  const { artistName } = useParams();
  const artist = data.artists.find(artist => slugify(artist.name) === artistName);

  const handleClick = () => {
    setIsFollowing(!isFollowing);
  };

  const handleOptionSelect = (action) => {
    console.log('Selected action:', action);
    // Xử lý action tại đây
  };

  return (
    <div className="relative w-full h-3/5 flex ">
      <div className="w-3/5 h-[400px] artist-bg flex items-center justify-center p-8">
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={artist.image}
              alt="Artist Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <div className="flex items-center space-x-2">
              <h6 className="text-3xl font-bold">{artist.name}</h6>
              <div className="bg-transparent p-1 rounded-full">
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  className="h-6 w-6 "
                  viewBox="0 0 24 24"
                  style={{ color: '#fff' }}
                >
                  <path
                    d="M10.814.5a1.658 1.658 0 0 1 2.372 0l2.512 2.572 3.595-.043a1.658 1.658 0 0 1 1.678 1.678l-.043 3.595 2.572 2.512c.667.65.667 1.722 0 2.372l-2.572 2.512.043 3.595a1.658 1.658 0 0 1-1.678 1.678l-3.595-.043-2.512 2.572a1.658 1.658 0 0 1-2.372 0l-2.512-2.572-3.595.043a1.658 1.658 0 0 1-1.678-1.678l.043-3.595L.5 13.186a1.658 1.658 0 0 1 0-2.372l2.572-2.512-.043-3.595a1.658 1.658 0 0 1 1.678-1.678l3.595.043L10.814.5zm6.584 9.12a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"
                    fill="#4cb3ff"
                  ></path>
                </svg>
              </div>

            </div>
            <p className="text-left text-lg mt-2">1,017,761 followers</p>
            <div className="grid grid-cols-2">
              <button
                onClick={handleClick}
                className={`flex items-center px-4 py-2 mt-2 border rounded-full transition duration-300 ${isFollowing
                  ? "bg-blue-500 text-white border-transparent"
                  : "border-white-500 text-white-500 hover:bg-blue-500 hover:border-transparent hover:text-white"
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
              <div className="relative top-4 ml-2">
                <MoreButton type="artist" onOptionSelect={handleOptionSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] bg-gray-300 overflow-hidden">
        <img
          src={artist.image}
          alt="Artist Large Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ArtistInfo;
