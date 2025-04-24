import React, { useState } from "react";
import BackButton from "./BackButton";
import ThankYouPage from "./ThankYouPage";
import { useTranslation } from "react-i18next";
import FileUpload from "./FileUpload";

function FormMaster() {
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        tg: '',
        email: '',
        description: '',
        programUrl: '',
        socialUrl: '',
        quantity: '',
        time: '',
        duration: '',
        raider: '',
        file: null as FileList | null,
    });
    const [langError, setLangError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const { t } = useTranslation();


    const handleCheckboxGroupChange = (e: { target: { value: any; checked: any; }; }, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const { value, checked } = e.target;
        if (checked) {
            setState((prev) => [...prev, value]);
        } else {
            setState((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleFilesSelected = (files: FileList | null) => {
        if (files) {
            setUploadedFiles(Array.from(files));
            setFormData({ ...formData, file: files });
        }
    };

    const submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("form_type", "master");
        formDataToSend.append("data", JSON.stringify({
            ...formData,
            file: undefined,
            direction: selectedDirections,
            date: selectedDates,
            lang: selectedLangs,
        }));

        if (formData.file) {
            Array.from(formData.file).forEach((file) => {
                formDataToSend.append("file", file);
            });
        }

        try {
            // const response = await fetch('/api/v1/form/save', {
            const response = await fetch('http://localhost:8000/form/save', {  // debug
                method: 'POST',
                body: formDataToSend,
            });
            if (response.ok) {
                // setIsSubmitted(true);
                setIsSubmitted(false); // debug
            } else {
                console.error('Error submitting form:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const directions = [
        { id: "concert", label: t("forms.master.direction.concert") },
        { id: "workshop", label: t("forms.master.direction.workshop") },
        { id: "lecture", label: t("forms.master.direction.lecture") },
        { id: "practice", label: t("forms.master.direction.practice") },
        { id: "performance", label: t("forms.master.direction.performance") },
        { id: "theatre", label: t("forms.master.direction.theatre") },
        { id: "lesson", label: t("forms.master.direction.lesson") },
        { id: "game", label: t("forms.master.direction.game") },
        { id: "other", label: t("forms.master.direction.other") },
    ];

    const dates = [
        { id: "10", label: t("forms.master.dates.10") },
        { id: "11", label: t("forms.master.dates.11") },
        { id: "12", label: t("forms.master.dates.12") },
        { id: "13", label: t("forms.master.dates.13") },
    ];

    const langs = [
        { id: "md", label: t("forms.master.langs.md") },
        { id: "ru", label: t("forms.master.langs.ru") },
        { id: "en", label: t("forms.master.langs.en") },
    ];

    const inputClass = "border border-gray-300 rounded-md mt-2 p-2 bg-matchaGreen-50";
    const checkClass = "flex flex-col rounded-md border border-gray-300 mt-2";

    return (
        <div className="master-form leading-none">
            {isSubmitted ? <ThankYouPage /> : (
                <div className="max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
                    <BackButton />
                    <div className="px-8">
                        <hr className="pt-4 mt-4" />
                        <h2 className="text-2xl">{t("el.welcome-team")}</h2>
                        <h2 className="text-2xl text-customOrange">{t("el.al")}</h2>
                        <h3 className="mb-5 font-inter italic">{t("forms.master.title")}</h3>
                        <form onSubmit={submitForm} className="space-y-4 font-inter">
                            <div className="flex flex-col">
                                <label>{t("forms.master.name")} *</label>
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
                                <label>{t("forms.master.country")} *</label>
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
                                <label>{t("forms.master.tg")}</label>
                                <input
                                    type="text"
                                    name="tg"
                                    value={formData?.tg}
                                    onChange={(e) => setFormData({ ...formData, tg: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.email")}</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData?.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.direction.title")}</label>
                                <div className={checkClass}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.master.change")}</label>
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
                                <label>{t("forms.master.description-info")}</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData?.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.dates.title")}</label>
                                <div className={checkClass}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.master.change")}</label>
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
                                <label>{t("forms.master.program-url")}</label>
                                <input
                                    type="text"
                                    name="programUrl"
                                    value={formData?.programUrl}
                                    onChange={(e) => setFormData({ ...formData, programUrl: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.social")} *</label>
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
                                <label>{t("forms.master.quantity")} *</label>
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
                                <label>{t("forms.master.time")} *</label>
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
                                <label>{t("forms.master.duration")} *</label>
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
                                <label>{t("forms.master.langs.title")} *</label>
                                {langError && (
                                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                        {t("forms.master.error")}
                                    </div>
                                )}
                                <div className={`flex flex-col rounded-md mt-1 ${langError ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.master.change")}</label>
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
                                <label className="font-bold leading-6">{t("forms.master.image.title")}</label>
                                <label className="font-light italic">{t("forms.master.image.description")}</label>
                                <FileUpload
                                    inputClass={inputClass}
                                    onFilesSelected={handleFilesSelected}
                                />
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-bold">{t("forms.master.image.added")}</h4>
                                        <ul className="list-disc pl-5">
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index} className="text-sm text-gray-600">
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.raider")}</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData?.raider}
                                    onChange={(e) => setFormData({ ...formData, raider: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="text-center pt-1">
                                <button type="submit" className="font-inter w-full py-3 bg-customOrange text-orange-50 rounded-md hover:bg-customOrange-hover">{t("forms.master.submit")}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormMaster;
