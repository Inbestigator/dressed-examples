import { type NextRequest, NextResponse } from "next/server";
import db from "@/db";
import type { User } from "@/types";

export async function GET(req: NextRequest) {
  if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const rs = await db.execute("SELECT * FROM users");
  const users = rs.rows as unknown as User[];
  return new NextResponse(JSON.stringify(users));
}
