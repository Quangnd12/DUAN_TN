import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import AdminProfile from "./components/profile";
import { getUserById } from "../../../../../services/Api_url";

export default function Info() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          if (parsedUser.id === id) {
            setUser(parsedUser);
          } else {
            const response = await getUserById(id);
            if (response?.data) {
              setUser(response.data);
            } else {
              throw new Error('User data not found');
            }
          }
        } else {
          const response = await getUserById(id);
          if (response?.data) {
            setUser(response.data);
          } else {
            throw new Error('User data not found');
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-1">
      <AdminProfile user={user} onUserUpdate={(updatedUser) => setUser(updatedUser)} />
    </div>
  );
}