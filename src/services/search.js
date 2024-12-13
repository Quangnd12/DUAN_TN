import request from "../config";
import { store } from '../redux/store';
import { addNotification } from '../redux/slice/notificationSlice';

const dispatchNotification = (message, type = 'default') => {
  store.dispatch(addNotification({ message, type }));
};

// Tìm kiếm tổng hợp
const searchAll = async (query) => {
  try {
    const res = await request({
      method: "GET",
      path: `/api/search?query=${encodeURIComponent(query)}`,
    });

    // Kiểm tra và format dữ liệu khi API call thành công
    if (res.success && res.data) {
      const songs = res.data.songs?.items || [];
      const artists = res.data.artists?.items || [];
      const albums = res.data.albums?.items || [];

      const formattedResults = {
        // Lấy bài hát đầu tiên làm top result nếu có
        topResults: songs[0] ? {
          title: songs[0].title,
          image: songs[0].image,
          artists: songs[0].artists,
          duration: songs[0].duration,
          id: songs[0].id
        } : null,
        // Format lại danh sách bài hát
        songs: songs.map(song => ({
          id: song.id,
          title: song.title,
          image: song.image,
          duration: song.duration,
          artists: song.artists,
          file_song: song.file_song,
          listens_count: song.listens_count
        })),
        // Format lại danh sách nghệ sĩ
        artists: artists.map(artist => ({
          id: artist.id,
          name: artist.name,
          image: artist.avatar,
          totalSongs: artist.totalSongs,
          totalAlbums: artist.totalAlbums,
          totalFollowers: artist.totalFollowers
        })),
        // Thêm thông tin albums nếu có
        albums: albums || [],
        // Giữ lại data gốc
        data: res.data,
        success: true
      };
      return formattedResults;
    }
    
    // Trả về response gốc nếu không thành công
    return res;
  } catch (error) {
    console.error('Error searching:', error);
    dispatchNotification('Không thể tìm kiếm', 'error');
    return { 
      success: false,
      error: 'Không thể tìm kiếm',
      data: {
        songs: { items: [] },
        artists: { items: [] },
        albums: { items: [] }
      }
    };
  }
};

// Tìm kiếm theo bài hát
const searchSongs = async (query) => {
  try {
    const res = await request({
      method: "GET",
      path: `/api/search/songs?query=${encodeURIComponent(query)}`,
    });
    return res;
  } catch (error) {
    console.error('Error searching songs:', error);
    dispatchNotification('Không thể tìm kiếm bài hát', 'error');
    return { error: 'Không thể tìm kiếm bài hát' };
  }
};

// Tìm kiếm theo album
const searchAlbums = async (query) => {
  try {
    const res = await request({
      method: "GET",
      path: `/api/search/albums?query=${encodeURIComponent(query)}`,
    });
    return res;
  } catch (error) {
    console.error('Error searching albums:', error);
    dispatchNotification('Không thể tìm kiếm album', 'error');
    return { error: 'Không thể tìm kiếm album' };
  }
};

// Tìm kiếm theo thể loại
const searchGenres = async (query) => {
  try {
    const res = await request({
      method: "GET",
      path: `/api/search/genres?query=${encodeURIComponent(query)}`,
    });
    return res;
  } catch (error) {
    console.error('Error searching genres:', error);
    dispatchNotification('Không thể tìm kiếm thể loại', 'error');
    return { error: 'Không thể tìm kiếm thể loại' };
  }
};

export { searchAll, searchSongs, searchAlbums, searchGenres };