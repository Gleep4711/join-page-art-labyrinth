import React from "react";
import { useNavigate } from "react-router-dom";

function FormMaster({ formData, handleInputChange, handleSubmit }) {
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/form/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formType: 'master', formData }),
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <button onClick={() => navigate("/")} className="text-blue-500 hover:text-blue-700">
                &lt;&lt;&lt; Назад
            </button>
            <h1 className="text-2xl font-bold mb-4">Форма подачи заявки на фестиваль</h1>
            <form onSubmit={submitForm} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium">Направление программы:</label>
                    <input
                        type="text"
                        name="programDirection"
                        value={formData?.programDirection}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Описание программы:</label>
                    <textarea
                        name="programDescription"
                        value={formData?.programDescription}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="font-medium">Даты проведения мероприятия:</label>
                    <input
                        type="text"
                        name="eventDates"
                        value={formData?.eventDates}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                    Отправить
                </button>
            </form>
        </div>
    );
}

export default FormMaster;
