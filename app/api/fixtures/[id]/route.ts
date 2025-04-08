import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is the correct way to extract params in App Router API routes
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const fixtureId = context.params.id;
  const apiToken = process.env.SPORTMONKS_API_KEY;

  if (!apiToken) {
    return NextResponse.json(
      { error: "API token is missing" },
      { status: 500 }
    );
  }

  const url = `https://cricket.sportmonks.com/api/v2.0/fixtures/${fixtureId}?api_token=${apiToken}&include=localteam,visitorteam,venue,lineup`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // optional caching
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch fixture data from SportMonks" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching fixture:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
