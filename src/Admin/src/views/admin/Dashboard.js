import React, { useState, useEffect } from "react";
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
import PieChartCard from "../../components/PieChartCard/PieChartCard";
import ChartSwitcher from "../../components/ChartSwitcher/ChartSwitcher";

// Import thêm hook để lấy dữ liệu users
import { useGetUsersQuery } from "../../../../redux/slice/apiSlice";
import { useGetAllEventsQuery } from "../../../../redux/slice/eventSlice";
import { getSongs, getSongStats } from "../../../../services/songs";

const translations = {
  vi: {
    dashboard: "Bảng Điều Khiển",
    downloadCurrent: "Tải Dữ Liệu Hiện Tại (CSV)",
    downloadAll: "Tải Tất Cả Dữ Liệu (CSV)",
    stats: {
      listeners: "Người Nghe",
      upcomingEvent: "Sự kiện sắp diễn ra",
      artists: "Nghệ sĩ",
      newStreams: "Lượt Phát Mới",
      addedToPlaylist: "Thêm Vào Playlist",
      streamTotalHours: "Tổng Giờ Phát",
      topFans: "Người Hâm Mộ Hàng Đầu",
    },
    charts: {
      popularGenres: "Thể loại được yêu thích",
      topArtists: "Nghệ sĩ có album",
      songCount: "Số bài hát",
      listenCount: "Lượt nghe",
      albumCount: "Số album"
    }
  },
  en: {
    dashboard: "Dashboard",
    downloadCurrent: "Download Current Data (CSV)",
    downloadAll: "Download All Data (CSV)",
    stats: {
      listeners: "Listeners",
      upcomingEvent: "Upcoming Events",
      artists: "Artists",
      newStreams: "New Streams",
      addedToPlaylist: "Added to Playlist",
      streamTotalHours: "Total Streaming Hours",
      topFans: "Top Fans",
    },
    charts: {
      popularGenres: "Popular Genres",
      topArtists: "Artists with Albums",
      songCount: "Songs",
      listenCount: "Listens",
      albumCount: "Albums"
    }
  }
};

