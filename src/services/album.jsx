import request from "config";

const getAlbums = async () => {
  const res = await request({
    method: "GET",
    path: "/api/albums",
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
