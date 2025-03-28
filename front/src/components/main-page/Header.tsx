import React from "react";
import { LanguageSelector } from "./LanguageSelector";
import { Logo } from "../Svg/Logo";
export function Header() {

  return (
    <header className="flex justify-between items-center text-white">
      <a href="/"><Logo fill="white"/></a>
      <LanguageSelector />
    </header>
  );
}
