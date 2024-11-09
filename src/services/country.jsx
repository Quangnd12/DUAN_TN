import request from "config";

const getCountry = async (page, limit) => {
  let path = '/api/countries';
  
  if (page && limit) {
    path += `?page=${page}&limit=${limit}`;
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