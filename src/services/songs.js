import request from "config";

const getSongs = async () => {
  const res = await request({
    method: "GET",
    path: "/api/songs",
  });
  return res.data;
};

const getSongById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/songs/${id}`,
  });
  return res;
};

const addSong = async (song) => {
  const res = await request({
    method: "POST",
    path: "/api/songs",
    data: song,
  });
  return res;
};

const deleteSong = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/songs/${id}`,
  });
  return res;
};

const updateSong = async (id, song) => {
  const res = await request({
    method: "PUT",
    path: `/api/songs/${id}`,
    data: song,
  });
  return res;
};

export { getSongs, getSongById, addSong, deleteSong, updateSong };
