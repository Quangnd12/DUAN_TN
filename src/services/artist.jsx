import request from "config";

const getArtists = async (page = 1, limit = 10) => {
  const res = await request({
    method: "GET",
    path: `/api/artists?page=${page}&limit=${limit}`,
  });
  return res;
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

export { getArtists, getArtistById, addArtist, deleteArtist, updateArtist };
