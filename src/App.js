import React, { useEffect } from 'react';
import './App.css';
import Form from './Form';

function App({ background }) {
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

  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <Form />
    </div>
  );
}

export default App;
