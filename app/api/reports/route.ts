import { NextResponse } from "next/server";
import { ReportStatus, ReportType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | null;
    const type = searchParams.get("type") as ReportType | null;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // Build the where clause based on filters
    const where = {
      ...(status && { status }),
      ...(type && { type }),
    };
    const [reports, totalCount] = await Promise.all([
      db.report.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          reportId: true,
          type: true,
          description: true,
          location: true,
          latitude: true,
          longitude: true,
          image: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.report.count(),
    ]);

    const hasMore = page * limit < totalCount;

    return NextResponse.json({
      success: true,
      data: reports,
      hasMore,
      totalCount,
    });
  } catch (error) {
    console.log("From report route", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reports",
        data: [],
      },
      { status: 500 }
    );
  }
}
