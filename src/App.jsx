import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Client from "./Client/src/App";
import Admin from "./Admin/src/layouts/Admin";
import { Provider } from "react-redux";
import Store from "./redux/store";

const App = () => {
  return (
    <Provider store={Store}>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Client />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Provider>
  );
};

export default App;
