import React, { useEffect, useRef, useState } from "react";
import BackButton from "./BackButton";
import Checkbox from "./Checkbox";
import DropzoneUI from "./Dropzone";
import ThankYouPage from "./ThankYouPage";
import TextInput from "./TextInput";

import { API_URL } from '../../config';
import { fetchCsrfToken } from "../../utils/fetchCsrfToken";
import { Trans, useTranslation } from "react-i18next";

function FormMaster() {
    const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        tg: '',
        email: '',
        fb: '',
        previously_participated: false,
        program_name: '',
        description: '',
        programUrl: '',
        socialUrl: '',
        quantity: '',
        time: '',
        duration: '',
        raider: '',
        additional_info: '',
        file: null as File[] | null,
    });
    const [langError, setLangError] = useState(false);
    const [directionsError, setDirectionsError] = useState(false);
    const [dateError, setDateError] = useState(false);
    // const [fileError, setFileError] = useState(false);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [csrfError, setCsrfError] = useState(false);
    const [tooLargeError, setTooLargeError] = useState(false);
    const [unknownfError, setUnknownfError] = useState(false);

    const { t } = useTranslation();
    const directionsErrorRef = useRef<HTMLDivElement>(null);
    const datesErrorRef = useRef<HTMLDivElement>(null);

    const handleCheckboxGroupChange = (e: { target: { value: any; checked: any; }; }, setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        const { value, checked } = e.target;
        if (checked) {
            setState((prev) => [...prev, value]);
        } else {
            setState((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleFilesFromDropzone = (incomingFiles: File[]) => {
        setFormData((prev) => ({
            ...prev,
            file: incomingFiles,
        }));
    };

    const submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        setCsrfError(false);
        setTooLargeError(false);
        setUnknownfError(false);

        if (selectedDirections.length === 0) {
            setDirectionsError(true);
            setIsSubmitting(false);
            directionsErrorRef.current?.focus();
            return;
        }

        if (selectedDates.length === 0) {
            setDateError(true);
            setIsSubmitting(false);
            datesErrorRef.current?.focus();
            return;
        }

        if (selectedLangs.length === 0) {
            setLangError(true);
            setIsSubmitting(false);
            return;
        }

        // if (!formData.file || formData.file.length === 0) {
        //     setFileError(true);
        //     setIsSubmitting(false);
        //     return;
        // }

        const formDataToSend = new FormData();
        formDataToSend.append("form_type", "master");
        formDataToSend.append("csrf_token", localStorage.getItem("csrfToken") || "");
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
            const response = await fetch(`${API_URL}/form/save`, {
                method: 'POST',
                headers: {
                    "X-Session-ID": localStorage.getItem("sessionId") || crypto.randomUUID(),
                },
                body: formDataToSend,
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else if (response.status === 403) {
                setCsrfError(true);
            } else if (response.status === 413) {
                setTooLargeError(true);
            } else {
                setUnknownfError(true);
                console.error('Error submitting form:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setUnknownfError(true);
        } finally {
            setIsSubmitting(false);
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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isSubmitted) {
                fetchCsrfToken().then().catch((error) => {
                    console.error("Error fetching CSRF token:", error);
                });
            }
        }, Math.floor(Math.random() * 5000));

        return () => clearTimeout(timeoutId);
    }, [isSubmitted]);

    useEffect(() => {
        if (directionsError && directionsErrorRef.current) {
            directionsErrorRef.current.focus();
        } else if (dateError && datesErrorRef.current) {
            datesErrorRef.current.focus();
        }
    }, [directionsError, dateError]);

    return (
        <div className="master-form leading-none">
            {isSubmitted ? <ThankYouPage type="master" /> : (
                <div className="max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
                    <BackButton />
                    <div className="px-8">
                        <hr className="pt-4 mt-4" />
                        <h2 className="text-2xl">{t("el.welcome-team")}</h2>
                        <h2 className="text-2xl text-customOrange">{t("el.al")}</h2>
                        <h3 className="text-lg font-bold mb-5 text-justify bg-matchaGreen-50 p-5">{t("forms.master.instruction")}</h3>
                        <h3 className="mb-5 font-inter italic">{t("forms.master.title")}</h3>
                        <form onSubmit={submitForm} className="space-y-4 font-inter">

                            <TextInput name="name" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="country" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="tg" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="email" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="fb" formData={formData} setFormData={setFormData} required={false} />

                            <div className="flex flex-col">
                                <Checkbox
                                    id="previously-participated"
                                    label={t("forms.master.previously-participated")}
                                    onChange={(checked) => {
                                        setFormData({ ...formData, previously_participated: checked });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.direction.title")} *</label>
                                {directionsError && (
                                    <div
                                        ref={directionsErrorRef}
                                        tabIndex={-1}
                                        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300"
                                    >
                                        {t("forms.master.direction-error")}
                                    </div>
                                )}
                                <div className={checkClass}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.master.change")}</label>
                                    </div>

                                    <div className={`flex flex-col gap-3 px-4 py-3 w-full bg-amber-50 ${directionsError ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
                                        {directions.map((item) => (
                                            <Checkbox
                                                key={item.id}
                                                id={item.id}
                                                label={item.label}
                                                onChange={(checked) => {
                                                    handleCheckboxGroupChange({ target: { value: item.id, checked } }, setSelectedDirections);
                                                    if (directionsError) {
                                                        setDirectionsError(false);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <TextInput name="program_name" formData={formData} setFormData={setFormData} required={true} />

                            <div className="flex flex-col">
                                <label>{t("forms.master.description-info")} *</label>
                                <label className="font-light italic">{t("forms.master.description-info-italic")}</label>
                                <textarea
                                    name="description"
                                    rows={5}
                                    value={formData?.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required={true}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.dates.title")} *</label>
                                {dateError && (
                                    <div
                                        ref={datesErrorRef}
                                        tabIndex={-1}
                                        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300"
                                    >
                                        {t("forms.master.dates-error")}
                                    </div>
                                )}
                                <div className={checkClass}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.master.change")}</label>
                                    </div>
                                    <div className={`flex flex-col gap-3 px-4 py-3 w-full bg-amber-50 ${dateError ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
                                        {dates.map((item) => (
                                            <Checkbox
                                                key={item.id}
                                                id={item.id}
                                                label={item.label}
                                                onChange={(checked) => {
                                                    handleCheckboxGroupChange({ target: { value: item.id, checked } }, setSelectedDates);
                                                    if (dateError) {
                                                        setDateError(false);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <TextInput name="programUrl" formData={formData} setFormData={setFormData} required={false} />
                            <TextInput name="socialUrl" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="quantity" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="time" formData={formData} setFormData={setFormData} required={true} />
                            <TextInput name="duration" formData={formData} setFormData={setFormData} required={true} />

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
                                            <Checkbox
                                                key={item.id}
                                                id={item.id}
                                                label={item.label}
                                                onChange={(checked) => {
                                                    handleCheckboxGroupChange({ target: { value: item.id, checked } }, setSelectedLangs);
                                                    if (langError) {
                                                        setLangError(false);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-bold leading-6">{t("forms.master.image.title")}</label>
                                <label className="font-light italic">{t("forms.master.image.description")}</label>
                                {/* {fileError && (
                                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                        {t("forms.master.image.error")}
                                    </div>
                                )} */}
                                <DropzoneUI onFilesChange={handleFilesFromDropzone} />
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        <Trans
                                            i18nKey="forms.master.image.supported"
                                            components={{
                                                a: <a className="text-blue-700 font-bold" href="https://t.me/Hridayama" target="_blank" rel="noopener noreferrer" > </a>
                                            }}
                                        />
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.raider")}</label>
                                <textarea
                                    name="raider"
                                    rows={5}
                                    value={formData?.raider}
                                    onChange={(e) => setFormData({ ...formData, raider: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.master.additional")}</label>
                                <textarea
                                    name="additional_info"
                                    rows={5}
                                    value={formData?.additional_info}
                                    onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            {csrfError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h2>{t("forms.error.csrf.title")}</h2>
                                    <h3>{t("forms.error.csrf.description")}</h3>
                                </div>
                            )}
                            {tooLargeError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h2>{t("forms.error.content-too-large.title")}</h2>
                                    <h3>
                                        <p className="pb-3">{t("forms.error.content-too-large.description")}</p>
                                        <p>
                                            <Trans
                                                i18nKey="forms.error.feedback"
                                                components={{
                                                    a: <a className="text-blue-700 font-bold" href="https://t.me/Hridayama" target="_blank" rel="noopener noreferrer" > </a>
                                                }}
                                            />
                                        </p>
                                    </h3>
                                </div>
                            )}
                            {unknownfError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h2>{t("forms.error.unknown.title")}</h2>
                                    <h3>
                                        <p className="pb-3">{t("forms.error.unknown.description")}</p>
                                        <p>
                                            <Trans
                                                i18nKey="forms.error.feedback"
                                                components={{
                                                    a: <a className="text-blue-700 font-bold" href="https://t.me/Hridayama" target="_blank" rel="noopener noreferrer" > </a>
                                                }}
                                            />
                                        </p>
                                    </h3>
                                </div>
                            )}
                        <div className="text-center pt-1">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`font-inter w-full py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-customOrange hover:bg-customOrange-hover'} text-orange-50 rounded-md `}
                            >
                                {isSubmitting ? t("forms.submitting") : t("forms.master.submit")}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
    )
}
        </div >
    );
}

export default FormMaster;
