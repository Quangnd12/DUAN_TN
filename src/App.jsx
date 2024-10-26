import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Client from "./Client/src/App";
import Admin from "./Admin/src/layouts/Admin";
import Auth from "./Admin/src/layouts/Auth.js";
import { Provider } from "react-redux";
import Store from "./redux/store";
import PrivateRoute from "./redux/PrivateRoute"; 

const App = () => {
  return (
    <Provider store={Store}>
      <Routes>
        <Route path="/admin/*" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Client />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Provider>
  );
};

export default App;
