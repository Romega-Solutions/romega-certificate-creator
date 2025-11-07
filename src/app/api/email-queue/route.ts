import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { emailQueue } from "@/lib/db/schema";
import { eq, like, and, gte, lte, desc } from "drizzle-orm";

// GET - Fetch all email queue items with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const conditions = [];

    if (status) {
      conditions.push(eq(emailQueue.status, status));
    }
    if (search) {
      conditions.push(like(emailQueue.recipientEmail, `%${search}%`));
    }
    if (dateFrom) {
      conditions.push(gte(emailQueue.createdAt, dateFrom));
    }
    if (dateTo) {
      conditions.push(lte(emailQueue.createdAt, dateTo));
    }

    let query = db.select().from(emailQueue);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const items = await query.orderBy(desc(emailQueue.createdAt)).all();

    // Calculate stats
    const allItems = await db.select().from(emailQueue).all();
    const stats = {
      total: allItems.length,
      pending: allItems.filter((i) => i.status === "pending").length,
      sent: allItems.filter((i) => i.status === "sent").length,
      failed: allItems.filter((i) => i.status === "failed").length,
    };

    return NextResponse.json(
      { success: true, data: items, stats },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch email queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch email queue" },
      { status: 500 }
    );
  }
}

// POST - Add new item to queue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recipientEmail,
      recipientName,
      subject,
      message,
      certificateImage,
    } = body;

    if (
      !recipientEmail ||
      !recipientName ||
      !subject ||
      !message ||
      !certificateImage
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(emailQueue)
      .values({
        recipientEmail,
        recipientName,
        subject,
        message,
        certificateImage,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add to queue:", error);
    return NextResponse.json(
      { error: "Failed to add to queue" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from queue
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    await db.delete(emailQueue).where(eq(emailQueue.id, parseInt(id)));

    return NextResponse.json(
      { success: true, message: "Item deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}

// PATCH - Update item status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, errorMessage, sentAt } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (errorMessage !== undefined) updateData.errorMessage = errorMessage;
    if (sentAt) updateData.sentAt = sentAt;

    const result = await db
      .update(emailQueue)
      .set(updateData)
      .where(eq(emailQueue.id, id))
      .returning();

    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
