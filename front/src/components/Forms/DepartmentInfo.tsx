import React from "react";

const DepartmentInfo = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
            <div
                className="h-full w-4/5 bg-white shadow-md rounded-md z-50 relative overflow-y-auto max-h-screen"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-800" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke="#2B3723" />
                        <path d="M11.8095 11.8095L4.19043 4.19048M11.8095 4.19048L4.19043 11.8095" stroke="#2B3723" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <div className="flex flex-row w-full">
                    <div className="w-1/2 flex flex-col text-center">
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">Административный Департамент</h2>
                            <h4 className="text-base text-orange-500">Подготовка фестиваля:</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                <li>Отдел кадров - поиск команды, связь с ней и её координация</li>
                                <li>Создание групп, мероприятий</li>
                                <li>Уведомление властей, (документы и разрешения)</li>
                                <li>Сбор средств до фестиваля и во время мероприятия</li>
                                <li>Поиск спонсоров</li>
                                <li>Написание грантов</li>
                                <li>Бухгалтерия</li>
                                <li>Изготовление кулонов</li>
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">На фестивале:</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                <li>Логистика (организация транспорта)</li>
                                <li>Вэлком центр</li>
                                <li>Инфоцентр</li>
                                <li>Охрана общественного порядка на фестивале (Дружинники)</li>
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">Технический Департамент</h2>
                            <h4 className="text-base text-orange-500">Подготовка фестиваля:</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                <li>Планирование объектов</li>
                                <li>Написание технического плана</li>
                                <li>Закупка материала</li>
                                <li>Разработка оформления и декора</li>
                                <li>Подготовка строительного материала</li>
                                <li>План и подготовка электрификации</li>
                                <li>План и подготовка водопровода</li>
                                <li>Сбор инвентаря</li>
                                <li>Погрузка и транспортировка всего инвентаря</li>
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">На фестивале:</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                <li>Строительство объектов </li>
                                <li>Оформление</li>
                                <li>Электрификация всего фестиваля</li>
                                <li>Водопровод</li>
                                <li>Организация сбора мусора</li>
                                <li>Вывоз мусора</li>
                                <li>Техническое обслуживание всех объектов </li>
                                <li>Сборы и демонтаж фестиваля</li>
                                <li>Хранение</li>
                            </ul>
                        </div>
                    </div>


                    <div className="w-1/2 flex flex-col text-center">
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">Рекламный Департамент</h2>
                            <h4 className="text-base text-orange-500">Подготовка фестиваля:</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                <li>Разработка рекламной стратегии</li>
                                <li>Создание групп, мероприятий</li>
                                <li>Ведение сайта</li>
                                <li>Написание, оформление постов</li>
                                <li>Перевод на румынский и английский</li>
                                <li>Публикация постов</li>
                                <li>Продвижение рекламы</li>
                                <li>Связь с масс медиа</li>
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">На фестивале:</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                <li>Логистика (организация транспорта)</li>
                                <li>Вэлком центр</li>
                                <li>Инфоцентр</li>
                                <li>Охрана общественного порядка на фестивале (Дружинники)</li>
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">Культурный Департамент</h2>
                            <h4 className="text-base text-orange-500">Подготовка фестиваля:</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                <li>Формирование концепции культурной программы</li>
                                <li>Планирование тайминга</li>
                                <li>Поиск и связь с артистами</li>
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">На фестивале:</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                <li>Координация артистов до и на фестивале</li>
                                <li>Организация детской площадки</li>
                                <li>Организация звука</li>
                            </ul>
                        </div>
                        <div className="border border-matchaGreen p-8">
                            <h2 className="text-xl font-bold">Общепит</h2>
                            <h4 className="text-base text-orange-500">Подготовка фестиваля:</h4>
                            <ul className="list-disc list-inside mt-1 text-left text-sm">
                                <li>Планирование всего общепита</li>
                                <li>Меню </li>
                                <li>Технический план </li>
                                <li>Подготовка и закупка инвентаря </li>
                                <li>Сбор команды </li>
                                <li>Закупка продуктов </li>
                            </ul>
                            <h4 className="text-base text-orange-500 my-1">На фестивале:</h4>
                            <ul className="list-disc list-inside text-left text-sm">
                                <li>Функционирование кухни на фестивале</li>
                                <li>Снабжение продуктами</li>
                                <li>Сборы</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentInfo;