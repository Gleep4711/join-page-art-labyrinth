import React from "react";
import { useNavigate } from "react-router-dom";

export function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center mt-10 w-full justify-center">
      <div className="flex flex-col items-center space-y-4">
        <button
          className="px-6 py-3 w-40 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
          onClick={() => navigate("/volunteer")}
        >
          Душа фестиваля
        </button>
        <p className="text-xs">для волонтеров и организаторов</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
      <button
        className="px-6 py-3 w-40 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
        onClick={() => navigate("/master")}
      >
        Сердце фестиваля
      </button>
      <p className="text-xs">для мастеров, музыкантов и артистов</p>

      </div>
    </div>
  );
}
