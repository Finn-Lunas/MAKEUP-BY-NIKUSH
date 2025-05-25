/* src/app/[locale]/HomeClient.tsx */
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter, usePathname } from "next/navigation";

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
  Send,
  MessageCircle,
} from "lucide-react";

export default function HomeClient() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1];

  const handleLanguageChange = (locale: string) => {
    router.push(`/${locale}/`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Image
              src="https://ext.same-assets.com/3961209986/148758430.svg"
              alt="Nikoletta Martynovych Logo"
              width={200}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#"
              className="text-foreground hover:text-primary transition-colors"
            >
              Головна
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              Про автора
            </a>
            <a
              href="#courses"
              className="text-foreground hover:text-primary transition-colors"
            >
              Курси
            </a>
            <a
              href="#instagram"
              className="text-foreground hover:text-primary transition-colors"
            >
              Інстаграм
            </a>
            <a
              href="#faq"
              className="text-foreground hover:text-primary transition-colors"
            >
              Підтримка
            </a>
          </nav>

          {/* Desktop Language & Social */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLanguageChange("uk")}
              className={
                currentLocale === "uk"
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
                currentLocale === "en"
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
            <a
              href="https://t.me/+B4Vr7Qqhtto1NDE8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Send className="h-5 w-5" />
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
                    <Image
                      src="https://ext.same-assets.com/3961209986/148758430.svg"
                      alt="Nikoletta Martynovych Logo"
                      width={180}
                      height={36}
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-4">
                    <a
                      href="#"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Головна
                    </a>
                    <a
                      href="#about"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Про автора
                    </a>
                    <a
                      href="#courses"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Курси
                    </a>
                    <a
                      href="#instagram"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Інстаграм
                    </a>
                    <a
                      href="#faq"
                      className="text-lg text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Підтримка
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
                        currentLocale === "uk"
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
                        currentLocale === "en"
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
                    <a
                      href="https://t.me/+B4Vr7Qqhtto1NDE8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                    >
                      <Send className="h-5 w-5" />
                      <span>MAKE UP, GIRL!💄</span>
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
                ПЕРСОНАЛЬНИЙ САЙТ
                <br />
                НІКОЛЕТТИ МАРТИНОВИЧ
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                Хочеш навчитися робити ідеальний макіяж самостійно? Проходь
                авторські курси з макіяжу від Ніколетти Мартинович. Усі
                актуальні курси ви знайдете нижче
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 flex items-center gap-2"
                  onClick={() =>
                    window.open("https://t.me/+B4Vr7Qqhtto1NDE8", "_blank")
                  }
                >
                  <Send className="h-4 w-4" />
                  Перейти в Telegram
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
                  Перейти в Instagram
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
              ПРО АВТОРА
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
                    Lorem ipsum dolor sit amet
                  </h3>
                  <p className="text-muted-foreground">
                    Consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  02
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Ut enim ad minim veniam
                  </h3>
                  <p className="text-muted-foreground">
                    Quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea commodo consequat. Duis aute irure dolor in reprehenderit
                    in voluptate velit esse cillum dolore.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  03
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Duis aute irure dolor
                  </h3>
                  <p className="text-muted-foreground">
                    In reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  04
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Excepteur sint occaecat
                  </h3>
                  <p className="text-muted-foreground">
                    Cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum. Sed ut perspiciatis unde omnis
                    iste natus error sit voluptatem.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
                  05
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    Nemo enim ipsam voluptatem
                  </h3>
                  <p className="text-muted-foreground">
                    Quia voluptas sit aspernatur aut odit aut fugit, sed quia
                    consequuntur magni dolores eos qui ratione voluptatem sequi
                    nesciunt. Neque porro quisquam est.
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
              КУРСИ ВІД НІКОЛЕТТИ МАРТИНОВИЧ
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Твоя центрова галерея та методики
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center mb-6">
                <Image
                  src="/images/courses/cours1.jpg"
                  alt="Course Preview"
                  width={370}
                  height={460}
                  className="w-[370px] h-[460px] object-cover rounded-lg mb-4 mx-auto"
                />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Базовий авторський курс з макіяжу від Ніколетти Мартинович
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Курс містить понад 100 відеоуроків довжиною понад 18 годин. На
                  цьому курсі ви освоїте техніки нанесення професійного денного
                  та вечірнього макіяжу
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 799 грн
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Детальніше
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        Базовий авторський курс з макіяжу
                      </DialogTitle>
                      <DialogDescription>
                        Детальний опис курсу та його програм
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Що ви отримаєте:</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Понад 100 відеоуроків</li>
                          <li>Більше 18 годин навчального контенту</li>
                          <li>Техніки професійного денного макіяжу</li>
                          <li>Техніки професійного вечірнього макіяжу</li>
                          <li>Доступ до закритої спільноти</li>
                          <li>Підтримку від автора курсу</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Програма курсу:</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Базові принципи макіяжу</li>
                          <li>Підбір косметики та інструментів</li>
                          <li>Техніки нанесення тональних засобів</li>
                          <li>Корекція форми обличчя</li>
                          <li>Макияж очей та брів</li>
                          <li>Техніки нанесення помади</li>
                        </ul>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full bg-primary hover:bg-accent text-primary-foreground">
                          Купити за 799 грн
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center mb-6">
                <Image
                  src="/images/courses/cours2.jpg"
                  alt="Course Preview"
                  width={370}
                  height={460}
                  className="w-[370px] h-[460px] object-cover rounded-lg mb-4 mx-auto"
                />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Просунутий курс з макіяжу від Ніколетти Мартинович
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Поглиблений курс для тих, хто хоче досягти професійного рівня.
                  Вивчення складних технік та трендів у світі макіяжу
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 999 грн
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Детальніше
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Просунутий курс з макіяжу</DialogTitle>
                      <DialogDescription>
                        Детальний опис курсу та його програм
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Що ви отримаєте:</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Поглиблене вивчення технік макіяжу</li>
                          <li>Розбір складних випадків та особливостей</li>
                          <li>Сучасні тренди у світі макіяжу</li>
                          <li>Професійні техніки корекції обличчя</li>
                          <li>Робота з різними типами шкіри</li>
                          <li>Особливості роботи з різними віковими групами</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Програма курсу:</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Просунуті техніки нанесення макіяжу</li>
                          <li>Створення складних образів</li>
                          <li>Робота з кольором та текстурами</li>
                          <li>Спеціальні ефекти та техніки</li>
                          <li>Професійні секрети та хитрощі</li>
                          <li>Практичні завдання та розбір помилок</li>
                        </ul>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full bg-primary hover:bg-accent text-primary-foreground">
                          Купити за 999 грн
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      {/* <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-forum text-foreground mb-4">УРОКИ ВІД ОЛЕНИ КАНЕВСЬКОЇ</h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Окремі уроки з макіяжу та зачісок</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <Image
                src="https://ext.same-assets.com/3961209986/2580257363.webp"
                alt="Shine Spring Makeup"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground mb-2">SHINE SPRING MAKEUP</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Весняний, свіжий макіяж, який пасуватиме кожній
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 799 грн
                </Button>
                <Button variant="outline" className="w-full">
                  Детальніше
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <Image
                src="https://ext.same-assets.com/3961209986/3440698166.webp"
                alt="Evening Makeup"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground mb-2">EVENING MAKEUP</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Вечірній, яскравий макіяж. Ідеальний варіант для особливих подій
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 799 грн
                </Button>
                <Button variant="outline" className="w-full">
                  Детальніше
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <Image
                src="https://ext.same-assets.com/3961209986/2025796865.webp"
                alt="Insta Matte Makeup"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground mb-2">INSTA MATTE MAKEUP</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Матовий макіяж, ідеальний для фотосесій та 3 варіанти губ
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 799 грн
                </Button>
                <Button variant="outline" className="w-full">
                  Детальніше
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <Image
                src="https://ext.same-assets.com/3961209986/2533434908.webp"
                alt="Bundle Course"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Набір три уроки в одному
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  SHINE SPRING MAKEUP + EVENING MAKEUP + INSTA MATTE MAKEUP
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 1799 грн
                </Button>
                <Button variant="outline" className="w-full">
                  Детальніше
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <Image
                src="https://ext.same-assets.com/3961209986/1000281955.webp"
                alt="Video Course"
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Фото та відео весільні зачіски
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Два майстер-класи від перукарів студії. WOW ефект, який точно запам'ятається. Зачіски актуальні весь сезон
                </p>
                <Button className="w-full bg-primary hover:bg-accent text-primary-foreground mb-2">
                  Купити за 1600 грн
                </Button>
                <Button variant="outline" className="w-full">
                  Детальніше
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              Переглянути всі уроки
            </Button>
          </div>
        </div>
      </section> */}

      {/* Instagram Gallery */}
      <section id="instagram" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              INSTAGRAM НІКОЛЕТТИ МАРТИНОВИЧ
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <a
              href="https://www.instagram.com/nikush_brows"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors inline-block"
            >
              Підписуйтесь @nikush_brows
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://www.instagram.com/p/CksKiVjo6Jk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/1098469580.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/Cey1CqxoxQm/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/463543696.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/Cfj_cg8oLLJ/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/195505253.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/Cp5ll1vorrP/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/3346430325.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/Cpx-gr3I58i/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/2393534306.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/CpVu3seIFrZ/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/3737901961.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/CpLIh1nof8M/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/3100238781.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
            <a
              href="https://www.instagram.com/p/CneK2JNooBf/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://ext.same-assets.com/3961209986/2255669655.webp"
                alt="Instagram Post"
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-forum text-foreground mb-4">
              ПІДТРИМКА КЛІЄНТІВ
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-4" />
            <p className="text-muted-foreground">
              Відповіді на часті запитання
            </p>
          </div>

          <div className="space-y-4">
            <details className="bg-card border border-border rounded-lg group">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between">
                <span>Скільки часів доступ?</span>
                <span className="text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-open:max-h-[200px]">
                Доступ до курсу надається на 20 років. Ви маєте можливість
                переглядати матеріали, скільки завгодно разів, завантажувати
                методичні матеріали, отримувати оновлення курсу.
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between">
                <span>Що якщо курс?</span>
                <span className="text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-open:max-h-[200px]">
                Ми впевнені в якості наших курсів, тому надаємо гарантію
                повернення коштів протягом 14 днів з моменту покупки.
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between">
                <span>Як отримати сертифікат?</span>
                <span className="text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-open:max-h-[200px]">
                Після проходження курсу та виконання всіх завдань, ви отримаєте
                сертифікат про закінчення курсу.
              </div>
            </details>

            <details className="bg-card border border-border rounded-lg group">
              <summary className="p-6 cursor-pointer text-foreground font-medium hover:text-primary transition-colors flex items-center justify-between">
                <span>Чи потрібна мені база для проходження?</span>
                <span className="text-primary transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-muted-foreground overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-open:max-h-[200px]">
                Курси розраховані як на початківців, так і на тих, хто вже має
                базові навички. Всі техніки пояснюються детально з самого
                початку.
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
                Номер телефону
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
