import React from "react";
import ReactDOM from "react-dom/client";
import ITasksManager from "./app.jsx";  
import "./storage-mock.js";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ITasksManager />  
  </React.StrictMode>
);