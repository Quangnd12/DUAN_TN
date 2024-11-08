import axios from "axios";
import { Cookies } from "react-cookie";

const BASE_URL = "http://localhost:5000";
const UploadFile="https://storage.googleapis.com/be-musicheals.appspot.com/UploadImage";

const ApiConfig = async ({
  method = "GET",
  path = "",
  data = {},
  headers = {},
  params = {} // Thêm params ở đây
}) => {
  try {
    const cookie = new Cookies();
    const token = cookie.get("token");

    const res = await axios({
      method: method,
      baseURL: BASE_URL,
      url: path,
      data: data,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      params: params, // Thêm params vào axios config
    });

    return res.data;
  } catch (error) {
    // alert(error?.response?.data?.message || "Error");
   throw error;
  }
};

export default ApiConfig;
export { BASE_URL,UploadFile };