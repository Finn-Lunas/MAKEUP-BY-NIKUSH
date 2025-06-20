"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "../contexts/LanguageContext";
import ukTranslations from "../translations/uk.json";
import enTranslations from "../translations/en.json";
import LiqPayButton from "../components/LiqPayButton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Instagram,
  Phone,
  Mail,
  Menu,
  X,
  Palette,
  MessageCircle,
  Heart,
  Play,
  Image as ImageIcon,
} from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBeforeAfter1, setShowBeforeAfter1] = useState(false);
  const [showBeforeAfter2, setShowBeforeAfter2] = useState(false);
  const [showVideo1, setShowVideo1] = useState(false);
  const [showVideo2, setShowVideo2] = useState(false);
  const [imageLoading1, setImageLoading1] = useState(false);
  const [imageLoading2, setImageLoading2] = useState(false);
  const [videoLoading1, setVideoLoading1] = useState(false);
  const [videoLoading2, setVideoLoading2] = useState(false);
  const [videoProgress1, setVideoProgress1] = useState(0);
  const [videoProgress2, setVideoProgress2] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  const translations = language === "uk" ? ukTranslations : enTranslations;

  const handleLanguageChange = (locale: "uk" | "en") => {
    setLanguage(locale);
  };

  // Preload videos on component mount
  useEffect(() => {
    const preloadVideo = (src: string) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = src;
      // Don't add to DOM, just preload
    };

    // Preload both videos
    preloadVideo("/images/courses/video/cours1.mp4");
    preloadVideo("/images/courses/video/cours2.mp4");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-primary" />
              <span className="text-xl font-forum text-foreground font-semibold">
                Nikoletta Martynovych
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </a>
            <a
              href="#courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.courses")}
            </a>
            <a
              href="#instagram"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.instagram")}
            </a>
            <a
              href="#testimonials"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.testimonials")}
            </a>
            <a
              href="#faq"
              className="text-foreground hover:text-primary transition-colors"
            >
              {t("nav.support")}
            </a>
          </nav>

          {/* Desktop Language & Social */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLanguageChange("uk")}
              className={
                language === "uk"
                  ? "bg-primary/90 text-primary-foreground hover:bg-primary/90"
                  : ""
              }
            >
              Укр
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLanguageChange("en")}
              className={
                language === "en"
                  ? "bg-primary/90 text-primary-foreground hover:bg-primary/90"
                  : ""
              }
            >
              Eng
            </Button>
            <a
              href="https://www.instagram.com/nikush_brows"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Відкрити меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Меню навігації</SheetTitle>
                <SheetDescription className="sr-only">
                  Меню навігації сайту з посиланнями на основні розділи та
                  контактною інформацією
                </SheetDescription>
                <div className="flex flex-col space-y-6">
                  {/* Logo */}
                  <div className="pb-3 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-6 w-6 text-primary" />
                      <span className="text-lg font-forum text-foreground font-semibold">
                        Nikoletta Martynovych
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    <a
                      href="#"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.home")}
                    </a>
                    <a
                      href="#about"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.about")}
                    </a>
                    <a
                      href="#courses"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.courses")}
                    </a>
                    <a
                      href="#instagram"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.instagram")}
                    </a>
                    <a
                      href="#testimonials"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.testimonials")}
                    </a>
                    <a
                      href="#faq"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("nav.support")}
                    </a>
                  </nav>

                  {/* Language Options */}
                  <div className="flex space-x-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLanguageChange("uk");
                        setIsOpen(false);
                      }}
                      className={
                        language === "uk"
                          ? "bg-primary/90 text-primary-foreground hover:bg-primary/90"
                          : ""
                      }
                    >
                      Укр
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLanguageChange("en");
                        setIsOpen(false);
                      }}
                      className={
                        language === "en"
                          ? "bg-primary/90 text-primary-foreground hover:bg-primary/90"
                          : ""
                      }
                    >
                      Eng
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-col space-y-4">
                    <a
                      href="https://www.instagram.com/nikush_brows"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>@nikush_brows</span>
                    </a>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <a
                      href="tel:+380950704117"
                      className="flex items-center space-x-3 group hover:text-primary transition-colors"
                    >
                      <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        +38 (095) 070 4117
                      </span>
                    </a>
                    <a
                      href="mailto:nikalengyel@gmail.com"
                      className="flex items-center space-x-3 group hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        nikalengyel@gmail.com
                      </span>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4.5xl lg:text-6xl font-forum text-foreground mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 flex items-center gap-2"
                  onClick={() => {
                    const coursesSection = document.getElementById("courses");
                    coursesSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Palette className="h-4 w-4" />
                  {t("hero.cta.contact")}
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 flex items-center gap-2"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/nikush_brows",
                      "_blank"
                    )
                  }
                >
                  <Instagram className="h-4 w-4" />
                  {t("hero.cta.portfolio")}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero/Hero.JPG"
              alt="Hero"
              width={375}
              height={500}
              className="w-full h-auto object-cover rounded-lg max-h-[550px] max-w-[390px]"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              {t("about.title")}
            </h2>
            <div className="w-24 h-px bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="overflow-hidden">
              <Carousel />
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  01
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    {t("about.sections.intro")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  02
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    {t("about.sections.philosophy")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.description2")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  03
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    {t("about.sections.studio")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.description3")}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  04
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    {t("about.sections.principles")}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.description4")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Palette className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("about.experience.years")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("about.experience.certified")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    {t("about.experience.clients")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("about.experience.techniques")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Signup Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              {t("courses.title")}
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t("courses.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-medium text-foreground mb-4">
                  {t("courses.description")}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("courses.description2")}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("courses.description3")}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="space-y-6">
                <div className="text-left">
                  <h4 className="text-xl font-medium text-foreground mb-4">
                    {t("courses.general.what_awaits")}
                  </h4>
                  <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
                    {t("courses.general.makeup_types")}
                  </p>
                </div>

                <div>
                  <ul className="space-y-2">
                    {translations.courses.general.features.map(
                      (feature, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-muted-foreground"
                        >
                          <span className="text-primary mt-1">✔️</span>
                          <span>{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="space-y-2 text-foreground">
                  <p className="flex items-center space-x-2">
                    <span className="text-primary">✅</span>
                    <span>{t("courses.general.format")}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-primary">✅</span>
                    <span>{t("courses.general.access")}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-medium text-foreground mb-4">
                    {t("courses.general.pricing_title")}
                  </h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-start space-x-2">
                      <span className="text-primary">💄</span>
                      <span>{t("courses.general.basic_pricing")}</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <span className="text-primary">💄</span>
                      <span>{t("courses.general.advanced_pricing")}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Section Title */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-forum text-foreground mb-4">
              {t("courses.course_section_title")}
            </h3>
            <div className="w-16 h-px bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center mb-6">
                <div className="relative h-96 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/courses/cours1.jpg"
                    alt="Course Preview"
                    width={370}
                    height={460}
                    className="w-full h-full object-cover"
                  />
                  {/* Before/After button - left corner */}
                  <button
                    onClick={() => {
                      setImageLoading1(true);
                      setShowBeforeAfter1(true);
                    }}
                    className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/80 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {t("courses.basic.beforeAfter")}
                    </span>
                  </button>
                  {/* Video button - right corner */}
                  <button
                    onClick={() => {
                      setVideoLoading1(true);
                      setShowVideo1(true);
                    }}
                    className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-3 rounded-lg flex items-center space-x-2 hover:bg-primary transition-colors shadow-lg"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {t("courses.basic.title")}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t("courses.basic.description")}
                </p>
                <LiqPayButton
                  courseType="basic"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2"
                >
                  {t("courses.basic.cta")}
                </LiqPayButton>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {t("courses.basic.details")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {t("courses.basic.popup.title")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("courses.basic.popup.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          {t("courses.basic.popup.whatYouGet")}
                        </h4>
                        <ul className="list-none space-y-2 text-muted-foreground">
                          {translations.courses.basic.popup.features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <span className="text-primary mt-1">✔️</span>
                                <span>{feature}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="p-4 bg-secondary/20 rounded-lg">
                        <p className="text-foreground">
                          {t("courses.basic.popup.bonus")}
                        </p>
                      </div>
                      <div className="pt-4">
                        <LiqPayButton
                          courseType="basic"
                          className="w-full bg-primary hover:bg-accent text-primary-foreground"
                        >
                          {t("courses.basic.cta")}
                        </LiqPayButton>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center mb-6">
                <div className="relative h-96 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src="/images/courses/cours2.jpg"
                    alt="Course Preview"
                    width={370}
                    height={460}
                    className="w-full h-full object-cover"
                  />
                  {/* Before/After button - left corner */}
                  <button
                    onClick={() => {
                      setImageLoading2(true);
                      setShowBeforeAfter2(true);
                    }}
                    className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/80 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {t("courses.advanced.beforeAfter")}
                    </span>
                  </button>
                  {/* Video button - right corner */}
                  <button
                    onClick={() => {
                      setVideoLoading2(true);
                      setShowVideo2(true);
                    }}
                    className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-3 rounded-lg flex items-center space-x-2 hover:bg-primary transition-colors shadow-lg"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  {t("courses.advanced.title")}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t("courses.advanced.description")}
                </p>
                <LiqPayButton
                  courseType="advanced"
                  className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2"
                >
                  {t("courses.advanced.cta")}
                </LiqPayButton>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {t("courses.advanced.details")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {t("courses.advanced.popup.title")}
                      </DialogTitle>
                      <DialogDescription>
                        {t("courses.advanced.popup.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          {t("courses.advanced.popup.whatYouGet")}
                        </h4>
                        <ul className="list-none space-y-2 text-muted-foreground">
                          {translations.courses.advanced.popup.features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2"
                              >
                                <span className="text-primary mt-1">✨</span>
                                <span>{feature}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="pt-4">
                        <LiqPayButton
                          courseType="advanced"
                          className="w-full bg-primary hover:bg-accent text-primary-foreground"
                        >
                          {t("courses.advanced.cta")}
                        </LiqPayButton>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section id="instagram" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              {t("instagram.title")}
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <a
              href="https://www.instagram.com/nikush_brows"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors inline-block"
            >
              {t("instagram.follow")}
            </a>
          </div>

          <div className="columns-2 md:columns-4 gap-4 space-y-4">
            <a
              href="https://www.instagram.com/p/DJ9mgDvo5xM/?igsh=ZTdsN2U0ZDcyY290"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady1.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DJcejMEoggP/?igsh=MWoybnZzaGUxeWFzbg%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady2.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DHbv2acorSk/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady3.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DHk3guDovWT/?img_index=1"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady4.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DF2ZewQoWH5/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady5.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DC4sDu8INKL/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady6.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DCCUD0KIQ1O/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady7.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/DBbIIoUIV5A/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 break-inside-avoid"
            >
              <Image
                src="/images/instaram/lady8.jpg"
                alt="Instagram Post"
                width={300}
                height={400}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-secondary/20 relative">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              {t("testimonials.title")}
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">
              {t("testimonials.subtitle")}
            </p>
            <p className="text-foreground font-medium">
              {t("testimonials.description")}
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
              {translations.testimonials.feedback.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 group flex items-center justify-center"
                >
                  <div className="relative overflow-hidden w-full">
                    <Image
                      src={feedback.image}
                      alt={feedback.alt}
                      width={500}
                      height={600}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-sm">
                      💕
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-3 rounded-full border border-primary/20">
              <span className="text-2xl">🌟</span>
              <span className="text-foreground font-medium">
                {t("testimonials.cta")}
              </span>
              <span className="text-2xl">🌟</span>
            </div>
          </div>

          {/* Decorative Hearts - More Centered */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-primary/20 text-4xl animate-pulse hidden lg:block">
            💖
          </div>
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-primary/20 text-4xl animate-pulse hidden lg:block">
            💕
          </div>
          <div className="absolute left-1/4 top-32 text-primary/20 text-3xl animate-pulse hidden lg:block">
            ✨
          </div>
          <div className="absolute right-1/4 top-32 text-primary/20 text-3xl animate-pulse hidden lg:block">
            🥰
          </div>
          <div className="absolute left-1/3 bottom-24 text-primary/20 text-3xl animate-pulse hidden lg:block">
            💫
          </div>
          <div className="absolute right-1/3 bottom-24 text-primary/20 text-3xl animate-pulse hidden lg:block">
            🌸
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              {t("faq.title")}
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t("faq.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.beginner.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.beginner.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.products.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.products.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.minimal.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.minimal.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.duration.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.duration.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.access.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.access.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.premium.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.premium.answer")}
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group overflow-hidden">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between list-none">
                <span>{t("faq.questions.delivery.question")}</span>
                <span className="text-primary transition-transform duration-300 ease-in-out group-open:rotate-45 text-xl">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground transition-all duration-500 ease-in-out">
                {t("faq.questions.delivery.answer")}
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <a
              href="tel:+380950704117"
              className="space-y-4 group hover:text-primary transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {t("contact.phone.title")}
              </h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">
                +38 (095) 070 4117
              </p>
            </a>
            <a
              href="mailto:nikalengyel@gmail.com"
              className="space-y-4 group hover:text-primary transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                Email
              </h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">
                nikalengyel@gmail.com
              </p>
            </a>
            <a
              href="https://www.instagram.com/nikush_brows"
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-4 group hover:text-primary transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Instagram className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                Instagram
              </h3>
              <p className="text-muted-foreground group-hover:text-primary transition-colors">
                @nikush_brows
              </p>
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-sm">
              © 2025 Nikoletta Martynovych | Персональний сайт Ніколетти
              Мартинович
            </p>
          </div>
        </div>
      </footer>

      {/* Before/After Modal 1 */}
      <Dialog
        open={showBeforeAfter1}
        onOpenChange={(open) => {
          setShowBeforeAfter1(open);
          if (!open) setImageLoading1(false);
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 border-0 ring-0 outline-none focus:outline-none focus:ring-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Фото до та після</DialogTitle>
          <div className="relative">
            {/* Skeleton loader */}
            {imageLoading1 && (
              <div className="w-full h-[400px] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex flex-col items-center space-y-4 z-10">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="text-center space-y-2">
                    <p className="text-slate-600 font-medium">
                      {language === "uk"
                        ? "Завантаження фото..."
                        : "Loading photo..."}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {language === "uk"
                        ? "Зачекайте, будь ласка"
                        : "Please wait"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Image
              src="/images/courses/after1.jpg"
              alt="Before and After"
              width={600}
              height={400}
              className={`w-full h-auto object-cover rounded-lg transition-opacity duration-300 ${
                imageLoading1 ? "opacity-0 absolute" : "opacity-100"
              }`}
              onLoadStart={() => setImageLoading1(true)}
              onLoad={() => setImageLoading1(false)}
              onError={() => setImageLoading1(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Before/After Modal 2 */}
      <Dialog
        open={showBeforeAfter2}
        onOpenChange={(open) => {
          setShowBeforeAfter2(open);
          if (!open) setImageLoading2(false);
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 border-0 ring-0 outline-none focus:outline-none focus:ring-0 bg-transparent shadow-none">
          <DialogTitle className="sr-only">Фото до та після</DialogTitle>
          <div className="relative">
            {/* Skeleton loader */}
            {imageLoading2 && (
              <div className="w-full h-[400px] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex flex-col items-center space-y-4 z-10">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="text-center space-y-2">
                    <p className="text-slate-600 font-medium">
                      {language === "uk"
                        ? "Завантаження фото..."
                        : "Loading photo..."}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {language === "uk"
                        ? "Зачекайте, будь ласка"
                        : "Please wait"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Image
              src="/images/courses/after2.jpg"
              alt="Before and After"
              width={600}
              height={400}
              className={`w-full h-auto object-cover rounded-lg transition-opacity duration-300 ${
                imageLoading2 ? "opacity-0 absolute" : "opacity-100"
              }`}
              onLoadStart={() => setImageLoading2(true)}
              onLoad={() => setImageLoading2(false)}
              onError={() => setImageLoading2(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal 1 */}
      <Dialog
        open={showVideo1}
        onOpenChange={(open) => {
          setShowVideo1(open);
          if (!open) {
            setVideoLoading1(false);
            setVideoProgress1(0);
          }
        }}
      >
        <DialogContent
          style={{ maxWidth: 275 }}
          className="p-0 border-0 bg-transparent shadow-none ring-0 outline-none overflow-hidden"
        >
          <DialogTitle className="sr-only">Відео курсу</DialogTitle>
          <div className="relative">
            {/* Video Skeleton loader */}
            {videoLoading1 && (
              <div className="w-full aspect-video max-h-[70vh] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex flex-col items-center space-y-4 z-10 p-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    {/* Play icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary/60" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-slate-600 font-medium text-sm">
                      {language === "uk"
                        ? "Підвантаження відео..."
                        : "Loading video..."}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {language === "uk"
                        ? "Готуємо відео у високій якості"
                        : "Preparing high quality video"}
                    </p>
                    {/* Progress bar */}
                    <div className="w-32 mx-auto">
                      <div className="w-full bg-slate-300 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${videoProgress1}%` }}
                        ></div>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        {Math.round(videoProgress1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <video
              controls
              preload="metadata"
              muted
              autoPlay
              playsInline
              loop
              className={`w-full h-auto rounded-lg max-h-[70vh] object-contain transition-opacity duration-300 ${
                videoLoading1 ? "opacity-0 absolute" : "opacity-100"
              }`}
              onLoadStart={() => {
                setVideoLoading1(true);
                setVideoProgress1(0);
              }}
              onProgress={(e) => {
                const video = e.target as HTMLVideoElement;
                if (video.buffered.length > 0) {
                  const progress =
                    (video.buffered.end(0) / video.duration) * 100;
                  setVideoProgress1(Math.min(progress, 100));
                }
              }}
              onCanPlay={() => setVideoLoading1(false)}
              onError={() => setVideoLoading1(false)}
              onLoadedData={() => {
                setVideoLoading1(false);
                setVideoProgress1(100);
              }}
            >
              <source src="/images/courses/video/cours1.mp4" type="video/mp4" />
              Ваш браузер не підтримує відтворення відео.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal 2 */}
      <Dialog
        open={showVideo2}
        onOpenChange={(open) => {
          setShowVideo2(open);
          if (!open) {
            setVideoLoading2(false);
            setVideoProgress2(0);
          }
        }}
      >
        <DialogContent
          style={{ maxWidth: 275 }}
          className="p-0 border-0 bg-transparent shadow-none ring-0 outline-none overflow-hidden"
        >
          <DialogTitle className="sr-only">Відео курсу</DialogTitle>
          <div className="relative">
            {/* Video Skeleton loader */}
            {videoLoading2 && (
              <div className="w-full aspect-video max-h-[70vh] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="flex flex-col items-center space-y-4 z-10 p-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    {/* Play icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary/60" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-slate-600 font-medium text-sm">
                      {language === "uk"
                        ? "Підвантаження відео..."
                        : "Loading video..."}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {language === "uk"
                        ? "Готуємо відео у високій якості"
                        : "Preparing high quality video"}
                    </p>
                    {/* Progress bar */}
                    <div className="w-32 mx-auto">
                      <div className="w-full bg-slate-300 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${videoProgress2}%` }}
                        ></div>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        {Math.round(videoProgress2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <video
              controls
              preload="metadata"
              muted
              autoPlay
              playsInline
              loop
              className={`w-full h-auto rounded-lg max-h-[70vh] object-contain transition-opacity duration-300 ${
                videoLoading2 ? "opacity-0 absolute" : "opacity-100"
              }`}
              onLoadStart={() => {
                setVideoLoading2(true);
                setVideoProgress2(0);
              }}
              onProgress={(e) => {
                const video = e.target as HTMLVideoElement;
                if (video.buffered.length > 0) {
                  const progress =
                    (video.buffered.end(0) / video.duration) * 100;
                  setVideoProgress2(Math.min(progress, 100));
                }
              }}
              onCanPlay={() => setVideoLoading2(false)}
              onError={() => setVideoLoading2(false)}
              onLoadedData={() => {
                setVideoLoading2(false);
                setVideoProgress2(100);
              }}
            >
              <source src="/images/courses/video/cours2.mp4" type="video/mp4" />
              Ваш браузер не підтримує відтворення відео.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------- Carousel -------------------- */
function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  const autoplay = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(autoplay, 2500);
    return () => clearInterval(id);
  }, [emblaApi, autoplay]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {[
          "/images/about/portrait1.jpg",
          "/images/about/portrait2.jpg",
          "/images/about/portrait3.jpg",
          "/images/about/portrait4.jpg",
        ].map((src) => (
          <div key={src} className="flex-[0_0_100%] min-w-0 px-2">
            <Image
              src={src}
              alt="Portrait"
              width={500}
              height={600}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
