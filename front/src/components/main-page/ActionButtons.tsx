import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function ActionButtons() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center mt-10 w-full justify-center">
      <div className="flex flex-col items-center space-y-4 pb-5">
        <button
          className="px-6 py-3 w-64 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
          onClick={() => navigate("/volunteer")}
        >
          {t("main-page.buttons.volunteer.text")}
        </button>
        <p className="text-xs">{t("main-page.buttons.volunteer.description")}</p>
      </div>
      <div className="flex flex-col items-center space-y-4 pb-5">
        <button
          className="px-6 py-3 w-64 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
          onClick={() => navigate("/master")}
        >
          {t("main-page.buttons.master.text")}
        </button>
        <p className="text-xs">{t("main-page.buttons.master.description")}</p>
      </div>
    </div>
  );
}
