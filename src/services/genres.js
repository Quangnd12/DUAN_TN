import request from "config";

const getGenres = async (page, limit, countryID, searchName) => {
  let path = '/api/genres';
  
  // Thêm tham số page và limit vào URL nếu có
  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  // Thêm tham số countryID vào query nếu có
  if (countryID && countryID.length > 0) {
    query.push(`countryIDs=${JSON.stringify(countryID)}`);
  }

  // Thêm tham số searchName vào query nếu có
  if (searchName) {
    query.push(`searchName=${encodeURIComponent(searchName)}`);
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

  return res; 
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