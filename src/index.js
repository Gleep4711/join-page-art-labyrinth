import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import background from './assets/background.jpg';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App background={background} />
  </React.StrictMode>
);

