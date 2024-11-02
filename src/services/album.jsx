import request from "config";

const getAlbums = async (page = 1, limit = 10) => {
    const res = await request({
      method: "GET",
      path: `/api/albums?page=${page}&limit=${limit}`,
    });
    return res.albums;
  };

const getAlbumById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/albums/${id}`,
  });
  return res;
};

const addAlbum = async (Album) => {
  const res = await request({
    method: "POST",
    path: "/api/albums",
    data: Album,
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

const updateAlbum = async (id, Album) => {
  const res = await request({
    method: "PUT",
    path: `/api/albums/${id}`,
    data: Album,
  });
  return res;
};

export { getAlbums, getAlbumById, addAlbum, deleteAlbum, updateAlbum };
