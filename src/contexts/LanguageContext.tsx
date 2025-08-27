"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ukTranslations from "../translations/uk.json";
import enTranslations from "../translations/en.json";

type Language = "uk" | "en";
type Translations = typeof ukTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  uk: ukTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("uk");

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["uk", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (translationKey: string): string => {
    const keys = translationKey.split(".");
    let value: Record<string, unknown> | string = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k] as Record<string, unknown> | string;
      } else {
        return translationKey; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : translationKey;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
