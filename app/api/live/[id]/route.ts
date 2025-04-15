// app/api/live/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fixtureId = params.id; // Accessing id from params
  const apiToken = process.env.SPORTMONKS_API_KEY;

  // Checking if the API token exists
  if (!apiToken) {
    return NextResponse.json({ error: "API token is missing" }, { status: 500 });
  }

  // Construct the URL to fetch match data
  const url = `https://cricket.sportmonks.com/api/v2.0/fixtures/${fixtureId}?api_token=${apiToken}&include=localteam,visitorteam,scoreboards,batting,bowling,runs`;

  try {
    // Make the API request to fetch data
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // Cache response for 60 seconds
    });

    // If the response is not okay, return an error response
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch fixture data from SportMonks" },
        { status: response.status }
      );
    }

    // Parse the response JSON data
    const data = await response.json();
    return NextResponse.json(data); // Returning the fetched data
  } catch (err) {
    // Handle any errors during fetch
    console.error("Error fetching fixture:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}