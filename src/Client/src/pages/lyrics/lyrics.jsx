import React, { useState } from "react";
import { MdClose } from 'react-icons/md';
import Tb from '../../../public/assets/img/CoverArt2.jpg';
import Lyricstop from '../../components/cards/lyricstop';
import LikeButton from "Client/src/components/button/favorite";
import MoreButton from "Client/src/components/button/more"; // Thêm SongMoreButton

const Lyrics = ({ onClose }) => {
    const [likedSongs, setLikedSongs] = useState([false]);

    const handleLikeToggle = (index) => {
        setLikedSongs((prevLikedSongs) => {
            const updatedLikes = [...prevLikedSongs];
            updatedLikes[index] = !updatedLikes[index];
            return updatedLikes;
        });
    };

    const handleOptionSelect = (action) => {
        console.log('Selected action:', action);
        // Xử lý các hành động theo tùy chọn được chọn từ SongMoreButton
    };

    return (
        <div className="bg-zinc-900 text-white p-4 shadow-lg max-w-full h-[900px] relative">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
                onClick={onClose}
            >
                <MdClose className="h-7 w-7 transition-transform duration-300 hover:scale-110" />
            </button>

            <div className="flex items-center mb-4 pl-52 mt-5">
                <h1 className="text-4xl font-bold mr-10">Chúng ta của hiện tại</h1>
                <span className="bg-zinc-900 border-2 border-blue-500 text-blue-500 text-xs font-bold px-2 py-1 rounded mt-2">MUSIC HEALS</span>
            </div>

            <div className="flex text-sm mb-6 space-x-10 pl-52">
                <p>Artist: <span className="font-bold">Sơn Tùng MTP</span></p>
                <p>Album: <span className="font-bold">Sky Tour</span></p>
            </div>

            <div className="flex mb-4 pl-52">
                <img src={Tb} alt="Album cover" className="w-96 h-96 rounded-lg mr-4" />
                <div className="text-lg flex flex-col justify-center space-y-7 pl-40">
                    <p className="text-gray-300">Mùa thu mang giấc mơ quay về</p>
                    <p className="text-gray-300">Vẫn nguyên vẹn như hôm nào</p>
                    <p className="text-gray-300">Lá bay theo gió xôn xao</p>
                    <p className="font-bold text-xl text-white">Chốn xưa em chờ (chốn xưa em chờ)</p>
                    <p className="text-gray-300">Đoạn đường ngày nào nơi ta từng đón đưa</p>
                    <p className="text-gray-300">Con tim vương không phai mờ</p>
                    <p className="text-gray-300">Giấu yêu thương trong vần thơ</p>
                </div>
            </div>

            <div className="flex justify-between items-center pl-52">
                <div className="flex space-x-4 items-center">
                    <LikeButton
                        likedSongs={likedSongs[0]}
                        handleLikeToggle={() => handleLikeToggle(0)}
                    />
                    <MoreButton
                        type="lyrics"
                        onOptionSelect={handleOptionSelect}
                    />
                </div>
            </div>

            <br />
            <div className="flex flex-col pl-52 mb-4">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold mt-10">Plays</div>
                    <div className="text-lg font-bold mr-[520px]">Lately</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">51,961,507</div>
                    <div>
                        <Lyricstop />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lyrics;
