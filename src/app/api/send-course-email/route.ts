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

    // Email content
    const emailSubject =
      language === "uk"
        ? `🎉 Доступ до курсу "${course.title}" - Замовлення ${orderId}`
        : `🎉 Access to "${course.title}" Course - Order ${orderId}`;

    // Course content based on type
    const getCourseContent = (type: string, lang: string) => {
      if (type === "basic") {
        return lang === "uk"
          ? `
          <h3 style="color: #f57c00; margin-top: 0;">Що на тебе чекає?</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>✨ Денний макіяж</strong> – легкий, природний, підкреслює твою красу.</p>
            <p style="margin: 8px 0; color: #666;"><strong>✨ Вечірній макіяж з акцентом на очі</strong> – стрілки, виразний, ефектний, ідеальний для особливих подій.</p>
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Покрокові відеоуроки з детальними поясненнями</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Розбір кистей та базові рекомендації по косметиці</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Презентація про підготовку шкіри</p>
          </div>
        `
          : `
          <h3 style="color: #f57c00; margin-top: 0;">✨ What awaits you?</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>✨ Day makeup</strong> – light, natural, highlights your beauty.</p>
            <p style="margin: 8px 0; color: #666;"><strong>✨ Evening makeup with eye focus</strong> - eyeliner, expressive, spectacular, perfect for special events.</p>
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Step-by-step video tutorials with detailed explanations</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Brush analysis and basic cosmetics recommendations</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Skin preparation presentation</p>
          </div>
        `;
      } else {
        return lang === "uk"
          ? `
          <h3 style="color: #f57c00; margin-top: 0;">Що на тебе чекає?</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>✨ Денний макіяж</strong> – легкий, природний, підкреслює твою красу.</p>
            <p style="margin: 8px 0; color: #666;"><strong>✨ Вечірній макіяж з акцентом на очі</strong> – стрілки, виразний, ефектний, ідеальний для особливих подій.</p>
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Покрокові відеоуроки з детальними поясненнями</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Розбір кистей та базові рекомендації по косметиці</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Презентація про підготовку шкіри</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Розбір твоєї косметички + персональні рекомендації та підтримка</p>
          </div>
        `
          : `
          <h3 style="color: #f57c00; margin-top: 0;">What awaits you?</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>✨ Day makeup</strong> – light, natural, highlights your beauty.</p>
            <p style="margin: 8px 0; color: #666;"><strong>✨ Evening makeup with eye focus</strong> - eyeliner, expressive, spectacular, perfect for special events.</p>
          </div>
          <div style="margin-top: 20px;">
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Step-by-step video tutorials with detailed explanations</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Brush analysis and basic cosmetics recommendations</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Skin preparation presentation</p>
            <p style="margin: 8px 0; color: #666;"><strong>✔️</strong> Analysis of your makeup bag + personal recommendations and support</p>
          </div>
        `;
      }
    };

    const emailContent =
      language === "uk"
        ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e91e63; margin-bottom: 10px;">🎉 Вітаємо з покупкою!</h1>
          <p style="font-size: 18px; color: #666;">Дякуємо за довіру</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Деталі замовлення:</h2>
          <p><strong>Курс:</strong> ${course.title}</p>
          <p><strong>Опис:</strong> ${course.description}</p>
          <p><strong>Номер замовлення:</strong> ${orderId}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #1976d2; margin-top: 0;">🔗 Доступ до курсу:</h3>
          <p>Натисніть на посилання нижче, щоб приєднатися до закритого Telegram каналу з курсом:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${course.telegramLink}" 
               style="background: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🚀 Перейти до курсу
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            <strong>Важливо:</strong> Зберігайте це посилання! Доступ до курсу надається назавжди.
          </p>
        </div>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          ${getCourseContent(courseType, language)}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666;">Питання? Пишіть в Telegram: <a href="https://t.me/nikush_brows">@nikush_brows</a></p>
          <p style="color: #999; font-size: 12px;">З повагою, команда Makeup by Nikush</p>
        </div>
      </div>
    `
        : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e91e63; margin-bottom: 10px;">🎉 Congratulations on your purchase!</h1>
          <p style="font-size: 18px; color: #666;">Thank you for your trust</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Order Details:</h2>
          <p><strong>Course:</strong> ${course.title}</p>
          <p><strong>Description:</strong> ${course.description}</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #1976d2; margin-top: 0;">🔗 Course Access:</h3>
          <p>Click the link below to join the private Telegram channel with your course:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${course.telegramLink}" 
               style="background: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              🚀 Access Course
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            <strong>Important:</strong> Save this link! Course access is provided for lifetime.
          </p>
        </div>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          ${getCourseContent(courseType, language)}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666;">Questions? Message us on Telegram: <a href="https://t.me/nikush_brows">@nikush_brows</a></p>
          <p style="color: #999; font-size: 12px;">Best regards, Makeup by Nikush team</p>
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
