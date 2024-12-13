import React from "react";
import { useTheme } from "../../views/admin/ThemeContext";

// Thêm translations cho ChartSwitcher
const translations = {
  vi: {
    popularGenres: {
      title: "Thể loại yêu thích",
      icon: "fas fa-music"
    },
    topArtists: {
      title: "Nghệ sĩ có album",
      icon: "fas fa-compact-disc"
    }
  },
  en: {
    popularGenres: {
      title: "Popular Genres",
      icon: "fas fa-music"
    },
    topArtists: {
      title: "Artists with Albums",
      icon: "fas fa-compact-disc"
    }
  }
};

function ChartSwitcher({ chartType, handleChartTypeChange }) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <div className="flex flex-wrap justify-center md:justify-end space-x-2">
      <button
        onClick={() => handleChartTypeChange("popularGenres")}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          chartType === "popularGenres"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-blue-100"
        }`}
      >
        <i className={`${t.popularGenres.icon} mr-2`} />
        {t.popularGenres.title}
      </button>
      <button
        onClick={() => handleChartTypeChange("topArtists")}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          chartType === "topArtists"
            ? "bg-green-500 text-white"
            : "bg-gray-100 hover:bg-green-100"
        }`}
      >
        <i className={`${t.topArtists.icon} mr-2`} />
        {t.topArtists.title}
      </button>
    </div>
  );
}

export default ChartSwitcher;
