import React, { useState, useRef } from 'react';
// import PlayIcon from '../../components/Icons/PlayIcon';
import InfoClientCard from '../../components/cards/Info-clientCard';
import InfoClientFollowingCard from '../../components/cards/Info-clientFollowingCard';
import tb from '../../../public/assets/img/image 27.png';

const InfoClient = () => {
  const topTracks = [
    {
      id: 1,
      title: 'Tên bài hát 1',
      artist: 'Tên nghệ sĩ 1',
      duration: '4:30',
      imageUrl: '/assets/images/anh1.jpg',
    },
    {
      id: 2,
      title: 'Tên bài hát 2',
      artist: 'Tên nghệ sĩ 2',
      duration: '3:45',
      imageUrl: '/assets/images/anh1.jpg',
    },
    {
      id: 3,
      title: 'Tên bài hát 3',
      artist: 'Tên nghệ sĩ 3',
      duration: '5:00',
      imageUrl: '/assets/images/anh1.jpg',
    },
  ];

  const followingArtists = [
    {
      id: 1,
      name: 'Tên nghệ sĩ theo dõi 1',
      imageUrl: '/assets/images/anh1.jpg',
    },
    {
      id: 2,
      name: 'Tên nghệ sĩ theo dõi 2',
      imageUrl: '/assets/images/anh2.jpg',
    },
    {
      id: 3,
      name: 'Tên nghệ sĩ theo dõi 3',
      imageUrl: '/assets/images/anh2.jpg',
    },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/assets/images/anh1.jpg');
  const [name, setName] = useState('TÊN NGƯỜI DÙNG');
  
  // Create a reference to the file input
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Perform save actions here
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Function to handle overlay click
  const handleOverlayClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-black text-white p-5 w-full h-auto">
      <div className="bg-zinc-800 p-20 rounded-lg">
        <div className="flex items-center flex-col sm:flex-row">
          <img
            className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-gray-300 object-cover mb-4 sm:mb-0 sm:mr-6 cursor-pointer transition-transform duration-300 hover:scale-105"
            src={profileImage}
            alt="Avatar"
            onClick={handleImageClick}
          />
          <div className="text-center sm:text-left mt-20">
            <p className="text-gray-400 text-base sm:text-lg mb-1">Profile</p>
            <h2 className="text-3xl sm:text-6xl font-bold mb-2">{name}</h2>
            <p className="text-gray-400 text-base sm:text-lg">Following 3</p>
          </div>
        </div>
      </div>

      <br />
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 font-semibold inline-block">
            #<span className="ml-1">Title</span>
          </span>
          <img
            src={tb}
            alt="Feature image"
            className="w-7 h-auto object-cover rounded-lg mr-10"
          />
        </div>
        <hr className="w-full border-t border-gray-600" />
        <br />
        <ul className="grid grid-cols-1 gap-4">
          {topTracks.map((track, index) => (
            <InfoClientCard key={index} {...track} />
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-left">Following</h3>
        <div className="flex flex-wrap gap-6">
          {followingArtists.map((artist, index) => (
            <InfoClientFollowingCard key={index} {...artist} />
          ))}
        </div>
      </div>

      {/* Profile editing form */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-4xl flex flex-col md:flex-row shadow-lg">
            <div className="relative flex flex-col items-center md:w-1/2 mb-4 md:mb-0">
              <img
                className="w-48 h-48 rounded-lg object-cover mb-4 border-4 border-blue-600 mt-5"
                src={profileImage}
                alt="Profile Preview"
              />
              <input
                ref={fileInputRef} // Attach the ref to the file input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                onClick={handleOverlayClick} // Trigger file input click on overlay click
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold cursor-pointer"
              >
                <span>Upload file</span>
              </div>
            </div>
            <div className="flex flex-col justify-center md:w-1/2 md:pl-6">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="bg-zinc-700 text-white p-3 rounded mb-4 border border-gray-600 focus:border-blue-500 transition-colors duration-300"
              />
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoClient;
