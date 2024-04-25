import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MainComponent from './mainComponent';
import 'bootstrap/dist/css/bootstrap.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <h1>IM HERE</h1>
    <App />
  </React.StrictMode>
);

