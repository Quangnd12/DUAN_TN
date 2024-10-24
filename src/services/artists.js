import request from "config";

const getArtists = async (page = 1, limit = 20, searchTerm = "") => {
  try {
    const res = await request({
      method: "GET",
      path: "/api/artists",
      params: {
        page,
        limit,
        searchTerm,
      },
    });

    if (!res || !res.artists) {
      throw new Error("Invalid response format from server");
    }

    return {
      artists: res.artists,
      currentPage: res.currentPage,
      totalPages: res.totalPages,
      totalArtists: res.totalArtists,
    };
  } catch (error) {
    console.error(
      "Error fetching artists:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch artists." };
  }
};

const getArtistById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/artists/${id}`,
  });
  return res;
};

const addArtist = async (artist) => {
  const res = await request({
    method: "POST",
    path: "/api/artists",
    data: artist,
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

const updateArtist = async (id, artist) => {
  const res = await request({
    method: "PUT",
    path: `/api/artists/${id}`,
    data: artist,
  });
  return res;
};

export { getArtists, getArtistById, addArtist, deleteArtist, updateArtist };
