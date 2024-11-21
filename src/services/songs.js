import request from "config";

const getSongs = async (page, limit, searchName, genres, minDuration, maxDuration, minListensCount,maxListensCount) => {
  let path = '/api/songs';

  let query = [];
  if (page && limit) {
    query.push(`page=${page}`);
    query.push(`limit=${limit}`);
  }

  if (genres && genres.length > 0) {
    query.push(`genres=${JSON.stringify(genres)}`);
  }

  if (searchName) {
    query.push(`searchName=${encodeURIComponent(searchName)}`);
  }

  if (minDuration) {
    query.push(`minDuration=${minDuration}`);
  }

  if (maxDuration) {
    query.push(`maxDuration=${maxDuration}`);
  }

  if (minListensCount) {
    query.push(`minListensCount=${minListensCount}`);
  }
  if (maxListensCount) {
    query.push(`maxListensCount=${maxListensCount}`);
  }
  if (query.length > 0) {
    path += `?${query.join('&')}`;
  }

  try {
    const res = await request({
      method: "GET",
      path: path,
    });

    return res;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return { error: 'Failed to fetch songs' };
  }
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
