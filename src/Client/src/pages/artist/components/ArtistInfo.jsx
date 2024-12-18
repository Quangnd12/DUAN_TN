import React, { useState, useEffect } from "react";
import { MdPersonAdd, MdCheck } from "react-icons/md";
import { useParams } from "react-router-dom";
import "../../../assets/css/artist/artist.css";
import MoreButton from "../../../components/button/more";
import { slugify } from "Client/src/components/createSlug";
import { getArtistById, getAllArtists } from "../../../../../../src/services/artist";
import { 
  useToggleFollowArtistMutation,
  useGetUserFollowedArtistsQuery,
  useGetTopFollowedArtistsQuery
} from "../../../../../redux/slice/followSlice";
import { useSelector } from "react-redux";

const ArtistInfo = () => {
  const [artist, setArtist] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { artistName } = useParams();

  const currentUser = useSelector((state) => state.auth.user);
  const [toggleFollowArtist] = useToggleFollowArtistMutation();
  
  const { data: userFollowedArtists, refetch: refetchFollowed } = useGetUserFollowedArtistsQuery(undefined, {
    skip: !currentUser,
    refetchOnMountOrArgChange: true
  });

  const { data: topFollowedArtists, refetch: refetchTop } = useGetTopFollowedArtistsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const { artists } = await getAllArtists();
        const currentArtist = artists.find(
          (artist) => slugify(artist.name) === artistName
        );

        if (currentArtist) {
          const artistDetails = await getArtistById(currentArtist.id);
          
          const topArtist = topFollowedArtists?.find(
            (artist) => artist.id === currentArtist.id
          );

          setArtist({
            ...artistDetails,
            followerCount: topArtist?.followerCount ?? artistDetails.followerCount,
          });

          setIsFollowing(userFollowedArtists?.some(artist => artist.id === currentArtist.id) || false);
        }
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
    };

    fetchArtistData();
  }, [artistName, userFollowedArtists, topFollowedArtists]);

  const handleClick = async () => {
    try {
      if (!currentUser || !artist) return;
      
      const response = await toggleFollowArtist(artist.id).unwrap();
      if (response.data) {
        setIsFollowing(response.data.isFollowing);
        setArtist(prevArtist => ({
          ...prevArtist,
          followerCount: response.data.isFollowing 
            ? prevArtist.followerCount + 1 
            : prevArtist.followerCount - 1
        }));

        await Promise.all([
          refetchFollowed(),
          refetchTop()
        ]);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  const handleOptionSelect = (action) => {
    console.log('Selected action:', action);
    // Xử lý action tại đây
  };

  if (!artist) {
    return <p>Loading artist data...</p>;
  }

  return(
    <div className="relative w-full h-3/5 flex">
      <div className="w-3/5 h-[400px] artist-bg flex items-center justify-center p-8">
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
            <img
              src={artist.avatar || "default_image_path.jpg"} 
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
                  className="h-6 w-6"
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
            <p className="text-left text-lg mt-2">
              {artist.followerCount} followers
            </p>
            <div className="grid grid-cols-2">
              <button
                onClick={handleClick}
                className={`flex items-center px-4 py-2 mt-2 border rounded-full transition duration-300 ${
                  isFollowing
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
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px] bg-gray-300 overflow-hidden">
        <img
          src={artist.avatar || "default_image_path.jpg"}
          alt="Artist Large Image"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ArtistInfo;
