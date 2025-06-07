"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Button } from "../../../components/ui/button";
import { CheckCircle, MessageCircle, Phone, Mail } from "lucide-react";

export default function PaymentSuccessPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const contactInfo = {
    telegram: "@nikush_brows",
    phone: "+380673456789", // Replace with actual phone
    email: "nikush@example.com", // Replace with actual email
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {language === "uk"
            ? "🎉 Оплата пройшла успішно!"
            : "🎉 Payment Successful!"}
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          {language === "uk"
            ? "Дякуємо за покупку курсу! Незабаром ви отримаете доступ до навчальних матеріалів."
            : "Thank you for purchasing the course! You will receive access to the learning materials shortly."}
        </p>

        {/* Order Info */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500">
              {language === "uk" ? "Номер замовлення:" : "Order ID:"}
            </p>
            <p className="font-mono text-sm text-gray-900">{orderId}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === "uk" ? "Що далі?" : "What's Next?"}
          </h2>

          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                1
              </span>
              <p className="text-gray-700">
                {language === "uk"
                  ? "Протягом 15 хвилин ви отримаєте повідомлення з посиланням на закритий Telegram-канал"
                  : "Within 15 minutes you will receive a message with a link to the private Telegram channel"}
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                2
              </span>
              <p className="text-gray-700">
                {language === "uk"
                  ? "У каналі ви знайдете всі відеоуроки та додаткові матеріали"
                  : "In the channel you will find all video tutorials and additional materials"}
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                3
              </span>
              <p className="text-gray-700">
                {language === "uk"
                  ? "Почніть навчання у зручний для вас час - доступ назавжди!"
                  : "Start learning at your convenient time - lifetime access!"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === "uk"
              ? "Питання? Зв'яжіться зі мною:"
              : "Questions? Contact me:"}
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://t.me/${contactInfo.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram
              </Button>
            </a>

            <a href={`tel:${contactInfo.phone}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                <Phone className="w-4 h-4 mr-2" />
                {language === "uk" ? "Телефон" : "Phone"}
              </Button>
            </a>

            <a href={`mailto:${contactInfo.email}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <a href="/">
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              {language === "uk" ? "Повернутися на головну" : "Back to Home"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
