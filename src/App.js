import React, { useState, useEffect } from 'react';
import './App.css';
import FormVolunteer from './FormVolunteer';
import FormMaster from './FormMaster';

function App({ background }) {
  const [applicationType, setApplicationType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    department: '',
    programDirection: '',
    programDescription: '',
    eventDates: ''
  });

  useEffect(() => {
    const button = document.getElementById('language-toggle');
    button.addEventListener('click', toggleLanguage);
    return () => {
      button.removeEventListener('click', toggleLanguage);
    };
  }, []);

  const toggleLanguage = () => {
    // Logic for switching the tongue
    console.log('Language toggled');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Processing of sending the form
    console.log('Form submitted:', formData);
  };

  const handleCardClick = (type) => {
    setApplicationType(type);
  };

  const handleBackClick = () => {
    setApplicationType('');
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      {applicationType === '' ? (
        <div className="card-container">
          <div className="card" onClick={() => handleCardClick('volunteer')}>
            Я волонтёр
          </div>
          <div className="card" onClick={() => handleCardClick('master')}>
            Я музыкант
          </div>
        </div>
      ) : (
        <>
          <button onClick={handleBackClick}>Назад</button>
          {applicationType === 'volunteer' && (
            <FormVolunteer
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          )}
          {applicationType === 'master' && (
            <FormMaster
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
