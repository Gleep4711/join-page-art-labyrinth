import React from "react";
import { ActionButtons } from "./ActionButtons";
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col justify-center items-center mt-20 space-y-10 text-gray-300">
      <div className="text-center space-y-4">
        <h1 className="text-2xl ">{t("main-page.hero.title")}</h1>
        <h2 className="text-5xl font-bold">{t("el.al")}</h2>
      </div>
      <h3 className="text-xl max-w-xl text-center">{t("main-page.hero.description")}</h3>
      <ActionButtons />
    </section>
  );
}
