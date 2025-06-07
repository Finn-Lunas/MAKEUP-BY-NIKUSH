import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseType, language, price, description } = body;

    if (!courseType || !price || !description) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // LiqPay keys - in production, these should be in environment variables
    const publicKey =
      process.env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY || "sandbox_i12840188914";
    const privateKey =
      process.env.LIQPAY_PRIVATE_KEY ||
      "sandbox_dHdSc98t7X6sBFALLaAbEYLRxpQCVl8QMRHuPWh7";

    // Generate unique order ID
    const orderId = `course_${courseType}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // LiqPay payment data
    const paymentData = {
      public_key: publicKey,
      version: "3",
      action: "pay",
      amount: price,
      currency: "UAH",
      description: description,
      order_id: orderId,
      language: language === "uk" ? "uk" : "en",
      server_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      }/api/liqpay/callback`,
      result_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      }/payment/success?order_id=${orderId}`,
      // Optional: Add customer info if needed
      // sender_phone: "",
      // sender_email: "",
    };

    // Encode data to base64
    const data = Buffer.from(JSON.stringify(paymentData)).toString("base64");

    // Generate signature using SHA-1
    const signString = privateKey + data + privateKey;
    const signature = crypto
      .createHash("sha1")
      .update(signString)
      .digest("base64");

    console.log("Payment created:", {
      orderId,
      courseType,
      amount: price,
      currency: "UAH",
    });

    return NextResponse.json({
      data,
      signature,
      orderId,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
