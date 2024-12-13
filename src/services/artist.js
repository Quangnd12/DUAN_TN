import request from "config";
import { store } from '../redux/store';
import { addNotification } from '../redux/slice/notificationSlice';

const dispatchNotification = (message, type = 'default') => {
  store.dispatch(addNotification({ message, type }));
};

const getArtists = async (page , limit) => {
  let path = '/api/artists';

  // Tạo mảng chứa các tham số query
  let query = [];

  // Thêm tham số page và limit vào query nếu có
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }





  // Gộp các tham số query và thêm vào URL
  if (query.length > 0) {
    path += `?${query.join('&')}`;
  }

  // Gửi request đến API
  const res = await request({
    method: "GET",
    path: path,
  });

  // Đảm bảo trả về đối tượng có artists và totalPages
  return {
    artists: res.artists || [], // Nếu không có artists, trả về mảng rỗng
    totalPages: res.totalPages || 0 // Nếu không có totalPages, trả về 0
  };
};

const getAllArtists = async () => {
  let path = '/api/artists'; // Đường dẫn API lấy t��t cả nghệ sĩ

  // Gửi request đến API
  const res = await request({
    method: "GET",
    path: path,
  });

  // Đảm bảo trả về đối tượng có artists
  return {
    artists: res.artists || [], // Nếu không có artists, trả về mảng rỗng
  };
};


const getArtistById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/artists/${id}`,
  });
  return res;
};

const addArtist = async (Artist) => {
  try {
    const res = await request({
      method: "POST",
      path: "/api/artists",
      data: Artist,
    });
    dispatchNotification("Artist added successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to add artist", "error");
    if (error.response) {
      throw new Error(error.response.data.message);  // Throw the backend error message
    }
    throw new Error("An error occurred while adding the artist");
  }
};



const fetcher = async (page, limit, searchTerm) => {
  const res = await request({
    method: "GET",
    path: searchTerm 
      ? `/api/artists/search?page=${page}&limit=${limit}&name=${searchTerm}`
      : `/api/artists?page=${page}&limit=${limit}`,
  });

  return {
    artists: res.artists || [],
    totalPages: res.totalPages || 1,
    currentPage: res.currentPage || page,
    totalCount: res.totalCount || 0
  };
};

const deleteArtist = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/artists/${id}`,
    });
    dispatchNotification("Artist deleted successfully", "success");
    return res;
  } catch (error) {
    dispatchNotification("Failed to delete artist", "error");
    throw new Error(`Lỗi khi xóa artist: ${error.message}`);
  }
};

const updateArtist = async (id, Artist) => {
  const res = await request({
    method: "PUT",
    path: `/api/artists/${id}`,
    data: Artist,
  });
  dispatchNotification("Artist update successfully", "success");
  return res;
};

export { getArtists, getArtistById, addArtist, deleteArtist, updateArtist, fetcher , getAllArtists};
