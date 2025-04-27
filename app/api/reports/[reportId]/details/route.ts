import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const reportId = (await params).reportId;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const report = await db.report.findUnique({
      where: {
        id: (await params).reportId, // Changed from reportId to id if that's your Prisma model field
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report details:", error);
    return NextResponse.json(
      { error: "Failed to fetch report details" },
      { status: 500 }
    );
  }
}
