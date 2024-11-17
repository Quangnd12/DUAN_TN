import request from "config";
import { store } from "../redux/store"; // Import store
import { addNotification } from "../redux/slice/notificationSlice";

const dispatchNotification = (message, type = "default") => {
  store.dispatch(addNotification({ message, type }));
};

const getGenres = async (page, limit, countryID, searchName) => {
  let path = "/api/genres";

  // Thêm tham số page và limit vào URL nếu có
  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  // Thêm tham số countryID vào query nếu có
  if (countryID && countryID.length > 0) {
    query.push(`countryIDs=${JSON.stringify(countryID)}`);
  }

  // Thêm tham số searchName vào query nếu có
  if (searchName) {
    query.push(`searchName=${encodeURIComponent(searchName)}`);
  }

  // Gộp các tham số query và thêm vào URL
  if (query.length > 0) {
    path += `?${query.join("&")}`;
  }

  // Gửi request đến API
  const res = await request({
    method: "GET",
    path: path,
  });

  return res;
};

const getGenreById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/genres/${id}`,
  });
  return res;
};

const addGenre = async (genre) => {
  try {
    const res = await request({
      method: "POST",
      path: "/api/genres",
      data: genre,
    });
    dispatchNotification("Genre added successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to add Genre", "error");
    throw error;
  }
};

const deleteGenre = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/genres/${id}`,
    });
    dispatchNotification("Genre deleted successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to delete genre", "error");
    throw error;
  }
};

const updateGenre = async (id, genre) => {
  try {
    const res = await request({
      method: "PUT",
      path: `/api/genres/${id}`,
      data: genre,
    });
    dispatchNotification("Genre updated successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to update genre", "error");
    throw error;
  }
};

export { getGenres, getGenreById, addGenre, deleteGenre, updateGenre };
