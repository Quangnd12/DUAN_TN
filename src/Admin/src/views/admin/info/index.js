import React, {useEffect} from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminProfile from "./components/profile";
import { useGetUserQuery } from "../../../../../redux/slice/apiSlice";

export default function Info() {
  // Lấy id từ URL params
  const { id } = useParams();
  
  // Lấy thông tin user đã đăng nhập từ Redux store
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem("user", JSON.stringify(authUser));
    }
  }, [authUser]);

  // Kiểm tra xem id từ URL có khớp với id của user đang đăng nhập không
  const isOwnProfile = authUser && authUser.id === Number(id);

  // Sử dụng RTK Query để fetch thông tin user dựa trên id
  const { data: userData, error, isLoading } = useGetUserQuery(id, {
    // Chỉ fetch nếu có id và id hợp lệ
    skip: !id || isNaN(Number(id))
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Truyền dữ liệu user vào AdminProfile
  return (
    <div className="pt-1">
      <AdminProfile user={isOwnProfile ? authUser : userData} />
    </div>
  );
}