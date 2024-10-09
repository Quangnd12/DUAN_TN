import {slugify} from "../../../../components/createSlug";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../../../data/fetchSongData";

const ShowAllListRadio = () => {
    return (
        <div className="text-white bg-zinc-900 p-6 rounded-md w-full overflow-hidden">
        <div className="flex flex-col mx-auto">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold">Popular radio</h2>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
                {data.radios.map((radio) => (
                    <Link to={`/radio/${slugify(radio.name)}`} key={radio.id}>
                        <div className="flex flex-col items-start mb-6">
                            <img
                                src={radio.image}
                                alt={radio.name}
                                className="w-[170px] h-[170px] object-cover rounded-lg"
                            />
                            <div className="mt-2 text-left">
                                <p className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{radio.name}</p>
                                <p className="text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis w-[170px]">{radio.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
    );
};

export default ShowAllListRadio;
