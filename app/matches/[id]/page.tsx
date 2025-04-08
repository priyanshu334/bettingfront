"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RunsOptionsCard from "@/components/RunsOptionCard";
import PlayerRunsCard from "@/components/PlayerRunsCard";
import PlayerWicketsCard from "@/components/PlayerWicketsCard";
import PlayerBoundariesCard from "@/components/PlayerBoundariesCard";
import BowlerRunsCard from "@/components/BowlerRunsCard";
import MatchCard from "@/components/MatchCard";
import { bettingData } from "@/data/bettingData";
import { MdLocationOn, MdCalendarToday, MdSportsCricket } from "react-icons/md";
import Image from "next/image";

interface Team {
  id: number;
  name: string;
  image_path: string;
}

interface Player {
  team_id: number;
  player_id: number;
  fullname: string;
  firstname: string;
  lastname: string;
}

interface Match {
  id: number;
  match: string;
  date: string;
  venue: string;
  localTeam: Team;
  visitorTeam: Team;
  localTeamLogo: string;
  visitorTeamLogo: string;
  score?: string;
  lineup?: Player[];
}

const teamColors: Record<string, string> = {
  "Mumbai Indians": "bg-blue-800",
  "Chennai Super Kings": "bg-yellow-500",
  "Royal Challengers Bengaluru": "bg-red-700",
  "Kolkata Knight Riders": "bg-purple-700",
  "Sunrisers Hyderabad": "bg-orange-500",
  "Delhi Capitals": "bg-blue-600",
  "Rajasthan Royals": "bg-pink-600",
  "Punjab Kings": "bg-red-600",
  "Gujarat Titans": "bg-cyan-600",
  "Lucknow Super Giants": "bg-sky-600"
};

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [visitorPlayers, setVisitorPlayers] = useState<Player[]>([]);
  const [oddsUpdateCount, setOddsUpdateCount] = useState(0);

  // Function to generate random odds between 1.0 and 3.0
  const generateRandomOdds = useCallback(() => {
    return (Math.random() * 2 + 1).toFixed(2); // Random between 1.00 and 3.00
  }, []);

  // Function to update all odds
  const updateAllOdds = useCallback(() => {
    setOddsUpdateCount(prev => prev + 1);
  }, []);

  // Set up interval for odds updates
  useEffect(() => {
    const interval = setInterval(updateAllOdds, 50000); // Update every 50 seconds
    return () => clearInterval(interval);
  }, [updateAllOdds]);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/fixtures/${id}`);
        
        if (!res.ok) {
          throw new Error(`Match not found (status ${res.status})`);
        }

        const data = await res.json();
        
        if (!data.data) {
          throw new Error("Match data not available");
        }

        const fixture = data.data;
        const startingAt = new Date(fixture.starting_at);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata'
        };

        const matchData: Match = {
          id: fixture.id,
          match: `${fixture.localteam?.name || 'TBD'} vs. ${fixture.visitorteam?.name || 'TBD'}`,
          date: startingAt.toLocaleString("en-IN", options),
          venue: fixture.venue?.name || "Venue TBD",
          localTeam: fixture.localteam,
          visitorTeam: fixture.visitorteam,
          localTeamLogo: fixture.localteam?.image_path || '/team-placeholder.png',
          visitorTeamLogo: fixture.visitorteam?.image_path || '/team-placeholder.png',
          score: fixture.score ? `${fixture.score}` : "Match not started",
          lineup: fixture.lineup || []
        };

        setMatch(matchData);

        // Extract players from lineup
        const localTeamId = fixture.localteam?.id;
        const visitorTeamId = fixture.visitorteam?.id;

        const local = fixture.lineup?.filter(
          (p: Player) => p.team_id === localTeamId
        ) || [];
        const visitor = fixture.lineup?.filter(
          (p: Player) => p.team_id === visitorTeamId
        ) || [];

        setLocalPlayers(local);
        setVisitorPlayers(visitor);
        setError(null);
      } catch (err) {
        console.error("Error fetching match details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch match details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMatch();
    }
  }, [id]);

  // Generate player data with actual player names from the lineup
  const generatePlayers = (team: "local" | "visitor", stat: "runs" | "wickets" | "boundaries") => {
    const teamPlayers = team === "local" ? localPlayers : visitorPlayers;

    return teamPlayers.map(player => ({
      name: player.fullname || `${player.firstname} ${player.lastname}` || "Player",
      [stat]: stat === "runs" 
        ? Math.floor(Math.random() * 80) + 10
        : stat === "wickets" 
          ? Math.floor(Math.random() * 3) + 1
          : Math.floor(Math.random() * 6) + 1,
      buttons: [
        `:${generateRandomOdds()}`,
        `:${generateRandomOdds()}`
      ],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-500 font-medium">{error || "Match not found"}</p>
        <a href="/matches" className="mt-4 text-orange-500 hover:underline">
          Return to matches list
        </a>
      </div>
    );
  }

  // Generate mock betting data based on the match teams with random odds
  const adaptedBettingData = bettingData.map(item => {
    const newItem = {...item};
    
    // Replace team references in heading
    if (newItem.heading.includes("CSK") || newItem.heading.includes("PBKS")) {
      newItem.heading = newItem.heading
        .replace("CSK", match.localTeam.name)
        .replace("PBKS", match.visitorTeam.name);
    }
    
    // Replace team names in team1/team2
    if (newItem.team1 === "CSK") newItem.team1 = match.localTeam.name;
    if (newItem.team2 === "PBKS") newItem.team2 = match.visitorTeam.name;
    
    // Update button labels with correct team names and random odds
    newItem.buttons = newItem.buttons.map(button => {
      const parts = button.split(':');
      return `${parts[0]}:${generateRandomOdds()}`;
    });
    
    return newItem;
  });

  // Player data cards with random odds
  const playerRunsData = {
    heading: "Player Runs",
    players: generatePlayers("local", "runs") as { name: string; runs: number; buttons: string[] }[],
  };

  const visitorPlayerRunsData = {
    heading: "Player Runs",
    players: generatePlayers("visitor", "runs") as { name: string; runs: number; buttons: string[] }[],
  };

  const playerWicketsData = {
    heading: "Player Wickets",
    players: generatePlayers("local", "wickets") as { name: string; wickets: number; buttons: string[] }[],
  };

  const visitorPlayerWicketsData = {
    heading: "Player Wickets",
    players: generatePlayers("visitor", "wickets") as { name: string; wickets: number; buttons: string[] }[],
  };

  const playerBoundariesData = {
    heading: "Player Total Boundaries",
    players: generatePlayers("local", "boundaries") as { name: string; boundaries: number; buttons: string[] }[],
  };

  const visitorPlayerBoundariesData = {
    heading: "Player Total Boundaries",
    players: generatePlayers("visitor", "boundaries") as { name: string; boundaries: number; buttons: string[] }[],
  };

  const bowlerRunsData = {
    heading: "Bowler Runs Exceed in Match",
    players: generatePlayers("local", "runs").map(player => ({
      name: player.name,
      runsConceded: Math.floor(Math.random() * 25) + 20,
      buttons: [
        `:${generateRandomOdds()}`,
        `:${generateRandomOdds()}`
      ],
    })),
  };

  const visitorBowlerRunsData = {
    heading: "Bowler Runs Exceed in Match",
    players: generatePlayers("visitor", "runs").map(player => ({
      name: player.name,
      runsConceded: Math.floor(Math.random() * 25) + 20,
      buttons: [
        `:${generateRandomOdds()}`,
        `:${generateRandomOdds()}`
      ],
    })),
  };

  // Updated runsData with over/under options to match RunsOptionsCard component
  const runsData = {
    heading: "Runs",
    options: [
      { label: "1 Over Over 8", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "1 Over Under 8", odds: parseFloat(generateRandomOdds()), color: "blue" },
      { label: "2 Overs Over 18", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "2 Overs Under 18", odds: parseFloat(generateRandomOdds()), color: "blue" },
      { label: "6 Overs Over 75", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "6 Overs Under 75", odds: parseFloat(generateRandomOdds()), color: "blue" },
      { label: "10 Overs Over 120", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "10 Overs Under 120", odds: parseFloat(generateRandomOdds()), color: "blue" },
      { label: "15 Overs Over 150", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "15 Overs Under 150", odds: parseFloat(generateRandomOdds()), color: "blue" },
      { label: "20 Overs Over 200", odds: parseFloat(generateRandomOdds()), color: "red" },
      { label: "20 Overs Under 200", odds: parseFloat(generateRandomOdds()), color: "blue" }
    ]
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-6xl bg-gradient-to-b from-orange-500 to-orange-600 min-h-screen">
      {/* Match Header Card */}
      <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-slate-900 to-slate-800">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl md:text-2xl font-bold text-white truncate">
                {match.match}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-300 mt-1">
                <MdLocationOn className="mr-1" />
                <span className="truncate">{match.venue}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs sm:text-sm font-medium whitespace-nowrap bg-white/10 text-white">
              <MdCalendarToday className="mr-1" />
              {match.date}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Image 
                  src={match.localTeamLogo} 
                  alt={match.localTeam.name} 
                  width={32} 
                  height={32} 
                  className="rounded-full mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/team-placeholder.png';
                  }}
                />
                <span className={`font-medium text-white ${teamColors[match.localTeam.name] ? 'px-2 py-1 rounded' : ''}`}>
                  {match.localTeam.name}
                </span>
              </div>
              <span className="text-white font-bold">VS</span>
              <div className="flex items-center">
                <Image 
                  src={match.visitorTeamLogo} 
                  alt={match.visitorTeam.name} 
                  width={32} 
                  height={32} 
                  className="rounded-full mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/team-placeholder.png';
                  }}
                />
                <span className={`font-medium text-white ${teamColors[match.visitorTeam.name] ? 'px-2 py-1 rounded' : ''}`}>
                  {match.visitorTeam.name}
                </span>
              </div>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-lg w-full sm:w-auto text-center">
              <span className="font-bold text-white">{match.score}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different betting options */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 gap-1 sm:gap-2 bg-slate-800">
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
                key={`${index}-${oddsUpdateCount}`} // Force re-render when odds update
                heading={item.heading}
                team1={item.team1}
                team2={item.team2}
                buttons={item.buttons}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="runs" className="mt-0">
          <RunsOptionsCard 
            key={`runs-${oddsUpdateCount}`} // Force re-render when odds update
            heading={runsData.heading} 
            options={runsData.options} 
          />
        </TabsContent>

        <TabsContent value="player-runs" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlayerRunsCard 
              key={`local-runs-${oddsUpdateCount}`}
              heading={`${match.localTeam.name} - ${playerRunsData.heading}`} 
              players={playerRunsData.players} 
            />
            <PlayerRunsCard 
              key={`visitor-runs-${oddsUpdateCount}`}
              heading={`${match.visitorTeam.name} - ${visitorPlayerRunsData.heading}`} 
              players={visitorPlayerRunsData.players} 
            />
          </div>
        </TabsContent>

        <TabsContent value="wickets" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlayerWicketsCard 
              key={`local-wickets-${oddsUpdateCount}`}
              heading={`${match.localTeam.name} - ${playerWicketsData.heading}`} 
              players={playerWicketsData.players} 
            />
            <PlayerWicketsCard 
              key={`visitor-wickets-${oddsUpdateCount}`}
              heading={`${match.visitorTeam.name} - ${visitorPlayerWicketsData.heading}`} 
              players={visitorPlayerWicketsData.players} 
            />
          </div>
        </TabsContent>

        <TabsContent value="boundaries" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PlayerBoundariesCard 
              key={`local-boundaries-${oddsUpdateCount}`}
              heading={`${match.localTeam.name} - ${playerBoundariesData.heading}`} 
              players={playerBoundariesData.players} 
            />
            <PlayerBoundariesCard 
              key={`visitor-boundaries-${oddsUpdateCount}`}
              heading={`${match.visitorTeam.name} - ${visitorPlayerBoundariesData.heading}`} 
              players={visitorPlayerBoundariesData.players} 
            />
          </div>
        </TabsContent>

        <TabsContent value="bowler" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BowlerRunsCard 
              key={`local-bowler-${oddsUpdateCount}`}
              heading={`${match.localTeam.name} - ${bowlerRunsData.heading}`} 
              players={bowlerRunsData.players} 
            />
            <BowlerRunsCard 
              key={`visitor-bowler-${oddsUpdateCount}`}
              heading={`${match.visitorTeam.name} - ${visitorBowlerRunsData.heading}`} 
              players={visitorBowlerRunsData.players} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}