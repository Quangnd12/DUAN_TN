import React, { useState, useEffect } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { handleAddFavorite } from '../../notification';
import { useToggleFavoriteMutation, useCheckFavoriteStatusQuery } from '../../../../../redux/slice/favoriets';

const LikeButton = ({ songId }) => {
    const [isLiked, setIsLiked] = useState(() => {
        const savedStatus = localStorage.getItem(`favorite-${songId}`);
        return savedStatus ? JSON.parse(savedStatus) : false;
    });
    const [toggleFavorite] = useToggleFavoriteMutation();
    
    const { data: favoriteStatus, isSuccess } = useCheckFavoriteStatusQuery(songId, {
        skip: !songId
    });

    useEffect(() => {
        if (isSuccess && favoriteStatus !== undefined) {
            setIsLiked(favoriteStatus);
            localStorage.setItem(`favorite-${songId}`, JSON.stringify(favoriteStatus));
        }
    }, [favoriteStatus, isSuccess, songId]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!songId) return;
        
        try {
            const result = await toggleFavorite(songId).unwrap();
            if (result.success) {
                const newStatus = !isLiked;
                setIsLiked(newStatus);
                localStorage.setItem(`favorite-${songId}`, JSON.stringify(newStatus));
                if (newStatus) {
                    handleAddFavorite();
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (!songId) return null;

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