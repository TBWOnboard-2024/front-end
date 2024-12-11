import { NextResponse } from "next/server";
import { prisma } from "~~/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const property = await prisma.properties.create({
      data: {
        tokenId: body.tokenId,
        name: body.name,
        description: body.description,
        image: body.image,
        attributes: body.attributes,
        properties: body.properties,
        isShared: body.isShared,
        totalShares: body.isShared ? body.totalShares : null,
        pricePerShare: body.isShared ? body.pricePerShare : null,
        propertyToken: body.isShared ? body.propertyToken : null,
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
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (ids) {
      // Convert comma-separated string to array of numbers
      const idArray = ids.split(",").map(id => parseInt(id.trim()));

      // Fetch multiple properties
      const properties = await prisma.properties.findMany({
        where: {
          tokenId: {
            in: idArray.map(String),
          },
        },
      });

      if (properties.length === 0) {
        return NextResponse.json({ error: "No properties found" }, { status: 404 });
      }

      return NextResponse.json(properties);
    }

    // If no IDs provided, fetch all properties
    const properties = await prisma.properties.findMany();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Error fetching properties" }, { status: 500 });
  }
}
