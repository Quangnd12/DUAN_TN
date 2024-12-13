import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/Api_url";

const initialState = {
  albums: [],
  currentAlbum: null,
  loading: false,
  error: null,
  success: false,
};

// Định nghĩa các action async
export const createAlbum = createAsyncThunk(
  "artistAlbum/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      // Tạo FormData mới
      const formData = new FormData();
      
      // Thêm các trường dữ liệu vào FormData
      formData.append("title", albumData.title);
      formData.append("description", albumData.description || "");
      formData.append("release_date", albumData.release_date || "");
      if (albumData.cover_image) {
        formData.append("cover_image", albumData.cover_image);
      }

      const response = await axios.post(
        `${API_BASE_URL}/artist/albums/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Nếu tạo thành công, lấy danh sách albums mới nhất
      if (response.data.success) {
        const updatedAlbumsResponse = await axios.get(
          `${API_BASE_URL}/artist/albums`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return {
          ...response.data,
          albums: updatedAlbumsResponse.data.albums
        };
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo album"
      );
    }
  }
);

export const addSongsToAlbum = createAsyncThunk(
  "artistAlbum/addSongsToAlbum",
  async ({ albumId, songIds }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.post(
        `${API_BASE_URL}/artist/albums/${albumId}/songs`,
        { song_ids: songIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Sau khi thêm bài hát thành công, lấy thông tin album mới nhất
      const updatedAlbumResponse = await axios.get(
        `${API_BASE_URL}/artist/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        ...response.data,
        updatedAlbum: updatedAlbumResponse.data.album
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getArtistAlbums = createAsyncThunk(
  "artistAlbum/getArtistAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.get(`${API_BASE_URL}/artist/albums`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thêm hàm helper để lấy token
const getArtistToken = () => {
  const tokenData = localStorage.getItem("artistToken");
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

// Sửa lại action getAlbumDetails
export const getAlbumDetails = createAsyncThunk(
  "artistAlbum/getAlbumDetails",
  async (albumId, { rejectWithValue }) => {
    try {
      const token = getArtistToken();
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.get(
        `${API_BASE_URL}/artist/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kiểm tra và trả về dữ liệu
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "artistAlbum/updateAlbum",
  async ({ albumId, albumData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const formData = new FormData();
      if (albumData.title) formData.append("title", albumData.title);
      if (albumData.description)
        formData.append("description", albumData.description);
      if (albumData.release_date)
        formData.append("release_date", albumData.release_date);
      if (albumData.cover_image)
        formData.append("cover_image", albumData.cover_image);

      const response = await axios.put(
        `${API_BASE_URL}/artist/albums/${albumId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "artistAlbum/deleteAlbum",
  async (albumId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.delete(
        `${API_BASE_URL}/artist/albums/${albumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { albumId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeSongFromAlbum = createAsyncThunk(
  "artistAlbum/removeSongFromAlbum",
  async ({ albumId, songId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("artistToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await axios.delete(
        `${API_BASE_URL}/artist/albums/${albumId}/songs/${songId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { albumId, songId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const artistAlbumSlice = createSlice({
  name: "artistAlbum",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
    clearCurrentAlbum: (state) => {
      state.currentAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý createAlbum
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload.albums) {
          state.albums = action.payload.albums;
        } else if (action.payload.album) {
          // Nếu server trả về album mới, thêm vào đầu danh sách
          state.albums.unshift(action.payload.album);
        }
        state.error = null;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Có lỗi xảy ra khi tạo album";
      })

      // Xử lý getArtistAlbums
      .addCase(getArtistAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getArtistAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.albums || [];
        state.error = null;
      })
      .addCase(getArtistAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý getAlbumDetails
      .addCase(getAlbumDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbumDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAlbum = action.payload.album;
        state.error = null;
      })
      .addCase(getAlbumDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra khi tải thông tin album";
        state.currentAlbum = null;
      })

      // Xử lý updateAlbum
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedAlbum = action.payload;
        const index = state.albums.findIndex(
          (album) => album.id === updatedAlbum.id
        );
        if (index !== -1) {
          state.albums[index] = updatedAlbum;
        }
        if (state.currentAlbum?.id === updatedAlbum.id) {
          state.currentAlbum = updatedAlbum;
        }
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Có lỗi xảy ra";
      })

      // Xử lý deleteAlbum
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.albums = state.albums.filter(
          (album) => album.id !== action.payload.albumId
        );
        if (state.currentAlbum?.id === action.payload.albumId) {
          state.currentAlbum = null;
        }
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Có lỗi xảy ra";
      })

      // Xử lý addSongsToAlbum
      .addCase(addSongsToAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSongsToAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        if (action.payload.updatedAlbum) {
          state.currentAlbum = action.payload.updatedAlbum;
          
          // Cập nhật album trong danh sách albums
          const albumIndex = state.albums.findIndex(
            (album) => album.id === action.payload.updatedAlbum.id
          );
          if (albumIndex !== -1) {
            state.albums[albumIndex] = action.payload.updatedAlbum;
          }
        }
      })
      .addCase(addSongsToAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Có lỗi xảy ra khi thêm bài hát";
        state.success = false;
      })

      // Xử lý removeSongFromAlbum
      .addCase(removeSongFromAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSongFromAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentAlbum) {
          state.currentAlbum.songs = state.currentAlbum.songs.filter(
            (song) => song.id !== action.payload.songId
          );
        }
      })
      .addCase(removeSongFromAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Có lỗi xảy ra";
      });
  },
});

export const { resetStatus, clearCurrentAlbum } = artistAlbumSlice.actions;

export default artistAlbumSlice.reducer;
