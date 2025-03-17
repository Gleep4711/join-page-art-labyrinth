import React from "react";

function FormVolunteer({ formData, handleInputChange, handleSubmit }) {
    return (
        <div className="Form">
            <h2>Форма для набора команды Art Labyrinth 2024</h2>

            <h4>Добро пожаловать в команду организаторов фестиваля Art Labyrinth!</h4>
            <h4>Заполните пожалуйста простую форму и ближайшее время с вами свяжется координатор отдела кадров.</h4>
            <h4>
                Ознакомьтесь с организационной структурой фестиваля и выберите для себя более подходящую сферу
                деятельности в организации Арт Лабиринта:
            </h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Имя Фамилия: <span className="red">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Возраст <span className="red">*</span>:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} defaultValue={21} required />
                </div>
                <div className="form-group">
                    <label>Номер телефона <span className="red">*</span>:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Ваша профессия <span className="red">*</span>:</label>
                    <input type="text" name="prof" value={formData.prof} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Какой департамент вам интересен для участия:</label>
                    <div className="checkbox-group">
                        <label>
                            <input type="checkbox" name="department" value="admin" onChange={handleInputChange} /> Административный
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="promo" onChange={handleInputChange} /> Рекламный
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="art" onChange={handleInputChange} /> Культурный
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="tech" onChange={handleInputChange} /> Технический
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="security" onChange={handleInputChange} /> Охрана
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="catering" onChange={handleInputChange} /> Общепит
                        </label>
                        <label>
                            <input type="checkbox" name="department" value="other" onChange={handleInputChange} /> Другое
                        </label>
                    </div>
                </div>
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
}

export default FormVolunteer;
