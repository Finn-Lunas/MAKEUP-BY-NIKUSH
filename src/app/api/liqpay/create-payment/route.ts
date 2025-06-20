import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseType,
      language,
      price,
      description,
      customerEmail,
      customerPhone,
    } = body;

    if (
      !courseType ||
      !price ||
      !description ||
      !customerEmail ||
      !customerPhone
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // LiqPay keys from environment variables
    const publicKey = process.env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY;
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      console.error("LiqPay credentials not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

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
      description: `${description} | ${customerEmail}`,
      order_id: orderId,
      language: language === "uk" ? "uk" : "en",
      server_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      }api/liqpay/callback`,
      result_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
      }payment/success?order_id=${orderId}`,
      // Add customer info
      sender_email: customerEmail,
      sender_phone: customerPhone,
      // Additional info that should be visible in payment details
      info: `Email: ${customerEmail} | Tel: ${customerPhone}`,
    };

    // Encode data to base64
    const data = Buffer.from(JSON.stringify(paymentData)).toString("base64");

    // Generate signature using SHA-1
    const signString = privateKey + data + privateKey;
    const signature = crypto
      .createHash("sha1")
      .update(signString)
      .digest("base64");

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
