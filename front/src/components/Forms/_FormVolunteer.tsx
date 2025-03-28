import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormInput } from "./_FormInput";

interface FormData {
  name: string;
  age: string;
  social: string;
  prof: string;
}

export function FormVolunteer() {
  const navigate = useNavigate();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    social: "",
    prof: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(department)) {
        return prev.filter((dep) => dep !== department);
      }
      return [...prev, department];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/form/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "volunteer",
          data: {
            ...formData,
            departments: selectedDepartments,
          },
        }),
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <FormInput
      formData={formData}
      selectedDepartments={selectedDepartments}
      onInputChange={handleInputChange}
      onDepartmentChange={handleDepartmentChange}
      onSubmit={handleSubmit}
    />
  );
}

export default FormVolunteer;
