import React from "react";
import { useTheme } from "../../views/admin/ThemeContext";

const translations = {
  vi: {
    monthlyRevenue: {
      title: "Doanh Thu Theo Tháng",
      icon: "fas fa-chart-line"
    },
    yearlyRevenue: {
      title: "Doanh Thu Theo Năm",
      icon: "fas fa-chart-bar"
    }
  },
  en: {
    monthlyRevenue: {
      title: "Monthly Revenue",
      icon: "fas fa-chart-line"
    },
    yearlyRevenue: {
      title: "Yearly Revenue",
      icon: "fas fa-chart-bar"
    }
  }
};

function Statisticas({ chartType, handleChartTypeChange }) {
  const { language } = useTheme();
  const t = translations[language];

  return (
    <div className="flex flex-wrap justify-center md:justify-end space-x-2">
      <button
        onClick={() => handleChartTypeChange("monthlyRevenue")}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          chartType === "monthlyRevenue"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 hover:bg-blue-100"
        }`}
      >
        <i className={`${t.monthlyRevenue.icon} mr-2`} />
        {t.monthlyRevenue.title}
      </button>
      <button
        onClick={() => handleChartTypeChange("yearlyRevenue")}
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          chartType === "yearlyRevenue"
            ? "bg-green-500 text-white"
            : "bg-gray-100 hover:bg-green-100"
        }`}
      >
        <i className={`${t.yearlyRevenue.icon} mr-2`} />
        {t.yearlyRevenue.title}
      </button>
    </div>
  );
}

export default Statisticas;
