import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    // Перевіряємо що orderId передано
    if (!orderId) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Тут можна додати додаткову перевірку статусу платежу в LiqPay API
    // Поки що просто повертаємо посилання, бо статус вже перевірено в callback

    const telegramUrl = process.env.TELEGRAM_COURSE_LINK;

    if (!telegramUrl) {
      return Response.json(
        { error: "Telegram link not configured" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      telegramUrl: telegramUrl,
    });
  } catch (error) {
    console.error("Error getting telegram link:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
