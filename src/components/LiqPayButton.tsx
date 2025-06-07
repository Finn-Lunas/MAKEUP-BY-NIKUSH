"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

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
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  // Prices and course details
  const courseData = {
    basic: {
      price: 900,
      description: "Базовий пакет курсу макіяжу",
      descriptionEn: "Basic makeup course package",
    },
    advanced: {
      price: 1200,
      description: "Преміум пакет курсу макіяжу",
      descriptionEn: "Premium makeup course package",
    },
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Get payment data from server (with proper signature)
      const response = await fetch("/api/liqpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseType,
          language,
          price: courseData[courseType].price,
          description:
            language === "uk"
              ? courseData[courseType].description
              : courseData[courseType].descriptionEn,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const { data, signature } = await response.json();

      // Create and submit LiqPay form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.liqpay.ua/api/3/checkout";
      form.acceptCharset = "utf-8";
      form.target = "_blank"; // Open in new tab

      const dataInput = document.createElement("input");
      dataInput.type = "hidden";
      dataInput.name = "data";
      dataInput.value = data;

      const signatureInput = document.createElement("input");
      signatureInput.type = "hidden";
      signatureInput.name = "signature";
      signatureInput.value = signature;

      form.appendChild(dataInput);
      form.appendChild(signatureInput);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        language === "uk"
          ? "Помилка при переході до оплати. Спробуйте ще раз."
          : "Payment error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={className}>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>{language === "uk" ? "Обробка..." : "Processing..."}</span>
        </div>
      ) : (
        children || (language === "uk" ? "Купити" : "Buy")
      )}
    </Button>
  );
};

export default LiqPayButton;
