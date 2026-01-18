import React from "react";
import ReactDom from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'

// creating the root applicatin component
const root = ReactDom.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
