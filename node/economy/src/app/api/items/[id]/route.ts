import db from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const id = (await params).id;
    const { name, emoji, price } = await req.json();
    await db.execute({
        sql: "UPDATE items SET name = :name, emoji = :emoji, price = :price WHERE id = :id",
        args: { name, emoji, price, id },
    });
    return new NextResponse(null, { status: 204 });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    if (req.headers.get("Authorization") !== process.env.ADMIN_PASSWORD) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const id = (await params).id;
    await db.execute("DELETE FROM items WHERE id = ?", [id]);
    return new NextResponse(null, { status: 204 });
}
