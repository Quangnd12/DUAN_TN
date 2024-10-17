import React from "react";
import { useParams, useLocation } from "react-router-dom";

const GenreInfo = () => {
    const { id } = useParams();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const name = params.get("name");

    return (
        <div className="relative w-full h-1/3 flex">
            <div className="w-full h-full artist-bg flex items-center p-8">
                <h1 className="text-[10rem] font-bold text-white ml-10 mb-14">{name}</h1>
            </div>
        </div>
    );
};

export default GenreInfo;
