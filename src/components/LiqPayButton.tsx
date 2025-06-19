"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import PaymentModal from "./PaymentModal";

interface LiqPayButtonProps {
  courseType: "basic" | "advanced";
  className?: string;
  children?: React.ReactNode;
}

const LiqPayButton: React.FC<LiqPayButtonProps> = ({
  courseType,
  className,
  children,
}) => {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prices and course details
  const courseData = {
    basic: {
      price: 900,
      title:
        language === "uk"
          ? "Базовий пакет курсу макіяжу"
          : "Basic makeup course package",
    },
    advanced: {
      price: 1200,
      title:
        language === "uk"
          ? "Преміум пакет курсу макіяжу"
          : "Premium makeup course package",
    },
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpenModal} className={className}>
        {children || (language === "uk" ? "Купити" : "Buy")}
      </Button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        courseType={courseType}
        courseTitle={courseData[courseType].title}
        coursePrice={courseData[courseType].price}
      />
    </>
  );
};

export default LiqPayButton;
