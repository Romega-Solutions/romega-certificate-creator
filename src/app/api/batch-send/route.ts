import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailQueue } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Fetch items to send
    const items = await db
      .select()
      .from(emailQueue)
      .where(inArray(emailQueue.id, ids))
      .all();

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ id: number; error: string }>,
    };

    // Send each email
    for (const item of items) {
      try {
        // Update status to sending
        await db
          .update(emailQueue)
          .set({ status: "sending" })
          .where(eq(emailQueue.id, item.id));

        // Send to n8n webhook
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: item.recipientEmail,
            subject: item.subject,
            message: item.message,
            certificateImage: item.certificateImage,
            recipientName: item.recipientName,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          // Update to sent
          await db
            .update(emailQueue)
            .set({
              status: "sent",
              sentAt: new Date().toISOString(),
            })
            .where(eq(emailQueue.id, item.id));
          results.success++;
        } else {
          const errorText = await response.text();
          await db
            .update(emailQueue)
            .set({
              status: "failed",
              errorMessage: errorText,
            })
            .where(eq(emailQueue.id, item.id));
          results.failed++;
          results.errors.push({ id: item.id, error: errorText });
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        await db
          .update(emailQueue)
          .set({
            status: "failed",
            errorMessage: errorMsg,
          })
          .where(eq(emailQueue.id, item.id));
        results.failed++;
        results.errors.push({ id: item.id, error: errorMsg });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Sent ${results.success}/${items.length} emails`,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Batch send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
