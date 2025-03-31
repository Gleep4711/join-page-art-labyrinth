import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormMaster from './components/Forms/FormMaster';
import FormVolunteer from './components/Forms/FormVolunteer';
import LandingPage from './components/main-page/LandingPage';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './style/index.css';
import "./i18n.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/volunteer" element={<FormVolunteer />} />
          <Route path="/master" element={<FormMaster />} />
        </Routes>
    </Router>
  </React.StrictMode>
);

