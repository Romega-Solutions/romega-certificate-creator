import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, message, certificateImage, recipientName } = body;

    // Validation
    if (!email || !subject || !message || !certificateImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error("N8N_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Send data to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subject,
        message,
        certificateImage,
        recipientName,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("n8n webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to send email via n8n" },
        { status: 500 }
      );
    }

    const result = await n8nResponse.json();

    return NextResponse.json(
      {
        success: true,
        message: "Certificate sent successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send certificate error:", error);
    return NextResponse.json(
      {
        error: "Failed to send certificate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}