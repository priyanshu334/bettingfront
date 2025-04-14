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

  const generateRandomOdds = useCallback(() => {
    return (Math.random() * 2 + 1).toFixed(2);
  }, []);

  const updateAllOdds = useCallback(() => {
    setOddsUpdateCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateAllOdds, 50000);
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
        const res = await fetch(`/api/fixtures/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Match with ID ${id} not found.`);
          }
          throw new Error(`Failed to fetch match data (status ${res.status})`);
        }

        const data = await res.json();

        if (!data || !data.data) {
          throw new Error("Invalid API response structure");
        }

        const fixture = data.data;
        const localTeam = fixture.localteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
        const visitorTeam = fixture.visitorteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
        const venueName = fixture.venue?.name || "Venue TBD";

        let formattedDate = "Date TBD";
        if (fixture.starting_at) {
          const startingAt = new Date(fixture.starting_at);
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
          };
          formattedDate = startingAt.toLocaleString("en-IN", options);
        }

        const matchData: Match = {
          id: fixture.id,
          match: `${localTeam.name} vs. ${visitorTeam.name}`,
          date: formattedDate,
          venue: venueName,
          localTeam: localTeam,
          visitorTeam: visitorTeam,
          localTeamLogo: localTeam.image_path || '/team-placeholder.png',
          visitorTeamLogo: visitorTeam.image_path || '/team-placeholder.png',
          score: fixture.status === 'Finished' 
            ? `Score: ${fixture.scoreboards?.find((s: any) => s.type === 'total')?.score || 'N/A'}` 
            : (fixture.status || "Match not started"),
          lineup: fixture.lineup || []
        };

        setMatch(matchData);
        const localTeamId = localTeam.id;
        const visitorTeamId = visitorTeam.id;
        const lineup = fixture.lineup || [];
        setLocalPlayers(lineup.filter((p: Player) => p.team_id === localTeamId));
        setVisitorPlayers(lineup.filter((p: Player) => p.team_id === visitorTeamId));

      } catch (err) {
        console.error("Error fetching match details:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  const generatePlayers = useCallback((team: "local" | "visitor", stat: "runs" | "wickets" | "boundaries") => {
    const teamPlayers = team === "local" ? localPlayers : visitorPlayers;
    if (!teamPlayers || teamPlayers.length === 0) return [];

    return teamPlayers.map(player => {
      let statValue: number;
      switch (stat) {
        case "runs": statValue = Math.floor(Math.random() * 80) + 10; break;
        case "wickets": statValue = Math.floor(Math.random() * 4); break;
        case "boundaries": statValue = Math.floor(Math.random() * 7); break;
        default: statValue = 0;
      }
      return {
        name: player.fullname || `${player.firstname || ''} ${player.lastname || ''}`.trim() || `Player #${player.player_id || 'N/A'}`,
        [stat]: statValue,
        buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
      };
    });
  }, [localPlayers, visitorPlayers, generateRandomOdds]);

  const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateMatchCardData = () => {
    if (!match) return null;
    
    return {
      matchOdds: [
        { 
          team: match.localTeam.name, 
          back: generateRandomOdds(), 
          lay: (parseFloat(generateRandomOdds()) + 0.01).toFixed(2), 
          stake: "100" 
        },
        { 
          team: match.visitorTeam.name, 
          back: generateRandomOdds(), 
          lay: (parseFloat(generateRandomOdds()) + 0.01).toFixed(2), 
          stake: "100" 
        }
      ],
      bookmakerOdds: [
        { 
          team: `${match.localTeam.name.substring(0, 15)}...`, 
          back: rand(80, 90).toString(), 
          lay: rand(85, 95).toString(), 
          stake: "100" 
        },
        { 
          team: match.visitorTeam.name, 
          back: rand(110, 120).toString(), 
          lay: rand(115, 125).toString(), 
          stake: "100" 
        }
      ],
      tossOdds: [
        { 
          team: `${match.localTeam.name.substring(0, 15)}...`, 
          back: rand(95, 100).toString(), 
          lay: "0", 
          stake: "100" 
        },
        { 
          team: match.visitorTeam.name, 
          back: rand(95, 100).toString(), 
          lay: "0", 
          stake: "100" 
        }
      ],
      winPrediction: [
        { 
          team: match.localTeam.name, 
          odds: generateRandomOdds() 
        },
        { 
          team: match.visitorTeam.name, 
          odds: generateRandomOdds() 
        }
      ]
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading match details...</div>;
  }

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

  // Generate all dynamic data
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
    heading: "Bowler Runs Conceded",
    players: generatePlayers("local", "runs").map(player => ({
      name: player.name,
      runsConceded: Math.floor(Math.random() * 35) + 15,
      buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
    })),
  };
  const visitorBowlerRunsData = {
    heading: "Bowler Runs Conceded",
    players: generatePlayers("visitor", "runs").map(player => ({
      name: player.name,
      runsConceded: Math.floor(Math.random() * 35) + 15,
      buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
    })),
  };

  const runsAndWicketsData = {
    heading: "Innings Runs & Wickets",
    options: [
      { label: `1 Over (${match.localTeam.name})`, noOdds: rand(5, 15), yesOdds: rand(5, 15) },
      { label: `6 Overs (${match.localTeam.name})`, noOdds: rand(50, 60), yesOdds: rand(50, 60) },
      { label: `10 Overs (${match.localTeam.name})`, noOdds: rand(80, 90), yesOdds: rand(80, 90) },
      { label: `15 Overs (${match.localTeam.name})`, noOdds: rand(110, 120), yesOdds: rand(110, 120) },
      { label: `20 Overs (${match.localTeam.name})`, noOdds: rand(160, 170), yesOdds: rand(160, 170) },
      { label: `1 Over (${match.visitorTeam.name})`, noOdds: rand(5, 15), yesOdds: rand(5, 15) },
      { label: `6 Overs (${match.visitorTeam.name})`, noOdds: rand(50, 60), yesOdds: rand(50, 60) },
      { label: `10 Overs (${match.visitorTeam.name})`, noOdds: rand(80, 90), yesOdds: rand(80, 90) },
      { label: `15 Overs (${match.visitorTeam.name})`, noOdds: rand(110, 120), yesOdds: rand(110, 120) },
      { label: `20 Overs (${match.visitorTeam.name})`, noOdds: rand(160, 170), yesOdds: rand(160, 170) },
      { label: `Total Match Runs (${match.localTeam.name})`, noOdds: rand(340, 360), yesOdds: rand(340, 360) },
      { label: `Total Match Runs (${match.visitorTeam.name})`, noOdds: rand(340, 360), yesOdds: rand(340, 360) },
      { label: `Total Match 4s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(20, 30), yesOdds: rand(20, 30) },
      { label: `Total Match 6s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(15, 25), yesOdds: rand(15, 25) },
      { label: `6 Over Wickets (${match.localTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.localTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.localTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.localTeam.name})`, noOdds: rand(4, 6), yesOdds: rand(4, 6) },
      { label: `6 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(4, 6), yesOdds: rand(4, 6) },
      { label: `Total Match Wickets (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(10, 15), yesOdds: rand(10, 15) }
    ]
  };

  const matchCardData = generateMatchCardData();

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-gray-200">
      {/* Match Header Card */}
      <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white text-center">{match.match}</CardTitle>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-400 mt-2">
            <span className="flex items-center"><MdLocationOn className="mr-1" /> {match.venue}</span>
            <span className="flex items-center"><MdCalendarToday className="mr-1" /> {match.date}</span>
          </div>
        </CardHeader>
        <CardContent className="relative flex flex-col sm:flex-row justify-around items-center pt-4">
          <div className="flex flex-col items-center mb-4 sm:mb-0">
            <Image
              src={match.localTeamLogo} 
              alt={`${match.localTeam.name} logo`} 
              width={64} 
              height={64}
              className="rounded-full mb-2 border-2 border-gray-600"
              onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }}
            />
            <span className={`font-semibold text-lg text-white px-3 py-1 rounded ${teamColors[match.localTeam.name] || 'bg-gray-600'}`}>
              {match.localTeam.name}
            </span>
          </div>
          <div className="text-xl font-bold text-gray-400 mx-4 my-2 sm:my-0">VS</div>
          <div className="flex flex-col items-center">
            <Image
              src={match.visitorTeamLogo} 
              alt={`${match.visitorTeam.name} logo`} 
              width={64} 
              height={64}
              className="rounded-full mb-2 border-2 border-gray-600"
              onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }}
            />
            <span className={`font-semibold text-lg text-white px-3 py-1 rounded ${teamColors[match.visitorTeam.name] || 'bg-gray-600'}`}>
              {match.visitorTeam.name}
            </span>
          </div>
          {match.score && (
            <div className="w-full text-center mt-4 sm:mt-0 sm:absolute sm:top-2 sm:right-4">
              <Badge variant="secondary" className="text-xs sm:text-sm bg-gray-700 text-gray-200 px-2 py-1">
                {match.score}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Betting Options */}
      <div className="mb-8">
        <div className="flex justify-center space-x-20">
          <h2 className="text-2xl font-semibold text-white mb-4 hover:font-bold hover:text-yellow-500">
            General Betting Options
          </h2>
          <Link href="/fancy">
            <h2 className="text-2xl font-semibold text-white mb-4 hover:font-bold hover:text-yellow-500">
              Fancy Betting Options
            </h2>
          </Link>
        </div>
        <div className="min-h-screen flex items-center justify-center">
          {matchCardData && <MatchCard {...matchCardData} />}
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

      {/* Player Runs */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Player Runs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
      </div>

      {/* Player Wickets */}
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

      {/* Player Boundaries */}
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

      {/* Bowler Stats */}
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