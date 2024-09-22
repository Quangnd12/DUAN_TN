import React, { useState, useCallback } from 'react';
import { MdUpload } from "react-icons/md";
import { handleCopyLinkSong } from '../../notification'; // Kiểm tra đường dẫn

const CopyLink = ({ copyLink, handleCopyLink }) => {
    const [isCopy, setIsCopy] = useState(copyLink);

    const toggleCopy = useCallback((e) => {
        e.stopPropagation();
        try {
            const staticLink = 'https://open.musicheals.com/track/76hNavaqq3FrUE1zaE41Wn?si=8234ceb8ac09467d';
            navigator.clipboard.writeText(staticLink).then(() => {
                handleCopyLink();
                handleCopyLinkSong(); // Gọi hàm hiển thị thông báo
                setIsCopy(prevState => !prevState);
            }).catch((error) => {
                console.error('Error copying link:', error);
            });
        } catch (error) {
            console.error('Error copying link:', error);
        }
    }, [handleCopyLink]);

    return (
        <div>
            <MdUpload
                className={`cursor-pointer ${isCopy} hover:text-sky-600`}
                size={24}
                onClick={toggleCopy}
            />
        </div>
    );
};

export default CopyLink;
