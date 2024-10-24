import ApiConfig from "../config";

const getGenres = async () => {
  const res = await ApiConfig({
    method: "GET",
    path: "/api/genres",
  });
  return res.data;
};

const getGenreById = async (id) => {
  const res = await ApiConfig({
    method: "GET",
    path: `/api/genres/${id}`,
  });
  return res.data;
};

const addGenre = async (genre) => {
  const res = await ApiConfig({
    method: "POST",
    path: "/api/genres",
    data: genre,
  });
  return res.data;
};

const deleteGenre = async (id) => {
  const res = await ApiConfig({
    method: "DELETE",
    path: `/api/genres/${id}`,
  });
  return res.data;
};

const updateGenre = async (id, genre) => {
  const res = await ApiConfig({
    method: "PUT",
    path: `/api/genres/${id}`,
    data: genre,
  });
  return res.data;
};

export { getGenres, getGenreById, addGenre, deleteGenre, updateGenre };