import { db } from "@/lib/prisma";
import { formatError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const report = await db.report.findFirst({
      where: { id: (await params).reportId },
    });

    if (!report) throw new Error("There is no report found");

    await db.report.delete({
      where: { id: (await params).reportId },
    });

    return NextResponse.json({
      success: true,
      message: "Report successfully deleted",
    });
  } catch (error) {
    console.log("This is from delete route error", error);
    return NextResponse.json({
      success: false,
      message: formatError(error),
    });
  }
}
