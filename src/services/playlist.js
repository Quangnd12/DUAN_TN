// playlists.js
import axios from 'axios';

class PlaylistService {
  static async createPlaylist(name, description, isPublic) {
    try {
      const response = await axios.post('/api/playlists', {
        name,
        description,
        isPublic
      });
      return response.data.playlist;
    } catch (error) {
      throw error;
    }
  }

  static async addSongToPlaylist(playlistId, songId) {
    try {
      await axios.post('/api/playlists/add-song', {
        playlistId,
        songId
      });
    } catch (error) {
      throw error;
    }
  }

  static async removeSongFromPlaylist(playlistId, songId) {
    try {
      await axios.delete(`/api/playlists/${playlistId}/songs/${songId}`);
    } catch (error) {
      throw error;
    }
  }

  static async getPlaylistById(id) {
    try {
      const response = await axios.get(`/api/playlists/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserPlaylists() {
    try {
      const response = await axios.get('/api/playlists/user/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getPublicPlaylists(page = 1, limit = 10) {
    try {
      const response = await axios.get('/api/playlists/public/all', {
        params: {
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updatePlaylist(playlistId, data) {
    try {
      const response = await axios.put(`/api/playlists/${playlistId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deletePlaylist(playlistId) {
    try {
      await axios.delete(`/api/playlists/${playlistId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default PlaylistService;