import React from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import back_main_page from "../../assets/back_main_page.jpg";

export default function LandingPage() {
  return (
    <main
      className="overflow-hidden relative w-full min-h-screen"
      style={{
        backgroundImage: `url(${back_main_page})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 px-12 py-10 max-md:px-8 max-sm:px-5 h-full flex flex-col bg-black bg-opacity-50 min-h-screen">
        <Header />
        <Hero />
      </div>
    </main>
  );
}
