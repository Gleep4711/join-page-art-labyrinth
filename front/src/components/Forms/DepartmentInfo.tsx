import React from "react";
import { useTranslation } from "react-i18next";

const DepartmentInfo = ({ onClose }: { onClose: () => void }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div
                className="h-screen md:w-4/5 w-screen bg-white shadow-md rounded-md z-50 relative overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-800" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#2B3723" />
                        <path d="M11.8095 11.8095L4.19043 4.19048M11.8095 4.19048L4.19043 11.8095" stroke="#2B3723" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-1/2 flex flex-col text-center">
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">{t("department.admin.title")}</h2>
                            <h4 className="text-base text-orange-500">{t("department.admin.preparation.title")}</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                {(t("department.admin.preparation.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">{t("department.admin.festival.title")}</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                {(t("department.admin.festival.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">{t("department.tech.title")}</h2>
                            <h4 className="text-base text-orange-500">{t("department.tech.preparation.title")}</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                {(t("department.tech.preparation.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">{t("department.tech.festival.title")}</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                {(t("department.tech.festival.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col text-center">
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">{t("department.promo.title")}</h2>
                            <h4 className="text-base text-orange-500">{t("department.promo.preparation.title")}</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                {(t("department.promo.preparation.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">{t("department.promo.festival.title")}</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                {(t("department.promo.festival.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">{t("department.art.title")}</h2>
                            <h4 className="text-base text-orange-500">{t("department.art.preparation.title")}</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                {(t("department.art.preparation.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">{t("department.art.festival.title")}</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                {(t("department.art.festival.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">{t("department.food.title")}</h2>
                            <h4 className="text-base text-orange-500">{t("department.food.preparation.title")}</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                {(t("department.food.preparation.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">{t("department.food.festival.title")}</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                {(t("department.food.festival.items", { returnObjects: true }) as string[]).map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentInfo;