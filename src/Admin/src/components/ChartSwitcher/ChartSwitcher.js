import React from "react";

function ChartSwitcher({ chartType, handleChartTypeChange }) {
  return (
    <div className="flex flex-wrap justify-center md:justify-end space-x-2">
      <button
        onClick={() => handleChartTypeChange("newListeners")}
        className="flex items-center px-2 py-2 sm:px-2 bg-blue-500 hover:bg-blue-700 text-white rounded border"
      >
        <i className="fa fa-users mr-2" />
        Total new listeners by month
      </button>
      <button
        onClick={() => handleChartTypeChange("avgListeningTime")}
        className="flex items-center px-2 py-2 bg-green-500 hover:bg-green-700 text-white rounded border"
      >
        <i className="fa fa-clock-o mr-2" />
        Average daily listening time
      </button>
      <button
        onClick={() => handleChartTypeChange("popularGenres")}
        className="flex items-center px-2 py-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded border"
      >
        <i className="fa fa-music mr-2" />
        Popular music genres
      </button>
      <button
        onClick={() => handleChartTypeChange("topArtists")}
        className="flex items-center px-2 py-2 bg-red-500 hover:bg-red-700 text-white rounded border"
      >
        <i className="fa fa-star mr-2" />
        Top most listened artists
      </button>
    </div>
  );
}

export default ChartSwitcher;
