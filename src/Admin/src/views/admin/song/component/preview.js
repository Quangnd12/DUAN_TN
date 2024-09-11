import React from "react";

const PreviewSong = ({ showModal, onClose, song }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-4xl relative flex justify-center items-center">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={onClose}
                >
                    <i className="fas fa-times text-lg"></i>
                </button>
                <div className="flex flex-col md:flex-row w-full">
                    {/* Modal Left Section */}
                    <div
                        className="flex flex-col w-full md:w-1/2 items-center justify-center p-6 relative bg-cover bg-center text-white rounded-2xl"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('${song.image}')`
                        }}
                    >
                        {/* Image Container */}
                        <div className="image-container w-32 h-32 overflow-hidden rounded-full border-2 border-white shadow-lg mb-4 absolute top-10 left-1/2 transform -translate-x-1/2">
                            <img
                                src={song.image}
                                alt={song.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="text-center mt-36">
                            <h3 className="text-2xl font-bold mb-2">{song.name}</h3>
                            <p className="text-lg mb-4">{song.artist}</p>
                        </div>
                    </div>

                    {/* Modal Right Section */}
                    <div className="flex flex-col w-full md:w-1/2 bg-white p-6 rounded-2xl">
                        <table className="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Album:</th>
                                    <td className="py-3">{song.album}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Release Date:</th>
                                    <td className="py-3">{song.releaseDate}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Duration:</th>
                                    <td className="py-3">{song.duration}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Category:</th>
                                    <td className="py-3">{song.category}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Popularity:</th>
                                    <td className="py-3">{song.popularity || 50}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 pr-4 text-gray-900 font-medium">Tempo:</th>
                                    <td className="py-3">{song.tempo || 120}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewSong;
