import React from "react";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f1458f5c2f9a5a8d548c05b7c7f94fc4fc8416ab"
        alt="Art Lab Logo"
        className="w-[60px] h-[60px]"
      />
      <LanguageSelector />
    </header>
  );
}
