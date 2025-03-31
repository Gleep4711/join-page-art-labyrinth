import React from "react";
import { useTranslation } from "react-i18next";

const ThankYouPage = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen max-w-lg py-4 bg-orange-50 shadow-md rounded-md justify-center text-center flex flex-col">
            <div className="w-1/2 mx-auto">
                <h1 className="text-4xl text-customOrange mb-4">{t("thanks.title")}</h1>
                <p className="text-gray-700 mb-4">{t("thanks.description")}</p>
                <p className="text-gray-500 italic">{t("thanks.sign")}</p>
            </div>
        </div>
    );
};

export default ThankYouPage;