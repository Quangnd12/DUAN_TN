import request from "config";
import { store } from "../redux/store";
import { addNotification } from "../redux/slice/notificationSlice";

const dispatchNotification = (message, type = "default") => {
  store.dispatch(addNotification({ message, type }));
};

const getAlbums = async (page, limit, countryID, searchTitle) => {
  // Đổi tên param thành searchTitle
  let path = "/api/albums";

  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  if (countryID && countryID.length > 0) {
    query.push(`countryIDs=${JSON.stringify(countryID)}`);
  }

  // Sửa tên param thành searchTitle để match với API
  if (searchTitle) {
    query.push(`searchTitle=${encodeURIComponent(searchTitle)}`); // Đổi thành searchTitle
  }

  if (query.length > 0) {
    path += `?${query.join("&")}`;
  }

  const res = await request({
    method: "GET",
    path: path,
  });

  return res;
};

const getAlbumById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/albums/${id}`,
  });
  return res;
};


const addAlbum = async (album) => {
  try {
    const res = await request({
      method: "POST",
      path: "/api/albums",
      data: album,
    });
    dispatchNotification("Album added successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to add album", "error");
    throw error;
  }
};

const deleteAlbum = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/albums/${id}`,
    });
    dispatchNotification("Album deleted successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to delete album", "error");
    throw error;
  }
};

const updateAlbum = async (id, album) => {
  try {
    const res = await request({
      method: "PUT",
      path: `/api/albums/${id}`,
      data: album,
    });
    dispatchNotification("Album updated successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to update album", "error");
    throw error;
  }
};

export { getAlbums, getAlbumById, addAlbum, deleteAlbum, updateAlbum };
