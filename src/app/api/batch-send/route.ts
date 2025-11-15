import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

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

    // Fetch items to send from PostgreSQL
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
    const query = `
      SELECT id, recipient_email, recipient_name, subject, message, certificate_image, status
      FROM email_queue
      WHERE id IN (${placeholders})
    `;
    const { rows: items } = await pool.query(query, ids);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ id: number; error: string }>,
    };

    // Send each email
    for (const item of items) {
      try {
        // Update status to sending
        await pool.query("UPDATE email_queue SET status = $1 WHERE id = $2", [
          "sending",
          item.id,
        ]);

        // Send to n8n webhook with the database ID
        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id, // Include database ID for n8n to call back
            email: item.recipient_email,
            subject: item.subject,
            message: item.message,
            certificateImage: item.certificate_image,
            recipientName: item.recipient_name,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          // Webhook accepted - status will be updated by n8n callback to /api/update-status
          // Keep status as 'sending' until n8n confirms
          results.success++;
        } else {
          const errorText = await response.text();
          // If webhook itself fails, mark as failed immediately
          await pool.query(
            "UPDATE email_queue SET status = $1, error_message = $2 WHERE id = $3",
            ["failed", `Webhook error: ${errorText}`, item.id]
          );
          results.failed++;
          results.errors.push({ id: item.id, error: errorText });
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        // If network error, mark as failed immediately
        await pool.query(
          "UPDATE email_queue SET status = $1, error_message = $2 WHERE id = $3",
          ["failed", `Network error: ${errorMsg}`, item.id]
        );
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
