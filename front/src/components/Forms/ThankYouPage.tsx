import React from "react";

const ThankYouPage = () => {
    return (
        <div className="min-h-screen max-w-lg py-4 bg-orange-50 shadow-md rounded-md justify-center text-center flex flex-col">
            <div className="w-1/2 mx-auto">
                <h1 className="text-4xl text-customOrange mb-4">Спасибо!</h1>
                <p className="text-gray-700 mb-4">в ближайшее время с вами свяжется координатор</p>
                <p className="text-gray-500 italic">Команда Art Labyrinth</p>
            </div>
        </div>
    );
};

export default ThankYouPage;