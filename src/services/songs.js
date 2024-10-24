import request from "config";

const getSongs = async (page = 1, limit = 100) => {
  try {
    const res = await request({
      method: "GET",
      path: "/api/songs",
      params: { page, limit }
    });

    if (!res || !res.songs) {
      throw new Error("Invalid response format from server");
    }

    return {
      songs: res.songs.map(song => ({
        value: song.id,
        label: song.title
      }))
    };
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
};

export { getSongs };