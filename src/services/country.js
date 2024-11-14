import request from "config";

const getCountry = async (page, limit,searchName) => {
  let path = '/api/countries';
  
  let query = [];

  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  if (searchName) {
    query.push(`searchName=${encodeURIComponent(searchName)}`);
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


const getCountryById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/countries/${id}`,
  });
  return res;
};

const addCountry = async (genre) => {
  const res = await request({
    method: "POST",
    path: "/api/countries",
    data: genre,
  });
  return res;
};

const deleteCountry = async (id) => {
  const res = await request({
    method: "DELETE",
    path: `/api/countries/${id}`,
  });
  return res;
};

const updateCountry = async (id, genre) => {
  const res = await request({
    method: "PUT",
    path: `/api/countries/${id}`,
    data: genre,
  });
  return res;
};

export { getCountry, getCountryById, addCountry, deleteCountry, updateCountry };