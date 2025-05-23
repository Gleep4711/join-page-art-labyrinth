import React from "react";
import { useTranslation } from "react-i18next";

export default function TextInput({ name, formData, setFormData, required }: { name: string, formData: any, setFormData: (data: any) => void, required?: boolean }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col">
            <label>{t("forms.master." + name)} *</label>
            <input
                type="text"
                name={name}
                value={formData?.[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                required={required}
                className="border border-gray-300 rounded-md mt-2 p-2 bg-matchaGreen-50"
            />
        </div>
    );
};