export default function Dashboard() {
  const { language } = useTheme();
  const t = translations[language];
  // State để lưu dữ liệu hiện tại của biểu đồ
  const [chartType, setChartType] = useState("popularGenres");

  const [songStats, setSongStats] = useState(null);
  const [isLoadingSongStats, setIsLoadingSongStats] = useState(true);

  // Query để lấy users và lọc top 5 users có role 'user'
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery({ 
    page: 1,
    limit: 10
  });

  // Xử lý dữ liệu users
  const getTopUsers = () => {
    if (!usersData?.users) return [];
    
    return usersData.users
      .filter(user => user.role === 'user')
      .map(user => ({
        username: user.username || user.email,
        role: user.role,
        lastActive: new Date(user.lastLogin || user.createdAt).toLocaleDateString('vi-VN')
      }))
      .slice(0, 5);
  };

  // Query để lấy events sắp diễn ra
  const { data: eventsData, isLoading: isLoadingEvents } = useGetAllEventsQuery({
    status: "upcoming",
    limit: 5
  });

  // Xử lý dữ liệu events
  const getUpcomingEvents = () => {
    if (!eventsData?.events) return [];
    
    return eventsData.events
      .map(event => ({
        name: event.name,
        status: event.status,
        startTime: event.startTime,
        artist: event.artist
      }))
      .slice(0, 2); // Chỉ lấy 2 sự kiện để gọn gàng hơn
  };

  // Xử lý dữ liệu artists từ songs (giữ nguyên code cũ)
  const getTopArtists = () => {
    if (!songStats?.artists) return [];
    
    return Object.entries(songStats.artists)
      .map(([name, data]) => ({
        name,
        count: data.count,
        listens: data.listens
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const COLORS = [
    "#1E90FF",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#1E90FF",
  ];

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const downloadCSV = (downloadAll = false) => {
    let data = [];

    if (downloadAll) {
      // Gộp tất cả dữ liệu thống kê
      data = [
        ...genreStats.map((row) => ({
          category: "Thể loại",
          name: row.genre,
          songCount: row.count,
          listensCount: row.listens
        })),
        ...artistAlbumStats.map((row) => ({
          category: "Nghệ sĩ",
          name: row.artist,
          albumCount: row.albums,
          songCount: row.songs
        }))
      ];
    } else {
      // Chỉ tải dữ liệu của biểu đồ hiện tại
      if (chartType === "popularGenres") {
        data = genreStats.map((row) => ({
          genre: row.genre,
          songCount: row.count,
          listensCount: row.listens
        }));
      } else if (chartType === "topArtists") {
        data = artistAlbumStats.map((row) => ({
          artist: row.artist,
          albumCount: row.albums,
          songCount: row.songs
        }));
      }
    }

    if (data.length === 0) {
      alert('Không có dữ liệu để tải xuống!');
      return;
    }

    try {
      // Chuyển đổi dữ liệu thành CSV
      const headers = Object.keys(data[0]);
      const csvData = [
        headers.join(','), // header row
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Xử lý các giá trị đặc biệt (nếu có dấu phẩy hoặc xuống dòng)
            if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
              return `"${value}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Tạo và tải file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.setAttribute('download', downloadAll 
        ? `music-stats-all-${timestamp}.csv` 
        : `music-stats-${chartType}-${timestamp}.csv
`      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Có lỗi xảy ra khi tải xuống file!');
    }
  };

  // Thêm useEffect để fetch song stats
  useEffect(() => {
    const fetchSongStats = async () => {
      try {
        const stats = await getSongStats();
        setSongStats(stats);
      } catch (error) {
        console.error("Error fetching song stats:", error);
      } finally {
        setIsLoadingSongStats(false);
      }
    };

    fetchSongStats();
  }, []);

  // Format dữ liệu cho PieChart từ songStats
  const formatGenreData = () => {
    if (!songStats?.genres) return [];
    return Object.entries(songStats.genres).map(([name, data]) => ({
      name,
      value: data.count,
    }));
  };

  // Thêm state để lưu trữ dữ liệu thống kê
  const [genreStats, setGenreStats] = useState([]);
  const [artistAlbumStats, setArtistAlbumStats] = useState([]);

  // Cập nhật useEffect để xử lý dữ liệu từ API songs
  useEffect(() => {
    const fetchSongStats = async () => {
      try {
        const response = await getSongs(1, 15); // Lấy tất cả bài hát

        // Xử lý thống kê thể loại
        const genresMap = new Map();
        response.songs.forEach((song) => {
          const genre = song.genre;
          const currentCount = genresMap.get(genre) || {
            genre,
            count: 0,
            listens: 0,
          };
          currentCount.count++;
          currentCount.listens += song.listens_count || 0;
          genresMap.set(genre, currentCount);
        });

        // Chuyển đổi Map thành mảng và sắp xếp theo lượt nghe
        const genreData = Array.from(genresMap.values()).sort(
          (a, b) => b.listens - a.listens
        );
        setGenreStats(genreData);

        // Xử lý thống kê nghệ sĩ có album
        const artistsMap = new Map();
        response.songs.forEach((song) => {
          if (song.album && song.albumID) {
            // Chỉ tính những bài hát có album
            const artist = song.artist;
            const currentCount = artistsMap.get(artist) || {
              artist,
              albumCount: new Set(),
              songCount: 0,
            };
            currentCount.albumCount.add(song.albumID);
            currentCount.songCount++;
            artistsMap.set(artist, currentCount);
          }
        });

        // Chuyển đổi Map thành mảng và format dữ liệu
        const artistData = Array.from(artistsMap.values())
          .map((item) => ({
            artist: item.artist,
            albums: item.albumCount.size,
            songs: item.songCount,
          }))
          .sort((a, b) => b.albums - a.albums);
        setArtistAlbumStats(artistData);
      } catch (error) {
        console.error("Error fetching song stats:", error);
      }
    };

    fetchSongStats();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<i className="fas fa-users"></i>}
          label={t.stats.listeners}
          color="bg-purple-100"
          topUsers={getTopUsers()}
        />
        <StatCard
          icon={<i className="fas fa-calendar-alt"></i>}
          value={isLoadingEvents ? "..." : eventsData?.total || 0}
          label={t.stats.upcomingEvent}
          color="bg-blue-100"
          upcomingEvents={getUpcomingEvents()}
          language={language}
        />
        <StatCard
          icon={<i className="fas fa-microphone"></i>}
          value={isLoadingSongStats ? "..." : Object.keys(songStats?.artists || {}).length}
          label={t.stats.artists}
          color="bg-red-100"
          topArtists={isLoadingSongStats ? [] : getTopArtists()}
        />
        <PieChartCard
          title="Genre Distribution"
          data={isLoadingSongStats ? [] : formatGenreData()}
          colors={COLORS}
          loading={isLoadingSongStats}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <h2 className="text-lg font-semibold">
            {chartType === "popularGenres" ? t.charts.popularGenres : t.charts.topArtists}
          </h2>
          <ChartSwitcher
            chartType={chartType}
            handleChartTypeChange={handleChartTypeChange}
          />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "popularGenres" && (
              <BarChart data={genreStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="genre" />
                <YAxis />
                <Tooltip />
                <Bar name={t.charts.songCount} dataKey="count" fill="#8884d8" />
                <Bar name={t.charts.listenCount} dataKey="listens" fill="#82ca9d" />
              </BarChart>
            )}
            {chartType === "topArtists" && (
              <BarChart data={artistAlbumStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="artist" />
                <YAxis />
                <Tooltip />
                <Bar name={t.charts.albumCount} dataKey="albums" fill="#8884d8" />
                <Bar name={t.charts.songCount} dataKey="songs" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
