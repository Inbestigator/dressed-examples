import { type NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const id = (await params).id;
  const { balance } = await req.json();
  await db.execute({
    sql: "UPDATE users SET balance = :balance WHERE id = :id",
    args: { balance, id },
  });
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const id = (await params).id;
  await db.execute("DELETE FROM users WHERE id = ?", [id]);
  return new NextResponse(null, { status: 204 });
}
