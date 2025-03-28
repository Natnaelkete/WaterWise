import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { ReportStatus, ReportType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const {
      reportId,
      type,
      description,
      location,
      latitude,
      longitude,
      image,
      status,
    } = await request.json();
    console.log({
      reportId,
      type,
      description,
      location,
      latitude,
      longitude,
      image,
      status,
    });

    const report = await db.report.create({
      data: {
        reportId,
        type: type as ReportType,
        status: status as ReportStatus,
        description,
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        image: image || null,
      },
    });

    console.log("This is a report file", report);

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit report",
      },
      { status: 500 }
    );
  }
}
