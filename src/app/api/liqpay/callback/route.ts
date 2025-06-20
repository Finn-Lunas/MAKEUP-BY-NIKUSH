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

    // Verify signature using environment variable
    const privateKey = process.env.LIQPAY_PRIVATE_KEY;

    if (!privateKey) {
      console.error("LiqPay private key not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

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

      // Extract email from description or info field since sender_email is not provided
      let customerEmail = paymentData.sender_email;
      if (!customerEmail && paymentData.description) {
        const emailMatch = paymentData.description.match(
          /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
        );
        customerEmail = emailMatch ? emailMatch[1] : null;
      }
      if (!customerEmail && paymentData.info) {
        const emailMatch = paymentData.info.match(
          /Email:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
        );
        customerEmail = emailMatch ? emailMatch[1] : null;
      }

      console.log(`Successful payment for ${courseType} course:`, {
        orderId: paymentData.order_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        paymentId: paymentData.payment_id,
        customerEmail: customerEmail,
        customerPhone: paymentData.sender_phone,
      });

      if (!customerEmail) {
        console.error("❌ Customer email not found in payment data");
        return NextResponse.json({ status: "Email not found" });
      }

      // Send course access email
      try {
        console.log("🔄 Attempting to send email via callback...");
        console.log("📧 Email data:", {
          customerEmail: customerEmail,
          customerPhone: paymentData.sender_phone,
          courseType,
          orderId: paymentData.order_id,
          language: paymentData.language || "uk",
        });

        const emailResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/send-course-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerEmail: customerEmail,
              customerPhone: paymentData.sender_phone,
              courseType,
              orderId: paymentData.order_id,
              language: paymentData.language || "uk",
            }),
          }
        );

        console.log("📬 Email API response status:", emailResponse.status);
        const emailResult = await emailResponse.json();
        console.log("📬 Email API response body:", emailResult);

        if (emailResponse.ok) {
          console.log("✅ Course access email sent successfully");
        } else {
          console.error("❌ Failed to send course access email");
        }
      } catch (emailError) {
        console.error("💥 Error sending course access email:", emailError);
      }

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
