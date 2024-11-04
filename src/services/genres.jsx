import request from "config";

const getGenres = async (page = 1, limit = 10) => {
    const res = await request({
      method: "GET",
      path: `/api/genres?page=${page}&limit=${limit}`,
    });
    return res.genres;
  };

const getGenreById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/genres/${id}`,
  });
  return res;
};

const addGenre = async (genre) => {
  const res = await request({
    method: "POST",
    path: "/api/genres",
    data: genre,
  });
  return res;
};

const deleteGenre = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/genres/${id}`,
  });
  return res;
};

const updateGenre = async (id, genre) => {
  const res = await request({
    method: "PUT",
    path: `/api/genres/${id}`,
    data: genre,
  });
  return res;
};

export { getGenres, getGenreById, addGenre, deleteGenre, updateGenre };