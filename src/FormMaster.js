import React from 'react';

function FormMaster({ formData, handleInputChange, handleSubmit }) {
  return (
    <div className="Form">
      <h1>Форма подачи заявки на фестиваль</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default FormMaster;
