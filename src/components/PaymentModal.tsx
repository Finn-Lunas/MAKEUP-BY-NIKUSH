"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "./ui/toast";
import { CheckCircle, CreditCard, Mail, Phone } from "lucide-react";

// LiqPay types
declare global {
  interface Window {
    LiqPayCheckout: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseType: "basic" | "advanced";
  courseTitle: string;
  coursePrice: number;
}

interface PaymentFormData {
  email: string;
  phone: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  courseType,
  courseTitle,
  coursePrice,
}) => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [formData, setFormData] = useState<PaymentFormData>({
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [paymentData, setPaymentData] = useState<{
    data: string;
    signature: string;
  } | null>(null);
  const [paymentError, setPaymentError] = useState<boolean>(false);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);

  // Generate unique IDs for form fields
  const emailId = `payment-email-${courseType}`;
  const phoneId = `payment-phone-${courseType}`;

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.phone) {
      showToast(
        language === "uk"
          ? "Будь ласка, заповніть всі поля"
          : "Please fill in all fields",
        "error"
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast(
        language === "uk"
          ? "Введіть коректну email адресу"
          : "Please enter a valid email address",
        "error"
      );
      return false;
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast(
        language === "uk"
          ? "Введіть коректний номер телефону"
          : "Please enter a valid phone number",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Try API route first
      const response = await fetch("/api/liqpay/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseType,
          language,
          price: coursePrice,
          description: courseTitle,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("API route not available");
      }

      const { data, signature, orderId: newOrderId } = await response.json();
      setOrderId(newOrderId);
      setPaymentData({ data, signature });
      setStep("payment");
    } catch (error) {
      console.error("API route failed, using frontend fallback:", error);

      // Frontend fallback for payment creation
      try {
        const crypto = require("crypto");
        const orderId = `order_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // LiqPay credentials from environment variables
        const publicKey = process.env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY;
        const privateKey = process.env.LIQPAY_PRIVATE_KEY;

        if (!publicKey || !privateKey) {
          throw new Error("LiqPay credentials not configured");
        }

        const paymentParams = {
          public_key: publicKey,
          version: "3",
          action: "pay",
          amount: coursePrice,
          currency: "UAH",
          description: courseTitle,
          order_id: orderId,
          result_url: `${
            process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
          }payment/success`,
          server_url: `${
            process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
          }api/liqpay/callback`,
          language: language === "uk" ? "uk" : "en",
        };

        const data = Buffer.from(JSON.stringify(paymentParams)).toString(
          "base64"
        );
        const signature = crypto
          .createHash("sha1")
          .update(privateKey + data + privateKey)
          .digest("base64");

        console.log("Payment created via frontend fallback");
        setOrderId(orderId);
        setPaymentData({ data, signature });
        setStep("payment");
      } catch (fallbackError) {
        console.error("Frontend fallback also failed:", fallbackError);
        showToast(
          language === "uk"
            ? "Помилка при створенні платежу. Спробуйте ще раз."
            : "Payment creation error. Please try again.",
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    console.log("Payment successful - email will be sent via callback");
  };

  const handleClose = () => {
    // Clear LiqPay widget
    const liqpayContainer = document.getElementById("liqpay_checkout");
    if (liqpayContainer) {
      liqpayContainer.innerHTML = "";
    }

    setStep("form");
    setFormData({ email: "", phone: "" });
    setOrderId("");
    setPaymentData(null);
    setPaymentError(false);
    setWidgetLoading(false);
    onClose();
  };

  // Load LiqPay checkout script and initialize widget
  useEffect(() => {
    if (step === "payment" && paymentData) {
      // Load LiqPay script if not already loaded
      if (!window.LiqPayCheckout) {
        const script = document.createElement("script");
        script.src = "//static.liqpay.ua/libjs/checkout.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          initializeLiqPayWidget();
        };
      } else {
        initializeLiqPayWidget();
      }
    }
  }, [step, paymentData]);

  const initializeLiqPayWidget = () => {
    if (paymentData && window.LiqPayCheckout) {
      setPaymentError(false);
      setWidgetLoading(true);

      // Set timeout for widget loading
      const loadingTimeout = setTimeout(() => {
        if (widgetLoading) {
          setWidgetLoading(false);
          setPaymentError(true);
          showToast(
            language === "uk"
              ? "Час очікування завантаження віджета вичерпано. Спробуйте ще раз."
              : "Widget loading timeout. Please try again.",
            "error"
          );
        }
      }, 15000); // 15 seconds timeout

      window.LiqPayCheckout.init({
        data: paymentData.data,
        signature: paymentData.signature,
        embedTo: "#liqpay_checkout",
        mode: "embed",
      })
        .on("liqpay.callback", function (data: any) {
          clearTimeout(loadingTimeout);

          // Handle service unavailable error
          if (data.status === 503 || data.statusText === "error") {
            setPaymentError(true);
            setWidgetLoading(false);
            showToast(
              language === "uk"
                ? "Сервіс оплати тимчасово недоступний. Спробуйте пізніше."
                : "Payment service is temporarily unavailable. Please try again later.",
              "error"
            );
            return;
          }

          if (data.status === "success") {
            handlePaymentSuccess();
          }
        })
        .on("liqpay.ready", function (data: any) {
          clearTimeout(loadingTimeout);
          setWidgetLoading(false);
        })
        .on("liqpay.close", function (data: any) {
          // Widget closed
        });
    }
  };

  const retryPayment = () => {
    setPaymentError(false);
    setWidgetLoading(true);
    // Clear the container
    const liqpayContainer = document.getElementById("liqpay_checkout");
    if (liqpayContainer) {
      liqpayContainer.innerHTML = "";
    }
    // Reinitialize
    setTimeout(() => {
      initializeLiqPayWidget();
    }, 100);
  };

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {language === "uk" ? "Оформлення замовлення" : "Order Details"}
        </h3>
        <p className="text-muted-foreground">
          {courseTitle} - {coursePrice} {language === "uk" ? "грн" : "UAH"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={emailId} className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>{language === "uk" ? "Email адреса" : "Email Address"}</span>
          </Label>
          <Input
            id={emailId}
            type="email"
            placeholder={
              language === "uk" ? "your@email.com" : "your@email.com"
            }
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={phoneId} className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>{language === "uk" ? "Номер телефону" : "Phone Number"}</span>
          </Label>
          <Input
            id={phoneId}
            type="tel"
            placeholder={language === "uk" ? "+380..." : "+380..."}
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {language === "uk"
            ? "Після успішної оплати на вказану email адресу буде відправлено посилання на курс."
            : "After successful payment, a course link will be sent to the specified email address."}
        </p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          {language === "uk" ? "Скасувати" : "Cancel"}
        </Button>
        <Button
          onClick={handleProceedToPayment}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{language === "uk" ? "Обробка..." : "Processing..."}</span>
            </div>
          ) : language === "uk" ? (
            "Перейти до оплати"
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-2">
          {language === "uk" ? "Деталі замовлення:" : "Order details:"}
        </p>
        <p className="font-semibold">{courseTitle}</p>
        <p className="text-lg font-bold text-primary">
          {coursePrice} {language === "uk" ? "грн" : "UAH"}
        </p>
      </div>

      {/* LiqPay Widget Container */}
      <div
        id="liqpay_checkout"
        className="min-h-[400px] border rounded-lg flex items-center justify-center"
      >
        {paymentError ? (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {language === "uk"
                ? "Сервіс тимчасово недоступний"
                : "Service Temporarily Unavailable"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === "uk"
                ? "Сервіс оплати LiqPay тимчасово недоступний. Спробуйте ще раз через кілька хвилин."
                : "LiqPay payment service is temporarily unavailable. Please try again in a few minutes."}
            </p>
            <Button onClick={retryPayment} className="mb-2">
              {language === "uk" ? "Спробувати ще раз" : "Try Again"}
            </Button>
          </div>
        ) : widgetLoading ? (
          <div className="text-center text-muted-foreground">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>
              {language === "uk"
                ? "Завантаження форми оплати..."
                : "Loading payment form..."}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setStep("form")}
          className="flex-1"
        >
          {language === "uk" ? "Назад" : "Back"}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {language === "uk" ? "🎉 Оплата успішна!" : "🎉 Payment Successful!"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === "uk"
            ? "Дякуємо за покупку! Посилання на курс буде відправлено на вашу пошту протягом кількох хвилин."
            : "Thank you for your purchase! Course link will be sent to your email within a few minutes."}
        </p>
        {orderId && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {language === "uk" ? "Номер замовлення:" : "Order ID:"}
            </p>
            <p className="font-mono text-sm">{orderId}</p>
          </div>
        )}
      </div>
      <Button onClick={handleClose} className="w-full">
        {language === "uk" ? "Готово" : "Done"}
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "uk" ? "Оплата курсу" : "Course Payment"}
          </DialogTitle>
          <DialogDescription>
            {step === "form"
              ? language === "uk"
                ? "Заповніть контактні дані"
                : "Fill in your contact details"
              : step === "payment"
              ? language === "uk"
                ? "Оберіть зручний спосіб оплати"
                : "Choose your preferred payment method"
              : language === "uk"
              ? "Дякуємо за покупку!"
              : "Thank you for your purchase!"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && renderFormStep()}
        {step === "payment" && renderPaymentStep()}
        {step === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
