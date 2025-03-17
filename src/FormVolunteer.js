import React from 'react';

function FormVolunteer({ formData, handleInputChange, handleSubmit }) {
  return (
    <div className="Form">
      <h1>Форма подачи заявки на фестиваль</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default FormVolunteer;
