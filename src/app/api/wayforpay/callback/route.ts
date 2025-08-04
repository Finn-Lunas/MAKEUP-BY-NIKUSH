import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    console.log("=== WayForPay Callback Received ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Content-Type:", request.headers.get("content-type"));
    console.log("User-Agent:", request.headers.get("user-agent"));
    console.log("Origin:", request.headers.get("origin"));

    let body: any;

    // Handle both JSON and form-data
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
      console.log("✅ Parsed as JSON:", body);
    } else {
      // Handle form-data
      const formData = await request.formData();
      body = {};
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
      console.log("✅ Parsed as FormData:", body);
    }

    const {
      merchantAccount,
      orderReference,
      transactionStatus,
      amount,
      currency,
      merchantSignature,
      clientEmail,
      clientPhone,
      language,
    } = body;

    console.log("📋 Extracted payment data:", {
      merchantAccount,
      orderReference,
      transactionStatus,
      amount,
      currency,
      clientEmail: clientEmail ? "***PROVIDED***" : "❌ MISSING",
      clientPhone: clientPhone ? "***PROVIDED***" : "❌ MISSING",
      language,
      signatureReceived: merchantSignature ? "***PROVIDED***" : "❌ MISSING",
    });

    // Use test merchant account if not in production
    const expectedMerchantAccount =
      process.env.WAYFORPAY_MERCHANT_ACCOUNT || "test_merch_n1";

    // Verify merchant account
    if (merchantAccount !== expectedMerchantAccount) {
      console.error(
        "❌ Invalid merchant account. Expected:",
        expectedMerchantAccount,
        "Got:",
        merchantAccount
      );
      return NextResponse.json(
        { error: "Invalid merchant account" },
        { status: 400 }
      );
    }

    // Verify signature
    const merchantSecretKey =
      process.env.WAYFORPAY_MERCHANT_SECRET_KEY || "flk3409refn54t54t*FNJRET";
    if (!merchantSecretKey) {
      console.error("❌ WayForPay secret key not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    const signatureFields = [
      merchantAccount,
      orderReference,
      amount,
      currency,
      transactionStatus,
    ];

    const signatureString = signatureFields.join(";");
    console.log("🔐 Signature verification:");
    console.log("Fields:", signatureFields);
    console.log("String:", signatureString);

    const expectedSignature = crypto
      .createHmac("md5", merchantSecretKey)
      .update(signatureString)
      .digest("hex");

    console.log("Expected signature:", expectedSignature);
    console.log("Received signature:", merchantSignature);

    if (merchantSignature !== expectedSignature) {
      console.error("❌ Invalid signature");
      // For testing, we'll continue even with invalid signature in development
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      } else {
        console.warn(
          "⚠️ Signature mismatch in development mode - continuing anyway"
        );
      }
    } else {
      console.log("✅ Signature verified successfully");
    }

    // Process successful payment
    if (transactionStatus === "Approved") {
      // Extract course information from order_id
      const courseType = orderReference.split("_")[1];

      console.log(
        `🎉 Processing successful payment for ${courseType} course:`,
        {
          orderId: orderReference,
          amount,
          currency,
          status: transactionStatus,
          customerEmail: clientEmail,
          customerPhone: clientPhone,
        }
      );

      if (!clientEmail) {
        console.error(
          "❌ Customer email not found in payment data - cannot send course access"
        );
        return NextResponse.json({
          orderReference,
          status: "accept",
          time: Math.floor(Date.now() / 1000),
        });
      }

      // Send course access email
      try {
        console.log("📧 Attempting to send course access email...");
        console.log("Email request data:", {
          customerEmail: clientEmail,
          customerPhone: clientPhone,
          courseType,
          orderId: orderReference,
          language: language === "UA" ? "uk" : "en",
        });

        const emailResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin
          }/api/send-course-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerEmail: clientEmail,
              customerPhone: clientPhone,
              courseType,
              orderId: orderReference,
              language: language === "UA" ? "uk" : "en",
            }),
          }
        );

        console.log("📬 Email API response status:", emailResponse.status);

        if (emailResponse.ok) {
          const emailResult = await emailResponse.json();
          console.log("📬 Email API response body:", emailResult);
          console.log(
            "✅ Course access email sent successfully to:",
            clientEmail
          );
        } else {
          const errorText = await emailResponse.text();
          console.error(
            "❌ Failed to send course access email. Status:",
            emailResponse.status
          );
          console.error("❌ Error details:", errorText);
        }
      } catch (emailError) {
        console.error("💥 Error sending course access email:", emailError);
      }

      // Return success response in WayForPay format
      console.log("✅ Sending success response to WayForPay");
      return NextResponse.json({
        orderReference,
        status: "accept",
        time: Math.floor(Date.now() / 1000),
      });
    } else {
      console.log("❌ Payment not successful. Status:", transactionStatus);
      return NextResponse.json({
        orderReference,
        status: "decline",
        time: Math.floor(Date.now() / 1000),
      });
    }
  } catch (error) {
    console.error("💥 Callback processing error:", error);
    console.error(
      "💥 Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
