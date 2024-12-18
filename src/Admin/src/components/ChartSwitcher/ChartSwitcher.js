import React from "react";
import { useTheme } from "../../views/admin/ThemeContext";

// Export translations
export const translations = {
  vi: {
    popularGenres: {
      title: "Lượt nghe theo tháng",
      icon: "fas fa-music",
      months: {
        "January": "Tháng 1",
        "February": "Tháng 2", 
        "March": "Tháng 3",
        "April": "Tháng 4",
        "May": "Tháng 5",
        "June": "Tháng 6",
        "July": "Tháng 7",
        "August": "Tháng 8",
        "September": "Tháng 9", 
        "October": "Tháng 10",
        "November": "Tháng 11",
        "December": "Tháng 12"
      }
    },
    topArtists: {
      title: "Nghệ sĩ có album",
      icon: "fas fa-compact-disc"
    }
  },
  en: {
    popularGenres: {
      title: "Number of listeners by month",
      icon: "fas fa-music",
      months: {
        "January": "January",
        "February": "February",
        "March": "March", 
        "April": "April",
        "May": "May",
        "June": "June",
        "July": "July",
        "August": "August",
        "September": "September",
        "October": "October",
        "November": "November",
        "December": "December"
      }
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
