import request from "config";

const getArtists = async (page = 1, limit = 10) => {
  const res = await request({
    method: "GET",
    path: `/api/artists?page=${page}&limit=${limit}`,
  });
  // Đảm bảo trả về đối tượng có artists và totalPages
  return {
    artists: res.artists || [], // Nếu không có artists, trả về mảng rỗng
    totalPages: res.totalPages || 0 // Nếu không có totalPages, trả về 0
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
  const res = await request({
    method: "POST",
    path: "/api/artists",
    data: Artist,
  });
  return res;
};


const fetcher = async (page, limit, searchTerm) => {
  const res = await request({
    method: "GET",
    path: searchTerm 
      ? `/api/artists/search?page=${page}&limit=${limit}&name=${searchTerm}`
      : `/api/artists?page=${page}&limit=${limit}`, // fallback nếu không có từ khóa tìm kiếm
  });
  return {
    artists: res.artists || [],
    totalPages: res.totalPages || 0,
  };
};

const deleteArtist = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/artists/${id}`,
  });
  return res;
};

const updateArtist = async (id, Artist) => {
  const res = await request({
    method: "PUT",
    path: `/api/artists/${id}`,
    data: Artist,
  });
  return res;
};


export { getArtists, getArtistById, addArtist, deleteArtist, updateArtist, fetcher };
