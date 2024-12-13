import request from "../config";
import { store } from '../redux/store';
import { addNotification } from '../redux/slice/notificationSlice';

const dispatchNotification = (message, type = 'default') => {
  store.dispatch(addNotification({ message, type }));
};

const getSongs = async (page, limit, searchName, genres, minDuration, maxDuration, minListensCount,maxListensCount) => {
  let path = '/api/songs';

  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  if (genres && genres.length > 0) {
    query.push(`genres=${JSON.stringify(genres)}`);
  }

  if (searchName) {
    query.push(`searchName=${encodeURIComponent(searchName)}`);
  }

  if (minDuration) {
    query.push(`minDuration=${minDuration}`);
  }

  if (maxDuration) {
    query.push(`maxDuration=${maxDuration}`);
  }

  if (minListensCount) {
    query.push(`minListensCount=${minListensCount}`);
  }
  if (maxListensCount) {
    query.push(`maxListensCount=${maxListensCount}`);
  }
  if (query.length > 0) {
    path += `?${query.join('&')}`;
  }

  try {
    const res = await request({
      method: "GET",
      path: path,
    });
    return res;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return { error: 'Failed to fetch songs' };
  }
};



const getSongById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/songs/${id}`,
  });
  return res;
};

const addSong = async (song) => {
  try {
    const res = await request({
      method: "POST",
      path: "/api/songs",
      data: song,
    });
    dispatchNotification('Song added successfully', 'success');
    return res;
  } catch (error) {
    dispatchNotification('Failed to add song', 'error');
    throw error;
  }
};

const deleteSong = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/songs/${id}`,
    });
    dispatchNotification('Song deleted successfully', 'success');
    return res;
  } catch (error) {
    dispatchNotification('Failed to delete song', 'error');
    throw error;
  }
};

const updateSong = async (id, song) => {
  try {
    const res = await request({
      method: "PUT",
      path: `/api/songs/${id}`,
      data: song,
    });
    dispatchNotification('Song updated successfully', 'success');
    return res;
  } catch (error) {
    dispatchNotification('Failed to update song', 'error');
    throw error;
  }
};
const updatePlayCount = async (id, song) => {
  try {
    const res = await request({
      method: "PUT",
      path: `/api/songs/playcount/${id}`,
      data: song,
    });
    dispatchNotification('Song updated successfully', 'success');
    return res;
  } catch (error) {
    dispatchNotification('Failed to update song', 'error');
    throw error;
  }
};

const getSongStats = async () => {
  try {
    const res = await request({
      method: "GET",
      path: "/api/songs",
      params: {
        limit: 50 // Lấy nhiều bài hát để có thống kê chính xác
      }
    });

    // Tính toán thống kê từ danh sách bài hát
    const stats = {
      // Thống kê theo nghệ sĩ
      artists: {},
      // Thống kê theo thể loại
      genres: {},
      // Tổng số lượt nghe
      totalListens: 0
    };

    res.songs.forEach(song => {
      // Đếm số bài hát theo nghệ sĩ
      if (!stats.artists[song.artist]) {
        stats.artists[song.artist] = {
          count: 0,
          listens: 0
        };
      }
      stats.artists[song.artist].count++;
      stats.artists[song.artist].listens += song.listens_count || 0;

      // Đếm số bài hát theo thể loại
      if (!stats.genres[song.genre]) {
        stats.genres[song.genre] = {
          count: 0,
          listens: 0
        };
      }
      stats.genres[song.genre].count++;
      stats.genres[song.genre].listens += song.listens_count || 0;

      // Tổng số lượt nghe
      stats.totalListens += song.listens_count || 0;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching song stats:', error);
    return null;
  }
};

export { getSongs, getSongById, addSong, deleteSong, updateSong, updatePlayCount, getSongStats };
