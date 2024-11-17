import request from "config";
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


export { getSongs, getSongById, addSong, deleteSong, updateSong };
