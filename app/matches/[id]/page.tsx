"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RunsCard from "@/components/RunsOptionCard";
import PlayerRunsCard from "@/components/PlayerRunsCard";
import PlayerWicketsCard from "@/components/PlayerWicketsCard";
import PlayerBoundariesCard from "@/components/PlayerBoundariesCard";
import BowlerRunsCard from "@/components/BowlerRunsCard";
import MatchCard from "@/components/MatchCard";
import { bettingData } from "@/data/bettingData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Match {
  id: number;
  match: string;
  score: string;
  teams: string[];
  venue?: string;
  date?: string;
}

const matches: Match[] = [
  { 
    id: 1, 
    match: "Delhi Capitals vs. Sunrisers Hyderabad", 
    score: "DC 180/5 - SRH 175/7",
    teams: ["Delhi Capitals", "Sunrisers Hyderabad"],
    venue: "Arun Jaitley Stadium, Delhi",
    date: "April 3, 2025"
  },
  { 
    id: 2, 
    match: "Rajasthan Royals vs. Chennai Super Kings", 
    score: "RR 165/8 - CSK 170/4",
    teams: ["Rajasthan Royals", "Chennai Super Kings"],
    venue: "Sawai Mansingh Stadium, Jaipur",
    date: "April 4, 2025"
  },
  // Other matches with the same structure
  { id: 3, match: "Mumbai Indians vs. Kolkata Knight Riders", score: "MI 190/6 - KKR 185/9", teams: ["Mumbai Indians", "Kolkata Knight Riders"] },
  { id: 4, match: "Lucknow Super Giants vs. Punjab Kings", score: "LSG 178/7 - PBKS 174/8", teams: ["Lucknow Super Giants", "Punjab Kings"] },
  { id: 5, match: "Royal Challengers Bengaluru vs. Gujarat Titans", score: "RCB 200/3 - GT 198/5", teams: ["Royal Challengers Bengaluru", "Gujarat Titans"] },
  { id: 6, match: "Sunrisers Hyderabad vs. Mumbai Indians", score: "SRH 150/6 - MI 152/4", teams: ["Sunrisers Hyderabad", "Mumbai Indians"] },
  { id: 7, match: "Gujarat Titans vs. Rajasthan Royals", score: "GT 175/5 - RR 172/6", teams: ["Gujarat Titans", "Rajasthan Royals"] },
  { id: 8, match: "Royal Challengers Bengaluru vs. Delhi Capitals", score: "RCB 182/4 - DC 180/8", teams: ["Royal Challengers Bengaluru", "Delhi Capitals"] },
  { id: 9, match: "Chennai Super Kings vs. Kolkata Knight Riders", score: "CSK 190/6 - KKR 188/7", teams: ["Chennai Super Kings", "Kolkata Knight Riders"] },
  { id: 10, match: "Lucknow Super Giants vs. Gujarat Titans", score: "LSG 195/5 - GT 193/6", teams: ["Lucknow Super Giants", "Gujarat Titans"] },
];

