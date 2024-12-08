import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const property = await prisma.property.create({
      data: {
        tokenId: body.tokenId,
        name: body.name,
        description: body.description,
        image: body.image,
        attributes: body.attributes,
        properties: body.properties,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: "Error creating property" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Get the ID from the search params if it exists
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // If ID is provided, fetch single property
      const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
      });

      if (!property) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }

      return NextResponse.json(property);
    }

    // If no ID, fetch all properties (existing functionality)
    const properties = await prisma.property.findMany();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Error fetching properties" }, { status: 500 });
  }
}
