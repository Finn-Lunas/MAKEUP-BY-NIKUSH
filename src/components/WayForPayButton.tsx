"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface WayForPayButtonProps {
  courseType: "basic" | "advanced";
  className?: string;
  children?: React.ReactNode;
}

const WayForPayButton: React.FC<WayForPayButtonProps> = ({
  courseType,
  className,
  children,
}) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handlePayment = () => {
    setIsProcessing(true);

    // Hosted payment pages mapping
    const hostedPaymentUrls: Record<string, string> = {
      basic: "https://secure.wayforpay.com/payment/basic-course-package",
      advanced: "https://secure.wayforpay.com/payment/premium-course-package",
    };

    const directUrl = hostedPaymentUrls[courseType];
    if (directUrl) {
      setShowConfirm(false);
      // Immediate redirect to hosted WayForPay payment page
      window.location.href = directUrl;
      return;
    }

    console.error("Hosted payment URL is not configured for:", courseType);
    setIsProcessing(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirm(true)}
        className={className}
        disabled={isProcessing}
      >
        {isProcessing
          ? language === "uk"
            ? "Обробка..."
            : "Processing..."
          : children || (language === "uk" ? "Купити" : "Buy")}
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {language === "uk"
                ? "Підтвердження оплати"
                : "Payment confirmation"}
            </DialogTitle>
            <DialogDescription>
              {language === "uk"
                ? "Після успішної оплати вас автоматично перенаправить у Telegram-канал з курсом. Також на вашу пошту прийде чек з посиланням на канал, щоб ви не загубили його."
                : "After a successful payment you'll be automatically redirected to the Telegram channel with the course. A receipt with the link will also be sent to your email so you don't lose it."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-2">
              {courseData[courseType].title} — {courseData[courseType].price}{" "}
              {language === "uk" ? "грн" : "UAH"}
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {language === "uk"
                  ? "Оплата відбувається на захищеній платіжній сторінці WayForPay."
                  : "Payment is processed on WayForPay's secure payment page."}
              </li>
              <li>
                {language === "uk"
                  ? "Не закривайте сайт під час оплати — після успіху відбудеться авто-перенаправлення."
                  : "Please don't close the site during payment — after success you'll be auto-redirected."}
              </li>
              <li>
                {language === "uk"
                  ? "Квитанція з посиланням на Telegram буде відправлена на вказаний email."
                  : "A receipt with the Telegram link will be sent to your email."}
              </li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isProcessing}
            >
              {language === "uk" ? "Скасувати" : "Cancel"}
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
              {language === "uk" ? "Перейти до оплати" : "Proceed to payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WayForPayButton;
