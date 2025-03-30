import React, { useState } from "react";
import BackButton from "./BackButton";
import ThankYouPage from "./ThankYouPage";

function FormMaster() {
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        phone: '',
        email: '',
        description: '',
        programUrl: '',
        socialUrl: '',
        quantity: '',
        time: '',
        duration: '',
        raider: '',
    });
    const [langError, setLangError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    const handleCheckboxGroupChange = (e: { target: { value: any; checked: any; }; }, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const { value, checked } = e.target;
        if (checked) {
            setState((prev) => [...prev, value]);
        } else {
            setState((prev) => prev.filter((item) => item !== value));
        }
    };

    const submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const data = {
            ...formData,
            direction: selectedDirections,
            date: selectedDates,
            lang: selectedLangs,
        };

        if (selectedLangs.length < 1) {
            setLangError(true);
            return;
        }

        try {
            const response = await fetch('/api/v1/form/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'master', data }),
            });
            if (response.ok) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const directions = [
        { id: "concert", label: "Концерт" },
        { id: "workshop", label: "Мастер-класс" },
        { id: "lecture", label: "Лекция" },
        { id: "practice", label: "Практика" },
        { id: "performance", label: "Перформанс" },
        { id: "theatre", label: "Театральное выступление" },
        { id: "lesson", label: "Урок" },
        { id: "game", label: "Игра" },
        { id: "other", label: "Другое" },
    ];

    const dates = [
        { id: "admin", label: "10 июля (четверг)" },
        { id: "promo", label: "11 июля (пятница)" },
        { id: "art", label: "12 июля (суббота)" },
        { id: "tech", label: "13 июля (воскресенье)" },
    ];

    const langs = [
        { id: "md", label: "MD" },
        { id: "ru", label: "RU" },
        { id: "en", label: "EN" },
    ];

    const inputClass = "border border-gray-300 rounded-md p-2 bg-matchaGreen-50";

    return (
        <div className="master-form">
            {isSubmitted ? <ThankYouPage /> : (
                <div className="max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
                    <BackButton />
                    <div className="px-8">
                        <hr className="pt-4 mt-4" />
                        <h2 className="text-2xl">Добро пожаловать в команду</h2>
                        <h2 className="text-2xl text-customOrange">Art Labyrinth</h2>
                        <h3 className="mb-5 font-inter italic">Пожалуйста, заполните форму для артистов</h3>
                        <form onSubmit={submitForm} className="space-y-4 font-inter">
                            <div className="flex flex-col">
                                <label>Имя / Название группы / Псевдоним *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData?.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Ваша страна  *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData?.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Номер телефона  *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData?.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData?.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Напрвление программы</label>
                                <div className="flex flex-col rounded-md border border-gray-300">
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">Выберите</label>
                                    </div>
                                    <div className="flex flex-col gap-3 px-4 py-3 w-full bg-amber-50">
                                        {directions.map((item) => (
                                            <label key={item.id} className="flex gap-3 cursor-pointer">
                                                <div className="h-3">
                                                    <input type="checkbox" name="direction" value={item.id} onChange={(e) => handleCheckboxGroupChange(e, setSelectedDirections)} />
                                                </div>
                                                <span className="leading-4">
                                                    {item.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label>Название и описание программы *</label>
                                <label className="italic text-sm">Несколько предложений для рекламно - информационного поста о вашей культурной программе</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData?.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Возможные даты выступления</label>
                                <div className="flex flex-col rounded-md border border-gray-300">
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">Выберите</label>
                                    </div>
                                    <div className="flex flex-col gap-3 px-4 py-3 w-full bg-amber-50">
                                        {dates.map((item) => (
                                            <label key={item.id} className="flex gap-3 cursor-pointer">
                                                <div className="h-3">
                                                    <input type="checkbox" name="date" value={item.id} onChange={(e) => handleCheckboxGroupChange(e, setSelectedDates)} />
                                                </div>
                                                <span className="leading-4">
                                                    {item.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label>Ссылка на Вашу программу</label>
                                <input
                                    type="text"
                                    name="programUrl"
                                    value={formData?.programUrl}
                                    onChange={(e) => setFormData({ ...formData, programUrl: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Ccылка на Вашу соцсеть (FB/IG/Vk) *</label>
                                <input
                                    type="text"
                                    name="socialUrl"
                                    value={formData?.socialUrl}
                                    onChange={(e) => setFormData({ ...formData, socialUrl: e.target.value })}
                                    required={true}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Кол-во мероприятий *</label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={formData?.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required={true}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>В какое время Вы хотели бы выступать? *</label>
                                <input
                                    type="text"
                                    name="time"
                                    value={formData?.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required={true}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Сколько длится Ваша программа? *</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData?.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    required={true}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Язык проведения программы *</label>
                                {langError && (
                                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                        Пожалуйста, выберите язык, на котором будет проводиться ваша программа. Если вы хотите провести программу на нескольких языках, выберите все подходящие варианты.
                                    </div>
                                )}
                                <div className={`flex flex-col rounded-md ${langError ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">Выберите</label>
                                    </div>
                                    <div className="flex flex-col gap-3 px-4 py-3 w-full bg-amber-50">
                                        {langs.map((item) => (
                                            <label key={item.id} className="flex gap-3 cursor-pointer">
                                                <div className="h-3">
                                                    <input
                                                        type="checkbox"
                                                        name="lang"
                                                        value={item.id}
                                                        onChange={(e) => {
                                                            handleCheckboxGroupChange(e, setSelectedLangs);
                                                            if (langError) {
                                                                setLangError(false);
                                                            }
                                                        }} />
                                                </div>
                                                <span className="leading-4">
                                                    {item.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label>Технические и дополнительные требования </label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData?.raider}
                                    onChange={(e) => setFormData({ ...formData, raider: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="text-center pt-10">
                                <button type="submit" className="font-inter px-10 py-2 bg-customOrange text-white rounded-md hover:bg-customOrange-hover">ОТПРАВИТЬ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormMaster;
