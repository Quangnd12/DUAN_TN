import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaMusic } from 'react-icons/fa';
import '../../../src/assets/css/report/report.css';
import { useLocation } from 'react-router-dom';
import { useCreateOrUpdateRatingMutation, useGetUserRatingQuery } from '../../../../redux/slice/ratingSlice';

const Report = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const songId = searchParams.get('songId');

  // Lấy thông tin bài hát từ localStorage
  const songs = JSON.parse(localStorage.getItem("songs") || "[]");
  const currentSong = songs.find(song => song.songID === parseInt(songId) || song.id === parseInt(songId));

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  
  const [createOrUpdateRating] = useCreateOrUpdateRatingMutation();
  const { data: existingRating } = useGetUserRatingQuery(songId);

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
    }
  }, [existingRating]);

  const ratingLabels = {
    0.5: "Not good at all 😞",
    1: "Not my style 😕",
    1.5: "Could be better 🤔",
    2: "It's okay 🙂",
    2.5: "Getting better 😊",
    3: "Pretty good 😊",
    3.5: "Really nice! 😃",
    4: "Love it! 😍",
    4.5: "Amazing! 🤩",
    5: "Masterpiece! 🌟"
  };

  const handleRating = (value) => {
    // Kiểm tra xem có đang click vào nửa sao không
    const isHalfStar = value % 1 !== 0;
    setRating(value);
  };

  // Component cho một ngôi sao (có thể là nửa sao)
  const Star = ({ value, filled, half }) => {
    if (filled) {
      return <FaStar className="text-yellow-400" size={64} />;
    }
    if (half) {
      return <FaStarHalfAlt className="text-yellow-400" size={64} />;
    }
    return <FaRegStar className="text-zinc-600" size={64} />;
  };

  // Render phần rating stars
  const renderStars = () => {
    return (
      <div className="flex justify-center space-x-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {/* Vùng click cho nửa sao đầu */}
            <div
              className="absolute w-1/2 h-full cursor-pointer z-10"
              onMouseEnter={() => setHover(star - 0.5)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(star - 0.5)}
            />
            {/* Vùng click cho sao đầy đủ */}
            <div
              className="absolute w-1/2 h-full cursor-pointer z-10 right-0"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRating(star)}
            />
            <Star
              value={star}
              filled={hover || rating >= star}
              half={hover || rating === star - 0.5}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      await createOrUpdateRating({
        songId: songId,
        rating: rating
      });
      setShowThankYouModal(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-6">
      <div className="w-full max-w-5xl bg-zinc-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-12 transform transition-all duration-300 hover:shadow-blue-500/10">
        {/* Song Info Section */}
        <div className="flex items-center justify-between mb-12 p-6 bg-zinc-700/30 rounded-xl">
          <div className="flex items-center flex-1">
            <div className="w-32 h-32 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={currentSong?.songImage || currentSong?.image} 
                alt={currentSong?.songTitle || currentSong?.title}
                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="ml-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                {currentSong?.songTitle || currentSong?.title}
              </h3>
              <p className="text-xl text-blue-400">
                {currentSong?.name || currentSong?.artist}
              </p>
              <p className="text-zinc-400 mt-2">
                {currentSong?.album || "Single"} • {new Date().getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              Duration: {currentSong?.duration || "0:00"}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="text-zinc-400">
              Genre: {currentSong?.genre || "Pop"}
            </span>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          How would you rate this song?
        </h2>

        {/* Rating Stars Section */}
        <div className="mb-12">
          {renderStars()}
          {rating > 0 && (
            <div className="text-center mt-8 animate-fadeIn">
              <p className="text-3xl text-yellow-400 font-bold mb-2">
                {ratingLabels[rating]}
              </p>
              <p className="text-zinc-400 text-xl">
                {rating} out of 5 stars
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            className={`px-12 py-4 rounded-xl shadow-lg transition-all duration-300 transform 
              ${rating > 0 
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 hover:scale-105 hover:shadow-blue-500/50' 
                : 'bg-zinc-600 cursor-not-allowed'} 
              text-white font-bold text-xl`}
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit Rating
          </button>
        </div>
      </div>

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-zinc-800/90 p-12 rounded-2xl shadow-2xl text-center transform transition-all duration-500 animate-modal">
            <div className="mb-8">
              <div className="success-checkmark">
                <FaMusic className="text-7xl text-blue-400 animate-bounce" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-blue-400 text-xl">Your rating has been submitted successfully</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;