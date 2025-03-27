import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormVolunteer() {
    const navigate = useNavigate();
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [formData, setFormData] = useState({name: '', age: '', phone: '', prof: ''});

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedDepartments((prev) => [...prev, value]);
        } else {
            setSelectedDepartments((prev) => prev.filter((item) => item !== value));
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/form/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'volunteer',
                    data: {
                        ...formData,
                        department: selectedDepartments,
                    },
                }),
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="h-screen max-w-lg p-6 bg-white shadow-md rounded-md">
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
            <form onSubmit={submitForm} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Имя Фамилия: <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData?.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, prof: e.target.value })}
                        required
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Какой департамент вам интересен для участия:</label>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="admin"
                                onChange={handleCheckboxChange}
                            />
                            <span>Административный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="promo"
                                onChange={handleCheckboxChange}
                            />
                            <span>Рекламный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="art"
                                onChange={handleCheckboxChange}
                            />
                            <span>Культурный</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="tech"
                                onChange={handleCheckboxChange}
                            />
                            <span>Технический</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="security"
                                onChange={handleCheckboxChange}
                            />
                            <span>Охрана</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="catering"
                                onChange={handleCheckboxChange}
                            />
                            <span>Общепит</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="department"
                                value="other"
                                onChange={handleCheckboxChange}
                            />
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
