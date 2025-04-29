import React from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../Svg/Logo";

function BackButton() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (document.referrer && new URL(document.referrer).pathname === "/") {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="flex gap-3 w-min cursor-pointer" onClick={handleBackClick}>
            <button
                className="flex gap-3 items-center text-customOrange hover:text-customOrange transition-colors"
                aria-label="Вернуться на главную страницу"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M11.6897 15.75L7.96875 12L11.6897 8.25M8.48578 12H16.0312"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21 12C21 7.03125 16.9688 3 12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12Z"
                        stroke="currentColor"
                        strokeMiterlimit="10"
                    />
                </svg>

            </button>
            <Logo width={24} height={24} fill="customOrange" />
        </div>
    );
}

export default BackButton;