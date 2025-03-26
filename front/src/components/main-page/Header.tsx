import React from "react";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <img src="/art-lab-logo.svg" alt="Art Lab Logo" width="60" height="60" />
      <LanguageSelector />
    </header>
  );
}
