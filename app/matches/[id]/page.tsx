"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RunsOptionsCard from "@/components/RunsOptionCard";
import PlayerRunsCard from "@/components/PlayerRunsCard";
import PlayerWicketsCard from "@/components/PlayerWicketsCard";
import PlayerBoundariesCard from "@/components/PlayerBoundariesCard";
import BowlerRunsCard from "@/components/BowlerRunsCard";
import MatchCard from "@/components/MatchCard";
// Assuming bettingData uses "CSK" and "PBKS" as placeholders
import { bettingData } from "@/data/bettingData"; // Ensure this file has the correct structure and placeholders
import { MdLocationOn, MdCalendarToday } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

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
  localTeam: Team;  // Represents Team 1 fetched from API
  visitorTeam: Team; // Represents Team 2 fetched from API
  localTeamLogo: string;
  visitorTeamLogo: string;
  score?: string;
  lineup?: Player[];
}

const teamColors: Record<string, string> = {
    "Mumbai Indians": "bg-blue-800",
    "Chennai Super Kings": "bg-yellow-500",
    "Royal Challengers Bengaluru": "bg-red-700", // Ensure this matches the fetched name exactly
    "Kolkata Knight Riders": "bg-purple-700",
    "Sunrisers Hyderabad": "bg-orange-500",
    "Delhi Capitals": "bg-blue-600",          // Ensure this matches the fetched name exactly
    "Rajasthan Royals": "bg-pink-600",
    "Punjab Kings": "bg-red-600",            // Placeholder team name
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

  const generateRandomOdds = useCallback(() => {
    return (Math.random() * 2 + 1).toFixed(2);
  }, []);

  const updateAllOdds = useCallback(() => {
    setOddsUpdateCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateAllOdds, 50000); // Update odds periodically
    return () => clearInterval(interval);
  }, [updateAllOdds]);

  useEffect(() => {
    const fetchMatch = async () => {
        if (!id) {
            setError("Match ID is missing.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/fixtures/${id}`); // Verify this API returns correct team names

            if (!res.ok) {
              if (res.status === 404) {
                  throw new Error(`Match with ID ${id} not found.`);
              }
              throw new Error(`Failed to fetch match data (status ${res.status})`);
            }

            const data = await res.json();

            if (!data || !data.data) {
              throw new Error("Invalid API response structure: Match data not available");
            }

            const fixture = data.data;

            // Ensure localteam and visitorteam objects exist and have a 'name' property
            const localTeam = fixture.localteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
            const visitorTeam = fixture.visitorteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
            const venueName = fixture.venue?.name || "Venue TBD";

            let formattedDate = "Date TBD";
            if (fixture.starting_at) {
                try {
                    const startingAt = new Date(fixture.starting_at);
                    const options: Intl.DateTimeFormatOptions = {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' // Or user's local timezone
                    };
                    formattedDate = startingAt.toLocaleString("en-IN", options);
                } catch (dateError) {
                    console.error("Error formatting date:", dateError);
                    formattedDate = fixture.starting_at; // Fallback to raw date string
                }
            }

            const matchData: Match = {
                id: fixture.id,
                match: `${localTeam.name} vs. ${visitorTeam.name}`,
                date: formattedDate,
                venue: venueName,
                localTeam: localTeam,      // Actual local team data
                visitorTeam: visitorTeam,  // Actual visitor team data
                localTeamLogo: localTeam.image_path || '/team-placeholder.png',
                visitorTeamLogo: visitorTeam.image_path || '/team-placeholder.png',
                score: fixture.status === 'Finished' ? `Score: ${fixture.scoreboards?.find((s: any) => s.type === 'total')?.score || 'N/A'}` : (fixture.status || "Match not started"),
                lineup: fixture.lineup || []
            };

            setMatch(matchData); // Update state with fetched match details

            // Filter players based on fetched team IDs
            const localTeamId = localTeam.id;
            const visitorTeamId = visitorTeam.id;
            const lineup = fixture.lineup || [];
            setLocalPlayers(lineup.filter((p: Player) => p.team_id === localTeamId));
            setVisitorPlayers(lineup.filter((p: Player) => p.team_id === visitorTeamId));

        } catch (err) {
            console.error("Error fetching match details:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred while fetching match details.");
        } finally {
            setLoading(false);
        }
    };

    fetchMatch();
  }, [id]); // Re-fetch when the match ID changes

  // Generates placeholder player data (replace with actual stats if available)
  const generatePlayers = useCallback((team: "local" | "visitor", stat: "runs" | "wickets" | "boundaries") => {
    const teamPlayers = team === "local" ? localPlayers : visitorPlayers;
    if (!teamPlayers || teamPlayers.length === 0) return [];

    return teamPlayers.map(player => {
        let statValue: number;
        // Using random stats as placeholders - replace with actual data if fetched
        switch (stat) {
            case "runs": statValue = Math.floor(Math.random() * 80) + 10; break;
            case "wickets": statValue = Math.floor(Math.random() * 4); break;
            case "boundaries": statValue = Math.floor(Math.random() * 7); break;
            default: statValue = 0;
        }
        return {
            name: player.fullname || `${player.firstname || ''} ${player.lastname || ''}`.trim() || `Player #${player.player_id || 'N/A'}`,
            [stat]: statValue,
            buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`], // Dynamic odds
        };
    });
  }, [localPlayers, visitorPlayers, generateRandomOdds]);

  // Loading state display
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading match details...</div>;
  }

  // Error state display
  if (error || !match) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <h1 className="text-2xl mb-4">Error</h1>
        <p className="mb-4">{error || "Match data could not be loaded."}</p>
        <Link href="/matches" className="text-blue-400 hover:text-blue-300">
          Return to matches list
        </Link>
      </div>
    );
  }

 
  const adaptedBettingData = bettingData.map(item => {
    const newItem = { ...item }; // Create a copy to avoid modifying the original import

    // Get actual team names from the successfully fetched 'match' state
    const localTeamName = match.localTeam.name || 'TBD';   // e.g., "Royal Challengers Bengaluru"
    const visitorTeamName = match.visitorTeam.name || 'TBD'; // e.g., "Delhi Capitals"

    // Replace placeholders in 'heading' property if it exists and is a string
    if (typeof newItem.heading === 'string') {
        newItem.heading = newItem.heading
            .replace(/gt/g, localTeamName)   // Replace all "CSK" with actual local team name
            .replace(/rcb/g, visitorTeamName); // Replace all "PBKS" with actual visitor team name
    }

    // Replace placeholders in 'team1' property if it exists and is a string
    if (typeof newItem.team1 === 'string') {
        newItem.team1 = newItem.team1
            .replace(/CSK/g, localTeamName)
            .replace(/kkr/g, visitorTeamName);
    }

    // Replace placeholders in 'team2' property if it exists and is a string
    if (typeof newItem.team2 === 'string') {
        newItem.team2 = newItem.team2
            .replace(/CSK/g, localTeamName)
            .replace(/kkr/g, visitorTeamName);
    }

    // Update button odds dynamically
    if (Array.isArray(newItem.buttons)) {
        newItem.buttons = newItem.buttons.map(buttonText => {
            if (typeof buttonText === 'string') {
                const parts = buttonText.split(':');
                const label = parts[0] || '';
                // Keep existing label, update the odds part
                return `${label}:${generateRandomOdds()}`;
            }
            return buttonText; // Return non-string elements as is
        });
    }

    return newItem; // Return the modified item for the new array
  });
  

  // --- Generate dynamic data for other cards based on fetched players/teams ---
  const playerRunsData = {
    heading: "Player Runs",
    players: generatePlayers("local", "runs") as { name: string; runs: number; buttons: string[] }[],
  };
  const visitorPlayerRunsData = {
    heading: "Player Runs",
    players: generatePlayers("visitor", "runs") as { name: string; runs: number; buttons: string[] }[],
  };
  // ... (similar generation for wickets, boundaries, bowler runs) ...
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
        heading: "Bowler Runs Conceded",
        players: generatePlayers("local", "runs").map(player => ({ // Using 'runs' players as base for bowlers
            name: player.name,
            runsConceded: Math.floor(Math.random() * 35) + 15, // Placeholder conceded runs
            buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
        })),
    };
    const visitorBowlerRunsData = {
        heading: "Bowler Runs Conceded",
        players: generatePlayers("visitor", "runs").map(player => ({
            name: player.name,
            runsConceded: Math.floor(Math.random() * 35) + 15, // Placeholder conceded runs
            buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
        })),
    };

  // Data for RunsOptionsCard (Innings Runs) - odds updated dynamically
  const runsAndWicketsData = {
    heading: "Innings Runs & Wickets",
    options: [
      // Local Team - Runs
      { label: `1 Over (${match.localTeam.name})`, noOdds: rand(5, 15), yesOdds: rand(5, 15) },
      { label: `6 Overs (${match.localTeam.name})`, noOdds: rand(50, 60), yesOdds: rand(50, 60) },
      { label: `10 Overs (${match.localTeam.name})`, noOdds: rand(80, 90), yesOdds: rand(80, 90) },
      { label: `15 Overs (${match.localTeam.name})`, noOdds: rand(110, 120), yesOdds: rand(110, 120) },
      { label: `20 Overs (${match.localTeam.name})`, noOdds: rand(160, 170), yesOdds: rand(160, 170) },
  
      // Visitor Team - Runs
      { label: `1 Over (${match.visitorTeam.name})`, noOdds: rand(50, 60), yesOdds: rand(50, 60) },
      { label: `6 Overs (${match.visitorTeam.name})`, noOdds: rand(50, 60), yesOdds: rand(50, 60) },
      { label: `10 Overs (${match.visitorTeam.name})`, noOdds: rand(80, 90), yesOdds: rand(80, 90) },
      { label: `15 Overs (${match.visitorTeam.name})`, noOdds: rand(110, 120), yesOdds: rand(110, 120) },
      { label: `20 Overs (${match.visitorTeam.name})`, noOdds: rand(160, 170), yesOdds: rand(160, 170) },
  
      // Match Totals - Runs
      { label: `Total Match Runs (${match.localTeam.name})`, noOdds: rand(340, 360), yesOdds: rand(340, 360) },
      { label: `Total Match Runs (${match.visitorTeam.name})`, noOdds: rand(340, 360), yesOdds: rand(340, 360) },
      { label: `Total Match 4s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(20, 30), yesOdds: rand(20, 30) },
      { label: `Total Match 6s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(15, 25), yesOdds: rand(15, 25) },
  
      // Local Team - Wickets
      { label: `6 Over Wickets (${match.localTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.localTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.localTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.localTeam.name})`, noOdds: rand(4, 6), yesOdds: rand(4, 6) },
  
      // Visitor Team - Wickets
      { label: `6 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(4, 6), yesOdds: rand(4, 6) },
  
      // Total Match Wickets
      { label: `Total Match Wickets (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(10, 15), yesOdds: rand(10, 15) }
    ]
  };
  
  // Helper to randomize odds within range
  function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // --- Render Component ---
  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-gray-200">
      {/* Match Header Card - Displays actual fetched match info */}
      <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          {/* Uses match.match which is derived from fetched localTeam.name and visitorTeam.name */}
          <CardTitle className="text-2xl font-bold text-white text-center">{match.match}</CardTitle>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-400 mt-2">
            <span className="flex items-center"><MdLocationOn className="mr-1" /> {match.venue}</span>
            <span className="flex items-center"><MdCalendarToday className="mr-1" /> {match.date}</span>
          </div>
        </CardHeader>
        <CardContent className="relative flex flex-col sm:flex-row justify-around items-center pt-4">
          {/* Local Team Display */}
          <div className="flex flex-col items-center mb-4 sm:mb-0">
            <Image
              src={match.localTeamLogo} alt={`${match.localTeam.name} logo`} width={64} height={64}
              className="rounded-full mb-2 border-2 border-gray-600"
              onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }} // Fallback image
            />
            {/* Uses actual localTeam.name and its color */}
            <span className={`font-semibold text-lg text-white px-3 py-1 rounded ${teamColors[match.localTeam.name] || 'bg-gray-600'}`}>
              {match.localTeam.name}
            </span>
          </div>
          {/* VS Badge */}
          <div className="text-xl font-bold text-gray-400 mx-4 my-2 sm:my-0">VS</div>
          {/* Visitor Team Display */}
          <div className="flex flex-col items-center">
            <Image
              src={match.visitorTeamLogo} alt={`${match.visitorTeam.name} logo`} width={64} height={64}
              className="rounded-full mb-2 border-2 border-gray-600"
              onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }} // Fallback image
            />
            {/* Uses actual visitorTeam.name and its color */}
            <span className={`font-semibold text-lg text-white px-3 py-1 rounded ${teamColors[match.visitorTeam.name] || 'bg-gray-600'}`}>
              {match.visitorTeam.name}
            </span>
          </div>
           {/* Match Score/Status */}
           {match.score && (
                <div className="w-full text-center mt-4 sm:mt-0 sm:absolute sm:top-2 sm:right-4">
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-gray-700 text-gray-200 px-2 py-1">{match.score}</Badge>
                </div>
            )}
        </CardContent>
      </Card>

      {/* General Betting Options - Uses adaptedBettingData */}
      <div className="mb-8">
        <div className="flex justify-center space-x-20">
        <h2 className="text-2xl font-semibold text-white mb-4 hover:font-bold hover:text-yellow-500">General Betting Options</h2>
        <Link href="/fancy"><h2 className="text-2xl font-semibold text-white mb-4 hover:font-bold hover:text-yellow-500">Fancy Betting Options</h2></Link>

        </div>
       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 align-items-center">
          {/* Renders MatchCards using the data where placeholders SHOULD have been replaced */}
          <MatchCard/>
        </div>
      </div>

      {/* Match Runs Options */}
      <div className="mb-8">
  <h2 className="text-2xl font-semibold text-white mb-4">Match Runs</h2>
  <RunsOptionsCard
    key={`runs-options-${oddsUpdateCount}`}
    heading={runsAndWicketsData.heading}
    options={runsAndWicketsData.options}
  />
</div>
      {/* Player Runs (Split by Team) */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Player Runs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PlayerRunsCard
            key={`local-runs-${oddsUpdateCount}`}
            heading={`${match.localTeam.name} - ${playerRunsData.heading}`} // Use actual team name
            players={playerRunsData.players} // Uses regenerated data
          />
          <PlayerRunsCard
            key={`visitor-runs-${oddsUpdateCount}`}
            heading={`${match.visitorTeam.name} - ${visitorPlayerRunsData.heading}`} // Use actual team name
            players={visitorPlayerRunsData.players} // Uses regenerated data
          />
        </div>
      </div>

      {/* Player Wickets (Split by Team) */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Player Wickets</h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
      </div>

      {/* Player Boundaries (Split by Team) */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Player Boundaries</h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
      </div>

      {/* Bowler Stats (Split by Team) */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Bowler Stats</h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
      </div>

    </div>
  );
}