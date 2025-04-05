"use client"; // Required for client-side hooks like useParams()

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Match {
  id: number;
  match: string;
  score: string;
}

const matches: Match[] = [
  { id: 1, match: "Delhi Capitals vs. Sunrisers Hyderabad", score: "DC 180/5 - SRH 175/7" },
  { id: 2, match: "Rajasthan Royals vs. Chennai Super Kings", score: "RR 165/8 - CSK 170/4" },
  { id: 3, match: "Mumbai Indians vs. Kolkata Knight Riders", score: "MI 190/6 - KKR 185/9" },
  { id: 4, match: "Lucknow Super Giants vs. Punjab Kings", score: "LSG 178/7 - PBKS 174/8" },
  { id: 5, match: "Royal Challengers Bengaluru vs. Gujarat Titans", score: "RCB 200/3 - GT 198/5" },
  { id: 6, match: "Sunrisers Hyderabad vs. Mumbai Indians", score: "SRH 150/6 - MI 152/4" },
  { id: 7, match: "Gujarat Titans vs. Rajasthan Royals", score: "GT 175/5 - RR 172/6" },
  { id: 8, match: "Royal Challengers Bengaluru vs. Delhi Capitals", score: "RCB 182/4 - DC 180/8" },
  { id: 9, match: "Chennai Super Kings vs. Kolkata Knight Riders", score: "CSK 190/6 - KKR 188/7" },
  { id: 10, match: "Lucknow Super Giants vs. Gujarat Titans", score: "LSG 195/5 - GT 193/6" },
];

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (id) {
      const matchData = matches.find((m) => m.id === Number(id)) || null;
      setMatch(matchData);
    }
  }, [id]);

  if (!match) {
    return <p className="text-center mt-10 text-red-500">Match not found.</p>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Match Details</h1>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">{match.match}</h2>
          <p className="text-lg mt-2">Scorecard: {match.score}</p>
        </CardContent>
      </Card>
    </div>
  );
}
