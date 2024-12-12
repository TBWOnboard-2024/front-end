import { NextResponse } from "next/server";
import { prisma } from "~~/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.properties.findUnique({
      where: {
        tokenId: params.id,
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Error fetching property" }, { status: 500 });
  }
}
