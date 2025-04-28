import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();
    const report = await db.report.update({
      where: { id: (await params).reportId },
      data: { status },
    });

    revalidatePath("/dashboard");
    return NextResponse.json(report);
  } catch (error) {
    console.log("Report id error", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}
