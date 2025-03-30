import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";

function FormVolunteer() {
    const navigate = useNavigate();
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [formData, setFormData] = useState({ name: '', age: 0, social: '', prof: '' });

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
        const data = {
            ...formData,
            department: selectedDepartments,
        };

        if (formData.name.length < 3 || formData.name.length > 50) {
            alert('Пожалуйста, введите корректное имя.');
            return;
        }
        if (formData.age < 1 || formData.age > 120) {
            alert('Пожалуйста, введите корректный возраст.');
            return;
        }
        if (formData.prof.length < 2 || formData.prof.length > 144) {
            alert('Пожалуйста, введите корректную профессию.');
            return;
        }
        if (selectedDepartments.length < 1) {
            alert('Пожалуйста, выберите департамент.');
            return;
        }

        try {
            const response = await fetch('/api/v1/form/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({type: 'volunteer', data}),
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const departments = [
        { id: "admin", label: "Административный" },
        { id: "promo", label: "Рекламный" },
        { id: "art", label: "Культурный" },
        { id: "tech", label: "Технический" },
        { id: "catering", label: "Общепит" },
    ];

    return (
        <div className="h-full max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
            <BackButton />
            <div className="px-8">
                <hr className="pt-4 mt-4" />
                <h2 className="text-2xl">Добро пожаловать в команду</h2>
                <h2 className="text-2xl text-customOrange">Art Labyrinth</h2>
                <h3 className="mb-5 font-inter">Пожалуйста, заполните форму для волонтеров</h3>
                <form onSubmit={submitForm} className="space-y-4 font-inter">
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
                            value={formData?.age > 0 ? formData.age : ''}
                            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                            required
                            className="border border-gray-300 rounded-md p-2 bg-matchaGreen-50"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Ссылка на вашу соцсеть (FB/IG/Vk) *</label>
                        <input
                            type="text"
                            name="social"
                            value={formData?.social}
                            onChange={(e) => setFormData({ ...formData, social: e.target.value })}
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
                        <div className="flex flex-col rounded-md border border-orange-500">
                            <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                <label className="text-gray-400">Выберите</label>
                            </div>
                            <div className="flex flex-col gap-3 px-4 py-3 w-full bg-amber-50">
                                {departments.map((dept) => (
                                    <label key={dept.id} className="flex gap-3 cursor-pointer">
                                        <div className="h-3">
                                            <input type="checkbox" name="department" value={dept.id} onChange={handleCheckboxChange} />
                                        </div>
                                        <span className="leading-4">
                                            {dept.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
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
