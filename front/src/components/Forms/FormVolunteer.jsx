import React from "react";
import { useNavigate } from "react-router-dom";

function FormVolunteer({ formData = {}, handleInputChange, handleSubmit }) {
    const navigate = useNavigate();

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <button
                onClick={() => navigate('/')}
                className="text-blue-500 hover:text-blue-700"
            >
                &lt;&lt;&lt; Назад
            </button>
            <h2 className="text-2xl font-bold mb-4">Форма для набора команды Art Labyrinth 2024</h2>
            <h4 className="text-lg mb-4">
                Добро пожаловать в команду организаторов фестиваля Art Labyrinth!
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Имя Фамилия: <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData?.name}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Возраст <span className="text-red-500">*</span>:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData?.age}
                        onChange={handleInputChange}
                        defaultValue={21}
                        required
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Номер телефона <span className="text-red-500">*</span>:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData?.phone}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Ваша профессия <span className="text-red-500">*</span>:</label>
                    <input
                        type="text"
                        name="prof"
                        value={formData?.prof}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Какой департамент вам интересен для участия:</label>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="admin" onChange={handleInputChange} />
                            <span>Административный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="promo" onChange={handleInputChange} />
                            <span>Рекламный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="art" onChange={handleInputChange} />
                            <span>Культурный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="tech" onChange={handleInputChange} />
                            <span>Технический</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="security" onChange={handleInputChange} />
                            <span>Охрана</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="catering" onChange={handleInputChange} />
                            <span>Общепит</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" name="department" value="other" onChange={handleInputChange} />
                            <span>Другое</span>
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Отправить
                </button>
            </form>
        </div>
    );
}

export default FormVolunteer;
