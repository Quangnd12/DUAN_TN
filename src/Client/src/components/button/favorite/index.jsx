import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { handleAddFavorite } from '../../notification';
import { useToggleFavoriteMutation, useCheckFavoriteStatusQuery } from '../../../../../redux/slice/favoriets';

const LikeButton = ({ songId }) => {
    const { user } = useSelector((state) => state.auth);
    
    const { data: isFavorite, refetch } = useCheckFavoriteStatusQuery(
        songId,
        {
            skip: !songId || !user?.id,
            refetchOnMountOrArgChange: true
        }
    );

    const [toggleFavorite] = useToggleFavoriteMutation();

    useEffect(() => {
        if (user?.id && songId) {
            refetch();
        }
    }, [user?.id, songId, refetch]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!songId || !user?.id) return;
        
        try {
            const result = await toggleFavorite(songId).unwrap();
            if (result.success && !isFavorite) {
                handleAddFavorite();
            }
            refetch();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (!songId || !user?.id) return null;

    return (
        <div>
            {isFavorite ? (
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