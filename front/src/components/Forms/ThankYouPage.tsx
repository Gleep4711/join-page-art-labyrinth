import React from "react";
import { useTranslation } from "react-i18next";

interface ThankYouPageProps {
    type: string;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ type }) => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen max-w-lg py-4 bg-orange-50 shadow-md rounded-md justify-center text-center flex flex-col">
            <div className="w-1/2 mx-auto">
                <h1 className="text-4xl text-customOrange mb-4">{t("thanks.title")}</h1>
                <p className="text-gray-700 mb-4">{t("thanks.description")}</p>
                <p className="text-gray-500 mb-4 italic">{t("thanks.sign")}</p>
                <p className="text-gray-700 mb-4">{t("thanks.feedback")}</p>
                {type !== "master" ? (
                    <>
                        <p className="text-gray-700 mb-4">{t("thanks.master.general")} <a href={`https://t.me/${t("thanks.master.general_contact")}`} target="_blank" rel="noreferrer" className="underline text-blue-700 font-bold italic">@{t("thanks.master.general_contact")}</a> ({t("thanks.master.general_role")})</p>
                        <p className="text-gray-700 mb-4">{t("thanks.master.music")} <a href={`https://t.me/${t("thanks.master.music_contact")}`} target="_blank" rel="noreferrer" className="underline text-blue-700 font-bold italic">@{t("thanks.master.music_contact")}</a> ({t("thanks.master.music_role")})</p>
                    </>
                ) : (
                    <>
                        <p className="text-gray-700 mb-4">{t("thanks.volunteer.general")} <a href={`https://t.me/${t("thanks.volunteer.general_contact")}`} target="_blank" rel="noreferrer" className="underline text-blue-700 font-bold italic">@{t("thanks.volunteer.general_contact")}</a> ({t("thanks.volunteer.general_role")})</p>
                        <p><a href={`tel:${t("thanks.volunteer.phone_link")}`}>{t("thanks.volunteer.phone")}</a></p>

                    </>
                )}
            </div>
        </div>
    );
};

export default ThankYouPage;