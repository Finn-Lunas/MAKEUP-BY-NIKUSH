import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = formData.get("data") as string;
    const signature = formData.get("signature") as string;

    if (!data || !signature) {
      console.error("Missing data or signature");
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Verify signature
    const privateKey =
      process.env.LIQPAY_PRIVATE_KEY ||
      "sandbox_dHdSc98t7X6sBFALLaAbEYLRxpQCVl8QMRHuPWh7";
    const expectedSignature = crypto
      .createHash("sha1")
      .update(privateKey + data + privateKey)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Decode payment data
    const paymentData = JSON.parse(Buffer.from(data, "base64").toString());

    console.log("Payment callback received:", paymentData);

    // Process successful payment
    if (paymentData.status === "success" || paymentData.status === "sandbox") {
      // Extract course information from order_id
      const orderId = paymentData.order_id;
      const courseType = orderId.split("_")[1]; // Extract course type from order_id

      // Here you would typically:
      // 1. Save payment info to database
      // 2. Grant access to the course
      // 3. Send confirmation email
      // 4. Add user to Telegram channel

      console.log(`Successful payment for ${courseType} course:`, {
        orderId: paymentData.order_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        paymentId: paymentData.payment_id,
      });

      // TODO: Implement your business logic here
      // Examples:
      // - await savePaymentToDatabase(paymentData);
      // - await grantCourseAccess(paymentData.sender_phone, courseType);
      // - await sendConfirmationEmail(paymentData);
      // - await addToTelegramChannel(paymentData.sender_phone);

      return NextResponse.json({ status: "OK" });
    } else {
      console.log("Payment not successful:", paymentData.status);
      return NextResponse.json({ status: "Payment not successful" });
    }
  } catch (error) {
    console.error("Callback processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
