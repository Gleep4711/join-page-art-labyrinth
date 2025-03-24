import React from "react";
import { ActionButtons } from "./ActionButtons";

export function Hero() {
  return (
    <section className="flex flex-col justify-center items-center mt-20 space-y-10 text-gray-300">
      <div className="text-center space-y-4">
        <h1 className="text-2xl ">
          Форма для участия в фестивале
        </h1>
        <h2 className="text-5xl font-bold">Art Labyrinth</h2>
      </div>
      <h3 className="text-xl max-w-xl text-center">
        Прекрасно, что вы решили стать частью фестиваля Art Labyrinth! Ваше творчество и мастерство сделают это событие ярким и незабываемым
      </h3>
      <ActionButtons />
    </section>
  );
}
