import axios from "axios";
import { Cookies } from "react-cookie";

const BASE_URL = "http://localhost:5000";

const request = async ({
  method = "GET",
  path = "",
  data = {},
  headers = {},
  params = {}
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
        Authorization: token ? `Bearer ${token}` : "", 
      },
      params: params, 
      withCredentials: true, 
    });

    return res.data;
  }  catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Lỗi xác thực: Token hết hạn hoặc không hợp lệ.");
    }
    throw error;
  }
};

export default request;
export { BASE_URL};
