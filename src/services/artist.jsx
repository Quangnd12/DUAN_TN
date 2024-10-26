import request from "config";

const getArtists = async () => {
  const res = await request({
    method: "GET",
    path: "/api/artists",
  });
  return res.artists;
};

const getArtistById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/artists/${id}`,
  });
  return res.artists;
};

const addArtist = async (Artist) => {
  const res = await request({
    method: "POST",
    path: "/api/artists",
    data: Artist,
  });
  return res.artists;
};

const deleteArtist = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/artists/${id}`,
  });
  return res.artists;
};

const updateArtist = async (id, Artist) => {
  const res = await request({
    method: "PUT",
    path: `/api/artists/${id}`,
    data: Artist,
  });
  return res.artists;
};

export { getArtists, getArtistById, addArtist, deleteArtist, updateArtist };
