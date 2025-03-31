import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ru", label: "Ru" },
    { code: "md", label: "Ro" },
    { code: "en", label: "En" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-[88px] focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <svg
          width="88"
          height="44"
          viewBox="0 0 88 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex p-[10px_20px] justify-center items-center gap-[8px] w-full rounded-[4px] relative"
        >
          <text
            fill="#FFF9EC"
            xmlSpace="preserve"
            style={{ whiteSpace: "pre" }}
            fontFamily="Inter"
            fontSize="20"
            letterSpacing="0em"
          >
            <tspan x="20.293" y="29.2727">
              {currentLang.label}
            </tspan>
          </text>
          <path d="M53 16H68L60.5 28L53 16Z" fill="#FFF9EC"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-orange-50 rounded-md shadow-lg z-50">
          {languages
            .filter((lang) => lang.code !== i18n.language)
            .map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="gap-2 px-5 py-2.5 w-full text-xl leading-6 text-center text-orange-500 rounded hover:bg-orange-50 transition-colors duration-200"
                role="menuitem"
              >
                {lang.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
