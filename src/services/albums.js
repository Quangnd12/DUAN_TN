import request from "config";

const getAlbums = async (page = 1, limit = 20, searchTerm = "") => {
  try {
    const res = await request({
      method: "GET",
      path: "/api/albums",
      params: {
        page,
        limit,
        searchTerm,
      },
    });

    if (!res || !res.albums) {
      throw new Error("Invalid response format from server");
    }

    return {
      albums: res.albums,
      currentPage: res.currentPage,
      totalPages: res.totalPages,
      totalAlbums: res.totalAlbums,
    };
  } catch (error) {
    console.error(
      "Error fetching albums:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch albums." };
  }
};

const getAlbumById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/albums/${id}`,
  });
  return res;
};

const addAlbum = async (album) => {
  const res = await request({
    method: "POST",
    path: "/api/albums",
    data: album,
  });
  return res;
};

const deleteAlbum = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/albums/${id}`,
  });
  return res;
};

const updateAlbum = async (id, album) => {
  const res = await request({
    method: "PUT",
    path: `/api/albums/${id}`,
    data: album,
  });
  return res;
};

export { getAlbums, getAlbumById, addAlbum, deleteAlbum, updateAlbum };