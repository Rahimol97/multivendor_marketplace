import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
import AuthProvider from "./components/context/AuthContext";
import axios from "axios";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <AuthProvider>
          <App />
        </AuthProvider>
  </React.StrictMode>
);

