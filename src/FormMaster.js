import React from 'react';

function FormMaster({ formData, handleInputChange, handleSubmit }) {
  return (
    <div className="Form">
      <h1>Форма подачи заявки на фестиваль</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Направление программы:</label>
          <input
            type="text"
            name="programDirection"
            value={formData.programDirection}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Описание программы:</label>
          <textarea
            name="programDescription"
            value={formData.programDescription}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Даты проведения мероприятия:</label>
          <input
            type="text"
            name="eventDates"
            value={formData.eventDates}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default FormMaster;
