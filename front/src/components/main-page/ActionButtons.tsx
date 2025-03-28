import React from "react";
import { useNavigate } from "react-router-dom";

export function ActionButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center mt-10 w-full justify-center">
      <div className="flex flex-col items-center space-y-4">
        <button
          className="px-6 py-3 w-64 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
          onClick={() => navigate("/volunteer")}
        >
          Душа фестиваля
        </button>
        <p className="text-xs">для волонтеров и организаторов</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
      <button
        // className="px-6 py-3 w-64 bg-customOrange hover:bg-customOrange-hover rounded-md text-xl"
        className="px-6 py-3 w-64 bg-customOrange-disabled rounded-md text-xl"
        onClick={() => navigate("/master")}
        disabled={true}
      >
        Сердце фестиваля
      </button>
      <p className="text-xs">для мастеров, музыкантов и артистов</p>

      </div>
    </div>
  );
}
