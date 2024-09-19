import React, { useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { handleAddFavorite } from '../../notification'; // Kiểm tra đường dẫn

const LikeButton = ({ likedSongs, handleLikeToggle }) => {
    const [isLiked, setIsLiked] = useState(likedSongs);

    const toggleLike = (e) => {
        e.stopPropagation();
        handleLikeToggle();
        setIsLiked(!isLiked);
        if (!isLiked) {
            handleAddFavorite(); // Gọi hàm hiển thị thông báo
        }
    };

    return (
        <div>
            {isLiked ? (
                <MdFavorite
                    className="text-red-500 cursor-pointer hover:text-red-600"
                    size={24}
                    onClick={toggleLike}
                />
            ) : (
                <MdFavoriteBorder
                    className="text-white cursor-pointer hover:text-red-500"
                    size={24}
                    onClick={toggleLike}
                />
            )}
        </div>
    );
};

export default LikeButton;
