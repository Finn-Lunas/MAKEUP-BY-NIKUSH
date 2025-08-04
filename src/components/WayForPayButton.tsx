"use client";

import React from "react";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

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

  const handlePaymentSuccess = async (orderId: string) => {
    console.log("🎉 Payment successful! Order ID:", orderId);

    // Try to get telegram link and redirect
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

        // Automatic redirect without alert
        setTimeout(() => {
          window.location.href = data.telegramUrl;
        }, 1000);
      } else {
        console.error("Failed to get telegram link");
        console.log(
          "✅ Payment successful! Course link will be sent to email."
        );
      }
    } catch (error) {
      console.error("Error fetching telegram link:", error);
      console.log("✅ Payment successful! Course link will be sent to email.");
    }
  };

  const handlePayment = async () => {
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
          // We'll collect email and phone from WayForPay widget
          customerEmail: "customer@example.com", // Temporary, will be replaced by WayForPay
          customerPhone: "+380000000000", // Temporary, will be replaced by WayForPay
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
              handlePaymentSuccess(paymentData.orderId);
            },
            function (response: any) {
              // Payment declined
              console.log("❌ Payment declined:", response);
              console.error("Payment declined. Please try again.");
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
              handlePaymentSuccess(paymentData.orderId);
            } else if (event.data === "WfpWidgetEventDeclined") {
              console.error("Payment declined. Please try again.");
            }
          };

          window.addEventListener("message", handleMessage, false);
        } catch (error) {
          console.error("Error initializing WayForPay:", error);
          console.error("Payment system initialization error.");
        }
      };

      script.onerror = () => {
        console.error("Failed to load WayForPay script");
        console.error("Payment system loading error.");
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Payment creation error:", error);
      console.error("Payment creation error. Please try again.");
    }
  };

  return (
    <Button onClick={handlePayment} className={className}>
      {children || (language === "uk" ? "Купити" : "Buy")}
    </Button>
  );
};

export default WayForPayButton;
