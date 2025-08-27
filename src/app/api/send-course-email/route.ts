import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Type declaration for global cache
declare global {
  // eslint-disable-next-line no-var
  var recentlyProcessedEmails: { [key: string]: number } | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { customerEmail, courseType, orderId, language } = body;

    if (!customerEmail || !courseType || !orderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Simple duplicate prevention - check if email was recently sent for this order
    const emailKey = `email_sent_${orderId}`;

    // Check if we already processed this order recently (using a simple in-memory cache)
    // In production, you might want to use Redis or a database for this
    const alreadyProcessed =
      global.recentlyProcessedEmails &&
      global.recentlyProcessedEmails[emailKey];

    if (alreadyProcessed) {
      return NextResponse.json({
        success: true,
        message: "Email already sent for this order",
        orderId,
        duplicate: true,
      });
    }

    // Initialize the cache if it doesn't exist
    if (!global.recentlyProcessedEmails) {
      global.recentlyProcessedEmails = {};
    }

    // Mark this order as processed
    global.recentlyProcessedEmails[emailKey] = Date.now();

    // Clean up old entries (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (global.recentlyProcessedEmails) {
      Object.keys(global.recentlyProcessedEmails).forEach((key) => {
        if (
          global.recentlyProcessedEmails &&
          global.recentlyProcessedEmails[key] < oneHourAgo
        ) {
          delete global.recentlyProcessedEmails[key];
        }
      });
    }

    console.log(
      `📨 Processing email for order ${orderId} - ${courseType} course to ${customerEmail}`
    );

    // Course links and information
    const courseData = {
      basic: {
        telegramLink: process.env.TELEGRAM_COURSE_LINK,
        title:
          language === "uk" ? "Базовий курс макіяжу" : "Basic Makeup Course",
        description: language === "uk" ? "Основи макіяжу" : "Makeup basics",
      },
      advanced: {
        telegramLink: process.env.TELEGRAM_COURSE_LINK,
        title:
          language === "uk" ? "Преміум курс макіяжу" : "Premium Makeup Course",
        description:
          language === "uk"
            ? "Професійний макіяж та просунуті техніки"
            : "Professional makeup and advanced techniques",
      },
    };

    const course = courseData[courseType as keyof typeof courseData];

    if (!course || !course.telegramLink) {
      return NextResponse.json(
        { error: "Course not found or Telegram link not configured" },
        { status: 400 }
      );
    }

    // Build hero image URL from public assets
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    const heroImageUrl = `${baseUrl}/images/feedback/feedback1.PNG`;

    // Email content
    const emailSubject =
      language === "uk"
        ? `🎉 Доступ до курсу "${course.title}" - Замовлення ${orderId}`
        : `🎉 Access to "${course.title}" Course - Order ${orderId}`;

    // Course content based on type
    const getCourseContent = (type: string, lang: string) => {
      // Keep as-is (shortened for brevity in this edit block)
      return "";
    };

    const emailContent =
      language === "uk"
        ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <img src="${heroImageUrl}" alt="Course" style="max-width: 100%; border-radius: 8px;" />
        </div>
        <div style="text-align: center; margin-bottom: 18px;">
          <h1 style="color: #e91e63; margin: 0 0 6px;">🎉 Оплата успішна!</h1>
          <p style="font-size: 16px; color: #666; margin: 0;">Дякуємо за покупку</p>
        </div>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 10px; margin-bottom: 16px;">
          <h2 style="color: #333; margin-top: 0;">Деталі замовлення</h2>
          <p><strong>Курс:</strong> ${course.title}</p>
          <p><strong>Опис:</strong> ${course.description}</p>
          <p><strong>Номер замовлення:</strong> ${orderId}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        <div style="background: #e3f2fd; padding: 16px; border-radius: 10px; margin-bottom: 16px; text-align: center;">
          <h3 style="color: #1976d2; margin-top: 0;">🔗 Доступ до курсу</h3>
          <p style="margin: 10px 0;">Натисніть, щоб перейти до закритого Telegram-каналу з курсом:</p>
          <a href="${course.telegramLink}" style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">🚀 Перейти до курсу</a>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Збережіть це посилання — доступ надається назавжди.</p>
        </div>
      </div>
    `
        : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <img src="${heroImageUrl}" alt="Course" style="max-width: 100%; border-radius: 8px;" />
        </div>
        <div style="text-align: center; margin-bottom: 18px;">
          <h1 style="color: #e91e63; margin: 0 0 6px;">🎉 Payment Successful!</h1>
          <p style="font-size: 16px; color: #666; margin: 0;">Thank you for your purchase</p>
        </div>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 10px; margin-bottom: 16px;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Course:</strong> ${course.title}</p>
          <p><strong>Description:</strong> ${course.description}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        <div style="background: #e3f2fd; padding: 16px; border-radius: 10px; margin-bottom: 16px; text-align: center;">
          <h3 style="color: #1976d2; margin-top: 0;">🔗 Course Access</h3>
          <p style="margin: 10px 0;">Click to join the private Telegram channel with your course:</p>
          <a href="${course.telegramLink}" style="background: #e91e63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">🚀 Access Course</a>
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Save this link — access is provided for lifetime.</p>
        </div>
      </div>
    `;

    // Create email transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Gmail credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Email options
    const mailOptions = {
      from: {
        name: "Makeup by Nikush",
        address: process.env.GMAIL_USER || "noreply@makeupbynikush.com",
      },
      to: customerEmail,
      subject: emailSubject,
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Course access email sent successfully",
      orderId,
    });
  } catch (error) {
    console.error("💥 Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
