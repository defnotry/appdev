import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Remove strict mode in Admin mode to avoid double invoke
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

