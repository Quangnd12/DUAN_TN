import request from "config";

const getAlbums = async (page, limit, countryID, searchTitle) => { // Đổi tên param thành searchTitle
  let path = '/api/albums';
  
  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  if (countryID && countryID.length > 0) {
    query.push(`countryIDs=${JSON.stringify(countryID)}`);
  }

  // Sửa tên param thành searchTitle để match với API
  if (searchTitle) {
    query.push(`searchTitle=${encodeURIComponent(searchTitle)}`); // Đổi thành searchTitle
  }

  if (query.length > 0) {
    path += `?${query.join('&')}`;
  }

  const res = await request({
    method: "GET",
    path: path,
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