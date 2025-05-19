import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import DepartmentInfo from "./DepartmentInfo";
import ThankYouPage from "./ThankYouPage";
import { useTranslation } from "react-i18next";
import { fetchCsrfToken } from "../../utils/fetchCsrfToken";
import { API_URL } from '../../config';
import Checkbox from "./Checkbox";

function FormVolunteer() {
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        age: 0,
        social: '',
        tg: '',
        prof: '',
        conditions: '',
        experience: '',
        camping: '',
        negative: '',
        help_now: false,
        inspiration: '',
    });
    const [deptError, setDeptError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [csrfError, setCsrfError] = useState(false);
    const [tooLargeError, setTooLargeError] = useState(false);
    const [unknownfError, setUnknownfError] = useState(false);

    const { t } = useTranslation();

    const submitForm = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setCsrfError(false);
        setTooLargeError(false);
        setUnknownfError(false);

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (selectedDepartments.length === 0) {
            setDeptError(true);
            setIsSubmitting(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("form_type", "volunteer");
        formDataToSend.append("csrf_token", localStorage.getItem("csrfToken") || "");
        formDataToSend.append("data", JSON.stringify({
            ...formData,
            department: selectedDepartments,
        }));

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
            setUnknownfError(true);
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const departments = [
        { id: "admin", label: t("forms.volunteer.dept.admin") },
        { id: "promo", label: t("forms.volunteer.dept.promo") },
        { id: "art", label: t("forms.volunteer.dept.art") },
        { id: "tech", label: t("forms.volunteer.dept.tech") },
        { id: "food", label: t("forms.volunteer.dept.food") },
    ];

    const inputClass = "border border-gray-300 rounded-md p-2 bg-matchaGreen-50 mt-1";

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isSubmitted) {
                fetchCsrfToken().catch((error) => {
                    console.error("Error fetching CSRF token:", error);
                });
            }
        }, Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);

        return () => clearTimeout(timeoutId);
    }, [isSubmitted]);

    return (
        <div className="volunteer-form min-h-screen leading-none">
            {isSubmitted ? <ThankYouPage type="volunteer" /> : (
                <div className="min-h-screen max-w-lg px-4 py-4 bg-orange-50 shadow-md rounded-md">
                    <BackButton />
                    <div className="px-8">
                        <hr className="pt-4 mt-4" />
                        <h2 className="text-2xl">{t("el.welcome-team")}</h2>
                        <h2 className="text-2xl text-customOrange">{t("el.al")}</h2>
                        <h3 className="mb-5 font-inter">{t("forms.volunteer.title")}</h3>
                        <form onSubmit={submitForm} className="space-y-4 font-inter">
                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.name")} *</label>
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
                                <label>{t("forms.volunteer.age")} *</label>
                                <input
                                    type="number"
                                    name="age"
                                    min={1}
                                    max={120}
                                    value={formData?.age > 0 ? formData.age : ''}
                                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.social")} *</label>
                                <input
                                    type="text"
                                    name="social"
                                    value={formData?.social}
                                    onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                                    required
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.tg")}</label>
                                <input
                                    type="text"
                                    name="tg"
                                    value={formData?.tg}
                                    onChange={(e) => setFormData({ ...formData, tg: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.prof")}</label>
                                <input
                                    type="text"
                                    name="prof"
                                    value={formData?.prof}
                                    onChange={(e) => setFormData({ ...formData, prof: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.conditions")}</label>
                                <textarea
                                    name="conditions"
                                    value={formData?.conditions}
                                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                                    className={`${inputClass} h-32`}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.experience")}</label>
                                <textarea
                                    name="experience"
                                    value={formData?.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className={`${inputClass} h-32`}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.camping")}</label>
                                <textarea
                                    name="camping"
                                    value={formData?.camping}
                                    onChange={(e) => setFormData({ ...formData, camping: e.target.value })}
                                    className={`${inputClass} h-32`}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.dept.title")} *</label>
                                <label className="font-bold mb-3 mt-1 underline cursor-pointer" onClick={() => setIsModalOpen(true)}>
                                    {t("forms.volunteer.dept.info")}
                                    <svg className="shrink-0 inline w-4 h-4 me-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                </label>
                                {deptError && (
                                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                        {t("forms.volunteer.dept.error")} <span className="underline cursor-pointer" onClick={() => setIsModalOpen(true)}>{t("forms.volunteer.dept.err-info")}</span>
                                    </div>
                                )}
                                <div className={`flex flex-col rounded-md mt-1 ${deptError ? 'border-2 border-red-500' : 'border border-gray-300'}`}>
                                    <div className="bg-matchaGreen-50 pt-4 pl-5 pb-4">
                                        <label className="text-gray-400">{t("forms.volunteer.dept.change")}</label>
                                    </div>
                                    <div className="flex flex-col gap-3 px-4 py-3 w-full bg-amber-50">
                                        {departments.map((dept) => (
                                            <Checkbox
                                                key={dept.id}
                                                id={dept.id}
                                                label={dept.label}
                                                onChange={(checked) => {
                                                    setDeptError(false);
                                                    if (checked) {
                                                        setSelectedDepartments((prev) => [...prev, dept.id]);
                                                    } else {
                                                        setSelectedDepartments((prev) => prev.filter((item) => item !== dept.id));
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.negative")}</label>
                                <textarea
                                    name="negative"
                                    value={formData?.negative}
                                    onChange={(e) => setFormData({ ...formData, negative: e.target.value })}
                                    className={`${inputClass} h-32`}
                                    />
                            </div>

                            <div className="flex flex-col">
                                <Checkbox
                                    id="help_now"
                                    label={t("forms.volunteer.help_now")}
                                    onChange={(checked) => {
                                        setFormData({ ...formData, help_now: checked });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>{t("forms.volunteer.inspiration")}</label>
                                <textarea
                                    name="inspiration"
                                    value={formData?.inspiration}
                                    onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                                    className={`${inputClass} h-32`}
                                    />
                            </div>

                            {csrfError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h1>{t("forms.error.csrf.title")}</h1>
                                    <h2>{t("forms.error.csrf.description")}</h2>
                                </div>
                            )}
                            {tooLargeError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h1>{t("forms.error.content-too-large.title")}</h1>
                                    <h2>{t("forms.error.content-too-large.description")}</h2>
                                </div>
                            )}
                            {unknownfError && (
                                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 border border-red-300">
                                    <h1>{t("forms.error.unknown.title")}</h1>
                                    <h2>{t("forms.error.unknown.description")}</h2>
                                </div>
                            )}
                            <div className="text-center pt-1">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`font-inter w-full py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-customOrange'} text-orange-50 rounded-md hover:bg-customOrange-hover`}
                                >
                                    {isSubmitting ? 'Submitting...' : t("forms.volunteer.submit")}
                                </button>
                            </div>
                        </form>
                    </div>
                    {isModalOpen && <DepartmentInfo onClose={() => setIsModalOpen(false)} />}
                </div>
            )}
        </div>
    );
}

export default FormVolunteer;
