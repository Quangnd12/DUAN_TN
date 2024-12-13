import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/Api_url';

// Định nghĩa các action async
const getArtistToken = () => {
    const tokenData = localStorage.getItem('artistToken');
    if (!tokenData) return null;
    
    try {
      // Kiểm tra xem token có phải là JSON không
      const parsedToken = JSON.parse(tokenData);
      return parsedToken.token || parsedToken;
    } catch {
      // Nếu không phải JSON, trả về trực tiếp token string
      return tokenData;
    }
  };
  
  // Cập nhật các action async
  export const uploadSong = createAsyncThunk(
    'artistSong/uploadSong',
    async (formData, { rejectWithValue }) => {
      try {
        // Lấy token trực tiếp từ localStorage
        const token = localStorage.getItem('artistToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const response = await axios.post(`${API_BASE_URL}/artist/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` 
          }
        });
        return response.data;
      } catch (error) {
        // Trả về thông tin lỗi chi tiết từ phản hồi API
        if (error.response?.data) {
          return rejectWithValue({
            message: error.response.data.message || 'Lỗi khi tải lên bài hát',
            error: error.response.data.error || 'Có lỗi không xác định'
          });
        }
        return rejectWithValue({ 
          message: error.message,
          error: 'Có lỗi không xác định'
        });
      }
    }
  );
  
  export const getArtistSongs = createAsyncThunk(
    'artistSong/getArtistSongs',
    async ({ page, limit }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('artistToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }
  
        const response = await axios.get(
          `${API_BASE_URL}/artist/songs?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || 'An error occurred while loading the song list'
        );
      }
    }
  );
  
  export const updateArtistSong = createAsyncThunk(
    'artistSong/updateSong',
    async ({ id, formData }, { rejectWithValue }) => {
      try {
        const token = getArtistToken();
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }
  
        const response = await axios.put(`${API_BASE_URL}/artist/songs/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  export const deleteArtistSong = createAsyncThunk(
    'artistSong/deleteSong',
    async (id, { rejectWithValue }) => {
      try {
        const token = getArtistToken();
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }
  
        const response = await axios.delete(`${API_BASE_URL}/artist/songs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return { id, ...response.data };
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  // Thêm action async mới để lấy danh sách genres và albums
  export const getGenresAndAlbums = createAsyncThunk(
    'artistSong/getGenresAndAlbums',
    async (_, { rejectWithValue }) => {
      try {
        const token = getArtistToken();
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await axios.get(`${API_BASE_URL}/artist/genres-albums`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

// Khởi tạo state
const initialState = {
    songs: [],
    genres: [],
    albums: [], 
    loading: false,
    error: null,
    uploadStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    currentSong: null,
    genresAlbumsLoading: false, 
    genresAlbumsError: null,
    totalPages: 1,
    currentPage: 1,
    totalItems: 0
  };
// Tạo slice
const artistSongSlice = createSlice({
  name: 'artistSong',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.uploadStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
      state.error = null;
      state.genresAlbumsError = null;
    },
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Upload song
    builder
      .addCase(uploadSong.pending, (state) => {
        state.uploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadSong.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        if (action.payload && action.payload.songId) {
          const newSong = {
            id: action.payload.songId,
            title: action.payload.title || '',
            duration: action.payload.duration || 0,
            listens: 0,
            releaseDate: action.payload.releaseDate || new Date().toISOString(),
            image: action.payload.image || '',
            file_song: action.payload.file_song || '',
            is_premium: action.payload.is_premium || 0,
            is_explicit: action.payload.is_explicit || 0,
            genres: action.payload.genres || [],
            albums: action.payload.albums || []
          };
          state.songs = [newSong, ...state.songs];
        }
      })
      .addCase(uploadSong.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload?.error || 'Có lỗi xảy ra';
      })

    // Get artist songs
    builder
      .addCase(getArtistSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtistSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload.songs.map(song => ({
          ...song,
          genres: song.genres || [],
          albums: song.albums || []
        }));
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getArtistSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Có lỗi xảy ra';
      })

    // Update song
    builder
      .addCase(updateArtistSong.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateArtistSong.fulfilled, (state) => {
        state.updateStatus = 'succeeded';
      })
      .addCase(updateArtistSong.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload?.message || 'Lỗi khi cập nhật bài hát';
      })

    // Delete song
    builder
      .addCase(deleteArtistSong.pending, (state) => {
        state.deleteStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteArtistSong.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.songs = state.songs.filter(song => song.id !== action.payload.id);
      })
      .addCase(deleteArtistSong.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.payload || 'Có lỗi xảy ra';
      })

    // Thêm reducers mới cho getGenresAndAlbums
    builder
      .addCase(getGenresAndAlbums.pending, (state) => {
        state.genresAlbumsLoading = true;
        state.genresAlbumsError = null;
      })
      .addCase(getGenresAndAlbums.fulfilled, (state, action) => {
        state.genresAlbumsLoading = false;
        state.genres = action.payload.genres;
        state.albums = action.payload.albums;
      })
      .addCase(getGenresAndAlbums.rejected, (state, action) => {
        state.genresAlbumsLoading = false;
        state.genresAlbumsError = action.payload?.message || 'Lỗi khi lấy danh sách thể loại và album';
      });
  }
});

export const { resetStatus, setCurrentSong } = artistSongSlice.actions;

// Thêm selectors
export const selectGenres = state => state.artistSong.genres;
export const selectAlbums = state => state.artistSong.albums;
export const selectGenresAlbumsLoading = state => state.artistSong.genresAlbumsLoading;
export const selectGenresAlbumsError = state => state.artistSong.genresAlbumsError;

export default artistSongSlice.reducer;