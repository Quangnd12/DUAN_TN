import React from "react";
import CircleCard from "../cards/CircleCard";
import RoundCard from "../cards/RoundCard";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // Import icon

const Rowlib = ({ title, data }) => {
    return (
        <div className="flex flex-col p-4 bg-zinc-900">
            <div className="flex justify-between">
            <h1 className="text-5xl font-bold mb-8 text-center">Thư Viện</h1>
            </div>

            <div className="flex items-center space-x-4 overflow-x-auto">
                {/* Vòng lặp hiển thị các hình tròn */}
                {data.map(item => (
                    item.title === "Artist" ? (
                        <CircleCard
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            title={item.title}
                        />
                    ) : (
                        <RoundCard
                            key={item.id}
                            image={item.image}
                            name={item.name}
                            title={item.title}
                        />
                    )
                ))}

                {/* Icon và "Xem tất cả" */}
                <Link
                    to={"/artist"}
                    className="flex flex-col items-center shrink-0 w-24 h-24 text-center"
                >
                    <div className="flex justify-center items-center w-12 h-12 rounded-full bg-gray-800">
                        <FaArrowRight className="text-white" />
                    </div>
                    <p className="text-white text-sm mt-2">Xem tất cả</p>
                </Link>
            </div>
        </div>
    );
};

export default Rowlib;
