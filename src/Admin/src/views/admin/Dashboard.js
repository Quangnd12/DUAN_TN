import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "./ThemeContext";

// Các components 
import StatCard from "../../components/StatCard/StatCard";
import TopFansCard from "../../components/TopFansCard/TopFansCard";
import PieChartCard from "../../components/PieChartCard/PieChartCard";
import ChartSwitcher from "../../components/ChartSwitcher/ChartSwitcher";

const translations = {
  vi: {
    dashboard: "Bảng Điều Khiển",
    downloadCurrent: "Tải Dữ Liệu Hiện Tại (CSV)",
    downloadAll: "Tải Tất Cả Dữ Liệu (CSV)",
  
    stats: {
      listeners: "Người Nghe",
      newFollowers: "Người Theo Dõi Mới",
      unfollows: "Bỏ Theo Dõi",
      newStreams: "Lượt Phát Mới",
      addedToPlaylist: "Thêm Vào Playlist",
      streamTotalHours: "Tổng Giờ Phát",
      topFans: "Người Hâm Mộ Hàng Đầu"
    },
    charts: {
      newListenersByMonth: "Người Nghe Mới Theo Tháng",
      men: "Nam",
      women: "Nữ",
      avgListeningTime: "Thời Gian Nghe Trung Bình",
      hours: "Giờ",
      popularGenres: "Thể Loại Phổ Biến",
      topArtists: "Nghệ Sĩ Hàng Đầu",
      count: "Số Lượng"
    }
  },
  en: {
    dashboard: "Dashboard",
    downloadCurrent: "Download Current Data as CSV",
    downloadAll: "Download All Data as CSV",
    stats: {
      listeners: "Listeners",
      newFollowers: "New Followers",
      unfollows: "Unfollows",
      newStreams: "New Streams",
      addedToPlaylist: "Added to Playlist",
      streamTotalHours: "Stream Total Hours",
      topFans: "Top Fans"
    },
    charts: {
      newListenersByMonth: "New Listeners by Month",
      men: "Men",
      women: "Women",
      avgListeningTime: "Average Listening Time",
      hours: "Hours",
      popularGenres: "Popular Genres",
      topArtists: "Top Artists",
      count: "Count"
    }
  }
};



