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
  const [paymentProcessed, setPaymentProcessed] = useState<string | null>(null);
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

  const handlePaymentSuccess = async (orderId: string, paymentData?: any) => {
    // Prevent double execution for the same order
    if (paymentProcessed === orderId) {
      console.log("🔄 Payment already processed for order:", orderId);
      return;
    }

    console.log("🎉 Payment successful! Order ID:", orderId);
    setPaymentProcessed(orderId);

    // Do not send emails from frontend. WayForPay callback will handle emails server-side.
    console.log(
      "📧 Skipping frontend email sending. Email will be sent via WayForPay callback."
    );

    setIsProcessing(false);

    // Redirect to Telegram
    try {
      const response = await fetch("/api/get-telegram-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📱 Redirecting to Telegram:", data.telegramUrl);
        setTimeout(() => {
          window.location.href = data.telegramUrl;
        }, 1000);
      } else {
        console.error("Failed to get telegram link");
      }
    } catch (error) {
      console.error("Error fetching telegram link:", error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentProcessed(null); // Reset payment processed state for new payment

    try {
      // Create payment
      const response = await fetch("/api/wayforpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseType,
          language,
          price: courseData[courseType].price,
          description: courseData[courseType].title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const paymentData = await response.json();
      console.log("💳 Payment data created:", paymentData);

      // Initialize WayForPay widget
      const script = document.createElement("script");
      script.src = "https://secure.wayforpay.com/server/pay-widget.js";
      script.async = true;
      script.onload = () => {
        try {
          const wayforpay = new (window as any).Wayforpay();

          console.log("🚀 Initializing WayForPay widget...");

          wayforpay.run(
            {
              merchantAccount: paymentData.merchantAccount,
              merchantDomainName: paymentData.merchantDomainName,
              authorizationType: paymentData.authorizationType,
              merchantSignature: paymentData.merchantSignature,
              orderReference: paymentData.orderReference,
              orderDate: paymentData.orderDate,
              amount: paymentData.amount,
              currency: paymentData.currency,
              productName: paymentData.productName,
              productPrice: paymentData.productPrice,
              productCount: paymentData.productCount,
              language: paymentData.language,
              straightWidget: true,
            },
            function (response: any) {
              // Payment approved
              console.log("✅ Payment approved:", response);
              console.log("📧 Email will be sent automatically via callback");
              handlePaymentSuccess(paymentData.orderId, response);
            },
            function (response: any) {
              // Payment declined
              console.log("❌ Payment declined:", response);
              console.error("Payment declined. Please try again.");
              setIsProcessing(false);
            },
            function (response: any) {
              // Payment pending
              console.log("⏳ Payment pending:", response);
              console.log("Payment is being processed. Please wait...");
            }
          );

          // Also listen for postMessage events
          const handleMessage = (event: MessageEvent) => {
            console.log("📬 PostMessage received:", event.data);

            if (event.data === "WfpWidgetEventApproved") {
              console.log("📧 Email will be sent automatically via callback");
              handlePaymentSuccess(paymentData.orderId, event.data);
            } else if (event.data === "WfpWidgetEventDeclined") {
              console.error("Payment declined. Please try again.");
              setIsProcessing(false);
            } else if (event.data === "WfpWidgetEventClose") {
              // User closed the popup – stop processing and re-enable the button
              console.log("🛑 WayForPay widget closed by user");
              setIsProcessing(false);
              setPaymentProcessed(null);
            } else if (
              typeof event.data === "object" &&
              event.data.transactionStatus === "Approved"
            ) {
              // Handle detailed payment data from WayForPay
              console.log(
                "📧 Payment details received from WayForPay:",
                event.data
              );
              console.log("📧 Email will be sent automatically via callback");
              handlePaymentSuccess(paymentData.orderId, event.data);
            }
          };

          window.addEventListener("message", handleMessage, false);
        } catch (error) {
          console.error("Error initializing WayForPay:", error);
          console.error("Payment system initialization error.");
          setIsProcessing(false);
        }
      };

      script.onerror = () => {
        console.error("Failed to load WayForPay script");
        console.error("Payment system loading error.");
        setIsProcessing(false);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Payment creation error:", error);
      console.error("Payment creation error. Please try again.");
      setIsProcessing(false);
    }
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
            <Button
              onClick={() => {
                setShowConfirm(false);
                handlePayment();
              }}
              disabled={isProcessing}
            >
              {language === "uk" ? "Перейти до оплати" : "Proceed to payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WayForPayButton;
