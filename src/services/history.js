import request from "../config";

const getHistoryById = async (id) => {
  try {
    const res = await request({
      method: "GET",
      path: `/api/histories/${id}`,
    });
    return res.data || [];
  } catch (error) {
    return [];
  }
};

const addHistory = async (userId, songId) => {
  try {
    const historyData = {
      userID: userId,
      songID: songId,
      listeningDate: new Date().toISOString()
    };

    const res = await request({
      method: "POST",
      path: "/api/histories",
      data: historyData,
    });

    if (res.success) {
      return res.data;
    } else {
      throw new Error(res.message || "Không thể thêm lịch sử");
    }
  } catch (error) {
    console.error("Lỗi khi thêm lịch sử:", error);
    throw error;
  }
};

const deleteHistory = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/histories/${id}`,
    });
    return res || [];
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử:", error);
    return [];
  }
};

const deleteAllHistory = async (id) => {
  try {
    const res = await request({
      method: "DELETE",
      path: `/api/histories/user/${id}`,
    });
    return res || [];
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử:", error);
    return [];
  }
};

export { getHistoryById, addHistory,deleteHistory,deleteAllHistory };
