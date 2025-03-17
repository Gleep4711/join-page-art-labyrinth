import React, { useState } from 'react';

function Form() {
  const [applicationType, setApplicationType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    department: '',
    programDirection: '',
    programDescription: '',
    eventDates: ''
  });

  const handleTypeChange = (e) => {
    setApplicationType(e.target.value);
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

  return (
    <div className="Form">
      <h1>Форма подачи заявки на фестиваль</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Тип заявки:
          <select value={applicationType} onChange={handleTypeChange}>
            <option value="">Выберите тип</option>
            <option value="volunteer">Волонтёр</option>
            <option value="master">Мастер</option>
          </select>
        </label>

        {applicationType === 'volunteer' && (
          <>
            <label>
              Имя:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Контактные данные:
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Департамент:
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </label>
          </>
        )}

        {applicationType === 'master' && (
          <>
            <label>
              Направление программы:
              <input
                type="text"
                name="programDirection"
                value={formData.programDirection}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Описание программы:
              <textarea
                name="programDescription"
                value={formData.programDescription}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Даты проведения мероприятия:
              <input
                type="text"
                name="eventDates"
                value={formData.eventDates}
                onChange={handleInputChange}
              />
            </label>
          </>
        )}

        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default Form;
