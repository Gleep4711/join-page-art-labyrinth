import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";

function FormVolunteer() {
    const navigate = useNavigate();
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [formData, setFormData] = useState({ name: '', age: '', phone: '', prof: '' });

    const handleCheckboxChange = (e: { target: { value: any; checked: any; }; }) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedDepartments((prev) => [...prev, value]);
        } else {
            setSelectedDepartments((prev) => prev.filter((item) => item !== value));
        }
    };

    const submitForm = async (e: { preventDefault: () => void; }) => {
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
        <div className="h-full max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
            <BackButton />
            <div className="px-8">
                <hr className="pt-4 mt-4" />
                <h2 className="text-2xl">Добро пожаловать в команду</h2>
                <h2 className="text-2xl text-customOrange">Art Labyrinth</h2>
                <h3 className="mb-5">Пожалуйста, заполните форму для волонтеров</h3>
                <form onSubmit={submitForm} className="space-y-4">
                    <div className="flex flex-col">
                        <label>Имя, Фамилия *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData?.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 bg-matchaGreen-50"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Возраст *</label>
                        <input
                            type="number"
                            name="age"
                            min={1}
                            max={120}
                            value={formData?.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 bg-matchaGreen-50"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Ссылка на вашу соцсеть (FB/IG/Vk) *</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData?.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 bg-matchaGreen-50"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Ваша профессия *</label>
                        <input
                            type="text"
                            name="prof"
                            value={formData?.prof}
                            onChange={(e) => setFormData({ ...formData, prof: e.target.value })}
                            required
                            className="border border-gray-300 rounded-md p-2 bg-matchaGreen-50"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Какой департамент вам интересен для участия? *</label>
                        <label className="font-bold mb-3">Подробная информация о департаментах (i)</label>
                        <div className="border border-customOrange rounded-md">
                            <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                <label className="text-gray-400">Выберите</label>
                            </div>

                        </div>
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
                    <div className="text-center pt-10">
                        <button type="submit" className="font-inter px-10 py-2 bg-customOrange text-white rounded-md hover:bg-customOrange-hover">ОТПРАВИТЬ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormVolunteer;
