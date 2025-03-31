import React from "react";
import { LanguageSelector } from "./LanguageSelector";
import { Logo } from "../Svg/Logo";
export function Header() {

  return (
    <header className="flex justify-between items-center text-orange-50">
      <a href="/"><Logo fill="#FFF9EC"/></a>
      <LanguageSelector />
    </header>
  );
}
