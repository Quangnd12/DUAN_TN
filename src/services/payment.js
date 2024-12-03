import request from "../config";
import { store } from "../redux/store"; // Import store
import { addNotification } from "../redux/slice/notificationSlice";

// const dispatchNotification = (message, type = "default") => {
//   store.dispatch(addNotification({ message, type }));
// };

const Payment = async (payData) => {
    const res = await request({
      method: "POST",
      path: "/api/payment",
      data:payData,
    });

    return res;

};

const getAllPayment = async (page, limit,searchName) => {
  let path = '/api/payment/all';
  
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

const CheckPayment = async () => {
    const res = await request({
      method: "GET",
      path: "/api/payment",
    });

    return res;

};
const getPaymentByUser = async () => {
    const res = await request({
      method: "GET",
      path: `/api/payment/user`,
    });

    return res;

};
const addPayment = async (payData) => {
    const res = await request({
      method: "POST",
      path: "/api/payment/order",
      data:payData,
    });

    return res;

};
const RenewPayment = async (payData) => {
    const res = await request({
      method: "PUT",
      path: "/api/payment",
      data:payData,
    });

    return res;

};

export {  Payment,addPayment,CheckPayment ,getPaymentByUser,RenewPayment,getAllPayment};