export default function Dashboard() {
  const { language } = useTheme();
  const t = translations[language];
  // State để lưu dữ liệu hiện tại của biểu đồ
  const [chartType, setChartType] = useState("newListeners");

  // Dữ liệu cho các biểu đồ khác nhau
  const newListenersData = [
    { month: "Jan", Men: 10, Women: 5 },
    { month: "Feb", Men: 15, Women: 10 },
    { month: "Mar", Men: 20, Women: 15 },
    { month: "Apr", Men: 25, Women: 20 },
    { month: "May", Men: 15, Women: 25 },
    { month: "Jun", Men: 20, Women: 30 },
    { month: "Jul", Men: 25, Women: 25 },
    { month: "Aug", Men: 30, Women: 20 },
    { month: "Sep", Men: 35, Women: 15 },
    { month: "Oct", Men: 30, Women: 20 },
    { month: "Nov", Men: 25, Women: 25 },
    { month: "Dec", Men: 20, Women: 30 },
  ];

  const avgListeningTimeData = [
    { month: "Jan", hours: 2.3 },
    { month: "Feb", hours: 2.8 },
    { month: "Mar", hours: 3.2 },
    { month: "Apr", hours: 3.5 },
    { month: "May", hours: 2.7 },
    { month: "Jun", hours: 3.1 },
    { month: "Jul", hours: 3.6 },
    { month: "Aug", hours: 3.9 },
    { month: "Sep", hours: 3.3 },
    { month: "Oct", hours: 2.8 },
    { month: "Nov", hours: 2.9 },
    { month: "Dec", hours: 3.2 },
  ];

  const popularGenresData = [
    { genre: "Pop", count: 45 },
    { genre: "Rock", count: 30 },
    { genre: "Hip-Hop", count: 20 },
    { genre: "Jazz", count: 10 },
    { genre: "Classical", count: 5 },
  ];

  const topArtistsData = [
    { artist: "Artist A", count: 50 },
    { artist: "Artist B", count: 45 },
    { artist: "Artist C", count: 40 },
    { artist: "Artist D", count: 30 },
    { artist: "Artist E", count: 20 },
  ];

  const streamData = [
    { name: "Spain", value: 20 },
    { name: "United Kingdom", value: 20 },
    { name: "EE.UU", value: 15 },
    { name: "Italy", value: 7 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const downloadCSV = (downloadAll = false) => {
    let data = [];

    if (downloadAll) {
      // Gộp tất cả dữ liệu lại
      data = [
        ...newListenersData.map((row) => ({
          ...row,
          category: "New Listeners",
        })),
        ...avgListeningTimeData.map((row) => ({
          ...row,
          category: "Avg Listening Time",
        })),
        ...popularGenresData.map((row) => ({
          ...row,
          category: "Popular Genres",
        })),
        ...topArtistsData.map((row) => ({ ...row, category: "Top Artists" })),
      ];
    } else {
      // Chỉ tải dữ liệu của biểu đồ hiện tại
      if (chartType === "newListeners") {
        data = newListenersData;
      } else if (chartType === "avgListeningTime") {
        data = avgListeningTimeData;
      } else if (chartType === "popularGenres") {
        data = popularGenresData;
      } else if (chartType === "topArtists") {
        data = topArtistsData;
      }
    }

    // Chuyển đổi dữ liệu thành CSV
    const csvData = [
      Object.keys(data[0]).join(","), // header
      ...data.map((row) => Object.values(row).join(",")), // rows
    ].join("\n");

    // Tạo một link tải về
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadAll ? `all_data.csv` : `${chartType}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-0">{t.dashboard}</h1>
      <div className="flex space-x-2">
        <button
          className="px-3 py-2 bg-gray-200 rounded"
          onClick={() => downloadCSV()}
        >
          {t.downloadCurrent}
        </button>
        <button
          className="px-3 py-2 bg-green-500 text-white rounded"
          onClick={() => downloadCSV(true)}
        >
          {t.downloadAll}
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={<i className="fas fa-users"></i>} 
        value="62" 
        label={t.stats.listeners} 
        color="bg-purple-100" 
      />
      <StatCard 
        icon={<i className="fas fa-chart-line"></i>} 
        value="23" 
        label={t.stats.newFollowers} 
        color="bg-blue-100" 
      />
      <StatCard 
        icon={<i className="fas fa-exclamation-triangle"></i>} 
        value="3" 
        label={t.stats.unfollows} 
        color="bg-red-100" 
      />
      <StatCard 
        icon={<i className="fas fa-music"></i>} 
        value="83%" 
        label={t.stats.newStreams} 
        color="bg-green-100" 
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={<i className="fas fa-heart"></i>} 
        value="25" 
        label={t.stats.addedToPlaylist} 
        color="bg-yellow-100" 
      />
      <StatCard 
        icon={<i className="fas fa-clock"></i>} 
        value="1396" 
        label={t.stats.streamTotalHours} 
        color="bg-indigo-100" 
      />
      <TopFansCard title={t.stats.topFans} />
      <PieChartCard data={streamData} colors={COLORS} />
    </div>

    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-lg font-semibold">{t.charts.newListenersByMonth}</h2>
        <ChartSwitcher chartType={chartType} handleChartTypeChange={handleChartTypeChange} />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "newListeners" && (
            <BarChart data={newListenersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={t.charts.men} fill="#8884d8" />
              <Bar dataKey={t.charts.women} fill="#82ca9d" />
            </BarChart>
          )}
          {chartType === "avgListeningTime" && (
            <BarChart data={avgListeningTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#8884d8" />
            </BarChart>
          )}
          {chartType === "popularGenres" && (
            <BarChart data={popularGenresData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
          {chartType === "topArtists" && (
            <BarChart data={topArtistsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="artist" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  );
}
