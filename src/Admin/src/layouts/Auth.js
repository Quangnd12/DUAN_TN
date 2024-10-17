import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// views
import Login from "../views/auth/Login.js";

export default function Auth() {
  return (
    <>
      <main>
        <section className="relative w-full h-full min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
          ></div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </section>
      </main>
    </>
  );
}