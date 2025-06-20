import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerEmail, courseType = "advanced" } = body;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "customerEmail is required" },
        { status: 400 }
      );
    }

    console.log("🧪 Testing email sending...");

    // Call the actual email API
    const emailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/send-course-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: customerEmail,
          customerPhone: "+380995038881",
          courseType: courseType,
          orderId: `test_${courseType}_${Date.now()}`,
          language: "uk",
        }),
      }
    );

    const emailResult = await emailResponse.json();

    return NextResponse.json({
      success: emailResponse.ok,
      status: emailResponse.status,
      result: emailResult,
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
