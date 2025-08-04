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

    if (!courseType || !price || !description || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `course_${courseType}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Current date as Unix timestamp
    const orderDate = Math.floor(Date.now() / 1000);

    // WayForPay payment data
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    // Remove trailing slash to avoid double slashes
    baseUrl = baseUrl.replace(/\/$/, "");

    const merchantDomainName = baseUrl.replace(/^https?:\/\//, "");

    // Use test credentials if not in production
    const merchantAccount =
      process.env.WAYFORPAY_MERCHANT_ACCOUNT || "test_merch_n1";
    const merchantSecretKey =
      process.env.WAYFORPAY_MERCHANT_SECRET_KEY || "flk3409refn54t54t*FNJRET";

    console.log("=== Environment Check ===");
    console.log(
      "WAYFORPAY_MERCHANT_ACCOUNT from env:",
      process.env.WAYFORPAY_MERCHANT_ACCOUNT
    );
    console.log("Using merchant account:", merchantAccount);
    console.log("Base URL:", baseUrl);
    console.log("Merchant domain:", merchantDomainName);
    console.log("Customer email:", customerEmail);
    console.log("Customer phone:", customerPhone);
    console.log("=== End Environment Check ===");

    if (!merchantAccount || !merchantSecretKey) {
      console.error("WayForPay credentials not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    const paymentData = {
      merchantAccount,
      merchantDomainName,
      authorizationType: "SimpleSignature",
      orderReference: orderId,
      orderDate,
      amount: price,
      currency: "UAH",
      productName: [description],
      productPrice: [price],
      productCount: [1],
      language: language === "uk" ? "UA" : "EN",
      serviceUrl: `${baseUrl}/api/wayforpay/callback`,
      returnUrl: `${baseUrl}/payment/success?order_id=${orderId}`,
      clientEmail: customerEmail,
      clientPhone: customerPhone || "",
    };

    // Generate signature according to WayForPay documentation
    // For purchase: merchantAccount + merchantDomainName + orderReference + orderDate + amount + currency + productName[0] + productCount[0] + productPrice[0]
    const signatureFields = [
      merchantAccount,
      merchantDomainName,
      orderId,
      orderDate.toString(),
      price.toString(),
      "UAH",
      description,
      "1",
      price.toString(),
    ];

    const signatureString = signatureFields.join(";");
    console.log("=== WayForPay Debug Info ===");
    console.log("Merchant Account:", merchantAccount);
    console.log("Merchant Domain:", merchantDomainName);
    console.log("Order ID:", orderId);
    console.log("Order Date:", orderDate);
    console.log("Amount:", price);
    console.log("Signature Fields:", signatureFields);
    console.log("Signature String:", signatureString);
    console.log(
      "Secret Key:",
      merchantSecretKey ? "***PROVIDED***" : "NOT PROVIDED"
    );

    const merchantSignature = crypto
      .createHmac("md5", merchantSecretKey)
      .update(signatureString, "utf8")
      .digest("hex");
    console.log("Generated Signature:", merchantSignature);
    console.log("=== End Debug Info ===");

    return NextResponse.json({
      ...paymentData,
      merchantSignature,
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