// Team color mapping for visual identity
const teamColors: Record<string, string> = {
  "Delhi Capitals": "bg-blue-600",
  "Sunrisers Hyderabad": "bg-orange-500",
  "Rajasthan Royals": "bg-pink-600",
  "Chennai Super Kings": "bg-yellow-500",
  "Mumbai Indians": "bg-blue-800",
  "Kolkata Knight Riders": "bg-purple-700",
  "Lucknow Super Giants": "bg-sky-600",
  "Punjab Kings": "bg-red-600",
  "Royal Challengers Bengaluru": "bg-red-700",
  "Gujarat Titans": "bg-cyan-600"
};

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX
    setLoading(true);
    if (id) {
      setTimeout(() => {
        const matchData = matches.find((m) => m.id === Number(id)) || null;
        setMatch(matchData);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-500 font-medium">Match not found</p>
        <a href="/matches" className="mt-4 text-blue-600 hover:underline">
          Return to matches list
        </a>
      </div>
    );
  }

  const runsData = {
    heading: "Runs",
    options: [
      { label: "1 Over Over 8", odds: 1.85 },
      { label: "1 Over Under 8", odds: 2.0 },
      { label: "2 Overs Over 18", odds: 1.75 },
      { label: "2 Overs Under 18", odds: 2.1 },
      { label: "6 Overs Over 75", odds: 1.27 },
      { label: "6 Overs Under 75", odds: 3.61 },
      { label: "10 Overs Over 120", odds: 1.55 },
      { label: "10 Overs Under 120", odds: 2.4 },
      { label: "15 Overs Over 150", odds: 1.9 },
      { label: "15 Overs Under 150", odds: 2.05 },
      { label: "20 Overs Over 200", odds: 2.1 },
      { label: "20 Overs Under 200", odds: 1.7 },
    ],
  };

  // Generate more realistic player names based on the teams
  const generatePlayers = (teamIndex: number, stat: "runs" | "wickets" | "boundaries") => {
    const teamPlayers = [
      ["Prithvi Shaw", "David Warner", "Mitchell Marsh", "Rishabh Pant", "Axar Patel", "Kuldeep Yadav"],
      ["Travis Head", "Aiden Markram", "Heinrich Klaasen", "Washington Sundar", "Bhuvneshwar Kumar", "T Natarajan"],
      ["Rohit Sharma", "Ishan Kishan", "Suryakumar Yadav", "Hardik Pandya", "Jasprit Bumrah", "Piyush Chawla"],
      ["Shreyas Iyer", "Venkatesh Iyer", "Andre Russell", "Sunil Narine", "Pat Cummins", "Varun Chakravarthy"]
    ][teamIndex % 4];

    return teamPlayers.map(name => ({
      name,
      [stat]: stat === "runs" 
        ? Math.floor(Math.random() * 80) + 10
        : stat === "wickets" 
          ? Math.floor(Math.random() * 3) + 1
          : Math.floor(Math.random() * 6) + 1,
      buttons: [`:${(Math.random() * 1.5 + 1.5).toFixed(2)}`, `:${(Math.random() * 1.5 + 1.7).toFixed(2)}`],
    }));
  };

  const teamIndex = match ? matches.findIndex(m => m.id === match.id) : 0;

  const playerRunsData = {
    heading: "Player Runs",
    players: generatePlayers(teamIndex, "runs") as { name: string; runs: number; buttons: string[] }[],
  };

  const playerWicketsData = {
    heading: "Player Wickets",
    players: generatePlayers(teamIndex, "wickets") as { name: string; wickets: number; buttons: string[] }[],
  };

  const playerBoundariesData = {
    heading: "Player Total Boundaries",
    players: generatePlayers(teamIndex, "boundaries") as { name: string; boundaries: number; buttons: string[] }[],
  };

  const bowlerRunsData = {
    heading: "Bowler Runs Exceed in Match",
    players: generatePlayers((teamIndex + 1) % 4, "runs").map(player => ({
      name: player.name,
      runsConceded: Math.floor(Math.random() * 25) + 20,
      buttons: [`:${(Math.random() * 0.4 + 1.7).toFixed(2)}`, `:${(Math.random() * 0.4 + 1.9).toFixed(2)}`],
    })),
  };

  // Adjust the bettingData to use the current match teams
  const adaptedBettingData = bettingData.map(item => {
    const newItem = {...item};
    
    // Replace team references in heading
    if (newItem.heading.includes("CSK") || newItem.heading.includes("PBKS")) {
      newItem.heading = newItem.heading
        .replace("CSK", match.teams[0])
        .replace("PBKS", match.teams[1]);
    }
    
    // Replace team names in team1/team2
    if (newItem.team1 === "CSK") newItem.team1 = match.teams[0];
    if (newItem.team2 === "PBKS") newItem.team2 = match.teams[1];
    
    // Update button labels with correct team names
    newItem.buttons = newItem.buttons.map(button => 
      button
        .replace("CSK:", `${match.teams[0]}:`)
        .replace("PBKS:", `${match.teams[1]}:`)
    );
    
    return newItem;
  });

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-6xl ">
      {/* Match Header Card */}
      <Card className="mb-6 overflow-hidden shadow-lg border-t-4 border-t-blue-600">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl md:text-2xl font-bold text-slate-800 truncate">{match.match}</CardTitle>
              {match.venue && <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">{match.venue}</p>}
            </div>
            {match.date && (
              <Badge variant="outline" className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {match.date}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              {match.teams.map((team, idx) => (
                <div key={team} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${teamColors[team] || 'bg-gray-500'} mr-2`}></div>
                  <span className="font-medium text-sm sm:text-base">{team}</span>
                  {idx === 0 && <span className="hidden sm:inline mx-2 text-gray-400">vs</span>}
                </div>
              ))}
            </div>
            <div className="bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 rounded-lg w-full sm:w-auto text-center">
              <span className="font-bold text-sm sm:text-lg whitespace-nowrap">{match.score}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different betting options */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 gap-1 sm:gap-2">
          <TabsTrigger value="general" className="text-xs sm:text-sm p-1 sm:p-2">General</TabsTrigger>
          <TabsTrigger value="runs" className="text-xs sm:text-sm p-1 sm:p-2">Match Runs</TabsTrigger>
          <TabsTrigger value="player-runs" className="text-xs sm:text-sm p-1 sm:p-2">Player Runs</TabsTrigger>
          <TabsTrigger value="wickets" className="text-xs sm:text-sm p-1 sm:p-2">Wickets</TabsTrigger>
          <TabsTrigger value="boundaries" className="text-xs sm:text-sm p-1 sm:p-2">Boundaries</TabsTrigger>
          <TabsTrigger value="bowler" className="text-xs sm:text-sm p-1 sm:p-2">Bowler Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {adaptedBettingData.map((item, index) => (
              <MatchCard
                key={index}
                heading={item.heading}
                team1={item.team1}
                team2={item.team2}
                buttons={item.buttons}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="runs" className="mt-0">
          <RunsCard heading={runsData.heading} options={runsData.options} />
        </TabsContent>

        <TabsContent value="player-runs" className="mt-0">
          <PlayerRunsCard heading={playerRunsData.heading} players={playerRunsData.players} />
        </TabsContent>

        <TabsContent value="wickets" className="mt-0">
          <PlayerWicketsCard heading={playerWicketsData.heading} players={playerWicketsData.players} />
        </TabsContent>

        <TabsContent value="boundaries" className="mt-0">
          <PlayerBoundariesCard heading={playerBoundariesData.heading} players={playerBoundariesData.players} />
        </TabsContent>

        <TabsContent value="bowler" className="mt-0">
          <BowlerRunsCard heading={bowlerRunsData.heading} players={bowlerRunsData.players} />
        </TabsContent>
      </Tabs>
    </div>
  );
}