import db, { getItems } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const items = await getItems();
    return new NextResponse(JSON.stringify(items));
}

export async function POST(req: NextRequest) {
    if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const { name, emoji, price } = await req.json();
    await db.execute({
        sql: "INSERT INTO items (name, emoji, price) VALUES (:name, :emoji, :price)",
        args: { name, emoji, price },
    });
    return new NextResponse(null, { status: 204 });
}
