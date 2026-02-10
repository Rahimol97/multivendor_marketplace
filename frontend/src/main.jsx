import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./index.css";
import AuthProvider from "./components/context/AuthContext";
import axios from "axios";
import {store} from './redux/store'
import { Provider } from "react-redux";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <Provider store={store}>
  <AuthProvider>
  <App />
  </AuthProvider>
</Provider>
  </React.StrictMode>
);

