import React from "react";
import { useNavigate } from "react-router-dom";

interface FormInputProps {
  formData: {
    name: string;
    age: string;
    social: string;
    prof: string;
  };
  selectedDepartments: string[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onDepartmentChange: (department: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  formData,
  selectedDepartments,
  onInputChange,
  onDepartmentChange,
  onSubmit,
}) => {
  const navigate = useNavigate();

  const departments = [
    { id: "admin", label: "Административный" },
    { id: "promo", label: "Рекламный" },
    { id: "art", label: "Культурный" },
    { id: "tech", label: "Технический" },
    { id: "catering", label: "Общепит" },
  ];

  return (
    <div className="flex bg-stone-50 min-h-screen">
      <div className="flex flex-1 max-md:flex-col">
        <div className="p-11 w-[432px] max-md:w-full max-sm:p-5">
          <button
            onClick={() => navigate("/")}
            className="flex gap-3 items-center mb-10 text-orange-500 hover:text-orange-600 transition-colors"
            aria-label="Вернуться на главную страницу"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6897 15.75L7.96875 12L11.6897 8.25M8.48578 12H16.0312"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12C21 7.03125 16.9688 3 12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12Z"
                stroke="currentColor"
                strokeMiterlimit="10"
              />
            </svg>
          </button>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="text-xl leading-6">
                <span className="text-zinc-900">
                  Добро пожаловать в команду{" "}
                </span>
                <span className="text-orange-500">Art Labyrinth</span>
              </div>
              <div className="text-sm leading-4 text-black text-opacity-70">
                Пожалуйста, заполните форму для волонтеров
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm leading-4 text-zinc-900">
                  Имя, фамилия *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                  className="w-full h-[30px] rounded-md border bg-stone-400 bg-opacity-30 border-stone-400 border-opacity-30 px-2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm leading-4 text-zinc-900">
                  Возраст *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={onInputChange}
                  required
                  className="w-full h-[30px] rounded-md border bg-stone-400 bg-opacity-30 border-stone-400 border-opacity-30 px-2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm leading-4 text-zinc-900">
                  Ccылка на вашу соцсеть (FB/IG/Vk) *
                </label>
                <input
                  type="text"
                  name="social"
                  value={formData.social}
                  onChange={onInputChange}
                  required
                  className="w-full h-[30px] rounded-md border bg-stone-400 bg-opacity-30 border-stone-400 border-opacity-30 px-2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm leading-4 text-zinc-900">
                  Ваша профессия *
                </label>
                <input
                  type="text"
                  name="prof"
                  value={formData.prof}
                  onChange={onInputChange}
                  required
                  className="w-full h-[30px] rounded-md border bg-stone-400 bg-opacity-30 border-stone-400 border-opacity-30 px-2"
                />
              </div>

              <div className="flex flex-col gap-5 py-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm leading-4 text-zinc-900">
                    Какой департамент Вам интересен для участия? *
                  </label>
                  <div className="flex gap-1 items-end">
                    <div className="text-sm font-semibold text-zinc-900">
                      Подробная информация о департаментах
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.77509 7.575L9.01259 3.3375C9.11259 3.2375 9.22926 3.1875 9.36259 3.1875C9.49592 3.1875 9.61259 3.2375 9.71259 3.3375C9.81259 3.4375 9.86259 3.55633 9.86259 3.694C9.86259 3.83167 9.81259 3.95033 9.71259 4.05L5.12509 8.65C5.02509 8.75 4.90842 8.8 4.77509 8.8C4.64176 8.8 4.52509 8.75 4.42509 8.65L2.27509 6.5C2.17509 6.4 2.12709 6.28133 2.13109 6.144C2.13509 6.00667 2.18726 5.88783 2.28759 5.7875C2.38792 5.68717 2.50676 5.63717 2.64409 5.6375C2.78142 5.63783 2.90009 5.68783 3.00009 5.7875L4.77509 7.575Z"
                        fill="#F07B17"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col gap-2.5 px-4 py-3 w-full bg-amber-50 rounded-md border border-orange-500">
                    {departments.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex gap-2.5 items-center cursor-pointer"
                      >
                        <div
                          className={`w-3 h-3 rounded-sm border ${
                            selectedDepartments.includes(dept.id)
                              ? "bg-stone-400 border-stone-400"
                              : "border-stone-400"
                          }`}
                          onClick={() => onDepartmentChange(dept.id)}
                        >
                          {selectedDepartments.includes(dept.id) && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.77509 7.575L9.01259 3.3375C9.11259 3.2375 9.22926 3.1875 9.36259 3.1875C9.49592 3.1875 9.61259 3.2375 9.71259 3.3375C9.81259 3.4375 9.86259 3.55633 9.86259 3.694C9.86259 3.83167 9.81259 3.95033 9.71259 4.05L5.12509 8.65C5.02509 8.75 4.90842 8.8 4.77509 8.8C4.64176 8.8 4.52509 8.75 4.42509 8.65L2.27509 6.5C2.17509 6.4 2.12709 6.28133 2.13109 6.144C2.13509 6.00667 2.18726 5.88783 2.28759 5.7875C2.38792 5.68717 2.50676 5.63717 2.64409 5.6375C2.78142 5.63783 2.90009 5.68783 3.00009 5.7875L4.77509 7.575Z"
                                fill="#FFFEF3"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm leading-4 text-zinc-900">
                          {dept.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-2.5 mt-9 text-sm leading-4 text-amber-50 bg-orange-500 rounded border border-black border-opacity-30 hover:bg-orange-600 transition-colors"
              >
                ОТПРАВИТЬ
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 max-md:h-[400px] max-sm:h-[300px]">
          <img
            src="/images/volunteer-background.jpg"
            alt="Art Labyrinth Festival"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
