"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
    console.log("🎉 Payment successful! Order ID:", orderId);
    console.log("📧 Payment data received:", paymentData);

    // Use email from payment data (should be the one we sent to WayForPay)
    const emailToUse = paymentData?.email || userEmail;
    const phoneToUse = paymentData?.phone || userPhone;

    console.log("📧 Using email:", emailToUse);
    console.log("📞 Using phone:", phoneToUse);

    // Send email with course access
    if (emailToUse) {
      try {
        console.log("📧 Sending course access email...");
        const emailResponse = await fetch("/api/send-course-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: emailToUse,
            customerPhone: phoneToUse,
            courseType: orderId.split("_")[1],
            orderId: orderId,
            language: language,
          }),
        });

        if (emailResponse.ok) {
          console.log("✅ Email sent successfully!");
        } else {
          console.error("❌ Failed to send email");
        }
      } catch (error) {
        console.error("💥 Error sending email:", error);
      }
    }

    // Reset form and close modal
    setShowEmailForm(false);
    setIsProcessing(false);
    setUserEmail("");
    setUserPhone("");

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

    try {
      // Create payment with user email and phone
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
          customerEmail: userEmail,
          customerPhone: userPhone,
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
              clientEmail: paymentData.clientEmail,
              clientPhone: paymentData.clientPhone,
              straightWidget: true,
            },
            function (response: any) {
              // Payment approved
              console.log("✅ Payment approved:", response);
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
              handlePaymentSuccess(paymentData.orderId);
            } else if (event.data === "WfpWidgetEventDeclined") {
              console.error("Payment declined. Please try again.");
              setIsProcessing(false);
            } else if (
              typeof event.data === "object" &&
              event.data.transactionStatus === "Approved"
            ) {
              // Handle detailed payment data from WayForPay
              console.log(
                "📧 Payment details received from WayForPay:",
                event.data
              );
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

  const handleEmailFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail && userEmail.includes("@")) {
      handlePayment();
    }
  };

  return (
    <>
      <Dialog open={showEmailForm} onOpenChange={setShowEmailForm}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setShowEmailForm(true)}
            className={className}
            disabled={isProcessing}
          >
            {isProcessing
              ? language === "uk"
                ? "Обробка..."
                : "Processing..."
              : children || (language === "uk" ? "Купити" : "Buy")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {language === "uk"
                ? "Підтвердіть ваші дані"
                : "Confirm your details"}
            </DialogTitle>
            <DialogDescription>
              {language === "uk"
                ? "Введіть ваш email та телефон для отримання доступу до курсу"
                : "Enter your email and phone to receive course access"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "uk" ? "Email адреса" : "Email address"}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  language === "uk" ? "ваш@email.com" : "your@email.com"
                }
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === "uk" ? "Номер телефону" : "Phone number"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={language === "uk" ? "+380..." : "+380..."}
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!userEmail || !userEmail.includes("@") || isProcessing}
            >
              {isProcessing
                ? language === "uk"
                  ? "Обробка..."
                  : "Processing..."
                : language === "uk"
                ? "Перейти до оплати"
                : "Proceed to Payment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WayForPayButton;
