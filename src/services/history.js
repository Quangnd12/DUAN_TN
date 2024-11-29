import request from "../config";
import { store } from "../redux/store"; // Import store
import { addNotification } from "../redux/slice/notificationSlice";

// const dispatchNotification = (message, type = "default") => {
//   store.dispatch(addNotification({ message, type }));
// };

const getHistoryById = async (id) => {
  const res = await request({
    method: "GET",
    path: `/api/histories/${id}`,
  });
  return res;
};

const addHistory = async (history) => {

    const res = await request({
      method: "POST",
      path: "/api/histories",
      data:history,
    });

    return res;


};



export { getHistoryById, addHistory };
