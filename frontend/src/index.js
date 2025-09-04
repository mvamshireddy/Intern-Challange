import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // 👈 Import Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* 👈 Wrap your App component */}
      <App />
    </Router>
  </React.StrictMode>
);