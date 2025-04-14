"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Assuming these imports are correct relative to your project structure
import RunsOptionsCard, { Option as RunsOptionsOption } from "@/components/RunsOptionCard"; // Import Option type if needed
import PlayerRunsCard from "@/components/PlayerRunsCard";
import PlayerWicketsCard from "@/components/PlayerWicketsCard";
import PlayerBoundariesCard from "@/components/PlayerBoundariesCard";
import BowlerRunsCard from "@/components/BowlerRunsCard";
import MatchCard from "@/components/MatchCard";
import { MdLocationOn, MdCalendarToday } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

// ========================================================================
// TYPE DEFINITIONS
// ========================================================================

// Interface for Team data (as expected from API)
interface Team {
  id: number;
  name: string;
  image_path: string;
}

// Interface for Player data (as expected *after processing API data* for state)
// This represents the core player info fetched.
interface Player {
  team_id: number;
  player_id: number;
  fullname: string;
  firstname: string;
  lastname: string;
  position: string; // Player's role (e.g., "Batsman", "Bowler")
}

// Helper type for the raw player data structure from the API
interface RawApiPlayer {
    id: number;
    country_id: number;
    firstname: string;
    lastname: string;
    fullname: string;
    image_path: string;
    dateofbirth: string;
    gender: string;
    battingstyle: string | null;
    bowlingstyle: string | null;
    position?: {
        id: number;
        name: string;
    };
    updated_at: string;
    lineup?: {
        team_id: number;
        captain: boolean;
        wicketkeeper: boolean;
        substitution: boolean; // Flag for playing XI vs substitute
    };
}

// Interface for the main Match data structure held in state
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
  lineup?: Player[]; // The *processed* lineup (playing XI only) stored in state
}

// --- Specific Display Data Types for Child Cards ---
// These define the exact shape of data expected by each respective card component.

// Type for data expected by PlayerRunsCard
interface PlayerRunsDisplayData {
  name: string;
  runs: number;
  buttons: string[];
}

// Type for data expected by PlayerWicketsCard
interface PlayerWicketsDisplayData {
  name: string;
  wickets: number;
  buttons: string[];
}

// Type for data expected by PlayerBoundariesCard
interface PlayerBoundariesDisplayData {
  name: string;
  boundaries: number;
  buttons: string[];
}

// Type for data expected by BowlerRunsCard
interface BowlerRunsDisplayData {
    name: string;
    runsConceded: number;
    buttons: string[];
}

// ========================================================================
// CONSTANTS
// ========================================================================

// Define player roles based on API data (ensure these match your API's position names)
const battingRoles = ['Batsman', 'Wicketkeeper', 'Allrounder', 'Batting Allrounder'];
const bowlingRoles = ['Bowler', 'Allrounder', 'Batting Allrounder']; // Batting Allrounders can bowl

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

// ========================================================================
// COMPONENT
// ========================================================================

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]); // Stores Playing XI Player data for local team
  const [visitorPlayers, setVisitorPlayers] = useState<Player[]>([]); // Stores Playing XI Player data for visitor team
  const [oddsUpdateCount, setOddsUpdateCount] = useState(0); // Used for re-rendering cards with new odds

  // --- Utility Functions ---

  const generateRandomOdds = useCallback(() => {
    return (Math.random() * 2 + 1).toFixed(2);
  }, []);

  // Random integer generator
  const rand = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // --- Odds Update Logic ---

  const updateAllOdds = useCallback(() => {
    setOddsUpdateCount(prev => prev + 1);
  }, []);

  // Update odds periodically
  useEffect(() => {
    const interval = setInterval(updateAllOdds, 50000); // Update every 50 seconds
    return () => clearInterval(interval);
  }, [updateAllOdds]);

  // --- Data Fetching and Processing ---

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
        const res = await fetch(`/api/fixtures/${id}`); // Ensure this API endpoint is correct
        if (!res.ok) {
          if (res.status === 404) throw new Error(`Match with ID ${id} not found.`);
          throw new Error(`Failed to fetch match data (status ${res.status})`);
        }
        const data = await res.json();
        if (!data || !data.data) throw new Error("Invalid API response structure.");

        const fixture = data.data;

        // Safely access team and venue data with fallbacks
        const localTeam: Team = fixture.localteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
        const visitorTeam: Team = fixture.visitorteam || { id: 0, name: 'TBD', image_path: '/team-placeholder.png' };
        const venueName = fixture.venue?.name || "Venue TBD";

        // Format date safely
        let formattedDate = "Date TBD";
        if (fixture.starting_at) {
          try {
             const startingAt = new Date(fixture.starting_at);
             const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: true };
             formattedDate = startingAt.toLocaleString("en-IN", options);
          } catch (dateError) {
             console.error("Error formatting date:", dateError);
             formattedDate = fixture.starting_at; // Fallback to raw string if formatting fails
          }
        }

        // Process lineup: Filter out substitutes and map to the Player interface
        const rawLineup: RawApiPlayer[] = fixture.lineup || [];
        console.log("Raw Lineup from API:", rawLineup);

        const processedLineup: Player[] = rawLineup
            .map((playerData: RawApiPlayer): Player | null => { // Map to Player or null
                // Filter conditions: must have data, lineup info, ID, and NOT be a substitute
                if (!playerData ||
                    !playerData.lineup ||
                    !playerData.id ||
                    playerData.lineup.substitution === true
                ) {
                    // console.log(`Skipping player: ${playerData?.fullname} (ID: ${playerData?.id}), Reason: Invalid data or substitute.`);
                    return null; // Exclude invalid entries or substitutes
                }
                // Map valid playing XI player to the Player structure
                return {
                    player_id: playerData.id,
                    team_id: playerData.lineup.team_id, // Ensure team_id is present
                    fullname: playerData.fullname || `${playerData.firstname || ''} ${playerData.lastname || ''}`.trim(),
                    firstname: playerData.firstname || '',
                    lastname: playerData.lastname || '',
                    position: playerData.position?.name || 'Unknown', // Safely access position
                };
            })
            .filter((player): player is Player => player !== null && player.team_id !== undefined); // Type guard to filter out nulls and ensure team_id exists

        console.log("Processed Lineup (Playing XI Only):", processedLineup);

        // Create the main Match object for state
        const matchData: Match = {
            id: fixture.id,
            match: `${localTeam.name} vs. ${visitorTeam.name}`,
            date: formattedDate,
            venue: venueName,
            localTeam: localTeam,
            visitorTeam: visitorTeam,
            localTeamLogo: localTeam.image_path || '/team-placeholder.png',
            visitorTeamLogo: visitorTeam.image_path || '/team-placeholder.png',
            score: fixture.status === 'Finished' ? `Score: ${fixture.scoreboards?.find((s: any) => s.type === 'total')?.score || 'N/A'}` : (fixture.status || "Match not started"),
            lineup: processedLineup // Store the filtered playing XI
        };
        setMatch(matchData);

        // Separate players into local and visitor teams based on the processed lineup
        const localTeamId = localTeam.id;
        const visitorTeamId = visitorTeam.id;

        const localTeamPlayers = processedLineup.filter(p => p.team_id === localTeamId);
        const visitorTeamPlayers = processedLineup.filter(p => p.team_id === visitorTeamId);

        setLocalPlayers(localTeamPlayers);
        setVisitorPlayers(visitorTeamPlayers);

        console.log(`Local Playing XI Set (Count: ${localTeamPlayers.length}):`, localTeamPlayers);
        console.log(`Visitor Playing XI Set (Count: ${visitorTeamPlayers.length}):`, visitorTeamPlayers);

      } catch (err) {
          console.error("Error fetching match details:", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred while fetching match data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]); // Dependency array includes 'id'

  // --- Player Filtering by Role ---
  // This function now operates on the state arrays (localPlayers, visitorPlayers)
  // which already contain only the filtered Playing XI.
  const filterPlayersByRole = useCallback((team: "local" | "visitor", roleFilter: string[]): Player[] => {
    const teamPlayers = team === "local" ? localPlayers : visitorPlayers;

    if (!teamPlayers || teamPlayers.length === 0) {
      return [];
    }
    // Filter the already filtered (Playing XI) players by their role/position
    return teamPlayers.filter(player => roleFilter.includes(player.position));
  }, [localPlayers, visitorPlayers]); // Depends on the state holding the filtered players

  // --- Data Generation for Child Components ---

  // Function to generate data for the main MatchCard
  const generateMatchCardData = useCallback(() => {
    if (!match) return null;
    const localTeamName = match.localTeam.name || 'Local Team';
    const visitorTeamName = match.visitorTeam.name || 'Visitor Team';
    // Shorten names for display if necessary
    const localTeamShort = localTeamName.length > 15 ? `${localTeamName.substring(0, 12)}...` : localTeamName;
    const visitorTeamShort = visitorTeamName.length > 15 ? `${visitorTeamName.substring(0, 12)}...` : visitorTeamName;

    // Generate random odds (ensure these structures match MatchCard's props)
    return {
      matchOdds: [
        { team: localTeamName, back: generateRandomOdds(), lay: (parseFloat(generateRandomOdds()) + 0.01).toFixed(2), stake: "100" },
        { team: visitorTeamName, back: generateRandomOdds(), lay: (parseFloat(generateRandomOdds()) + 0.01).toFixed(2), stake: "100" }
      ],
      bookmakerOdds: [
        { team: localTeamShort, back: rand(80, 90).toString(), lay: rand(85, 95).toString(), stake: "100" },
        { team: visitorTeamShort, back: rand(110, 120).toString(), lay: rand(115, 125).toString(), stake: "100" }
      ],
      tossOdds: [
        { team: localTeamShort, back: rand(95, 100).toString(), lay: "0", stake: "100" },
        { team: visitorTeamShort, back: rand(95, 100).toString(), lay: "0", stake: "100" }
      ],
      winPrediction: [
        { team: localTeamName, odds: generateRandomOdds() },
        { team: visitorTeamName, odds: generateRandomOdds() }
      ]
    };
  }, [match, generateRandomOdds]); // Regenerate if match or odds function changes


  // --- Loading and Error States ---
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white bg-gray-900">Loading match details...</div>;
  }

  if (error || !match) {
      return (
        <div className="container mx-auto p-4 text-center text-red-500 bg-gray-900 min-h-screen">
          <Card className="bg-gray-800 border-red-500 p-6 inline-block">
            <CardHeader><CardTitle className="text-2xl mb-4 text-red-400">Error Loading Match</CardTitle></CardHeader>
            <CardContent>
                <p className="mb-4 text-gray-300">{error || "Match data could not be loaded."}</p>
                <Link href="/matches" className="text-blue-400 hover:text-blue-300 underline">Return to matches list</Link>
            </CardContent>
          </Card>
        </div>
      );
  }

  // --- Prepare Data for Child Components (Using Correct Types) ---

  // Filter players based on roles using the filtered state
  const localBattingPlayers = filterPlayersByRole("local", battingRoles);
  const visitorBattingPlayers = filterPlayersByRole("visitor", battingRoles);
  const localBowlingPlayers = filterPlayersByRole("local", bowlingRoles);
  const visitorBowlingPlayers = filterPlayersByRole("visitor", bowlingRoles);

  // Player Runs Data (Uses PlayerRunsDisplayData)
  const playerRunsData: PlayerRunsDisplayData[] = localBattingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    runs: rand(10, 80),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));
  const visitorPlayerRunsData: PlayerRunsDisplayData[] = visitorBattingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    runs: rand(10, 80),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));

  // Player Wickets Data (Uses PlayerWicketsDisplayData)
  const playerWicketsData: PlayerWicketsDisplayData[] = localBowlingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    wickets: rand(0, 3),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));
  const visitorPlayerWicketsData: PlayerWicketsDisplayData[] = visitorBowlingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    wickets: rand(0, 3),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));

  // Player Boundaries Data (Uses PlayerBoundariesDisplayData)
  const playerBoundariesData: PlayerBoundariesDisplayData[] = localBattingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    boundaries: rand(0, 6),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));
  const visitorPlayerBoundariesData: PlayerBoundariesDisplayData[] = visitorBattingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    boundaries: rand(0, 6),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));

  // Bowler Runs Conceded Data (Uses BowlerRunsDisplayData)
  const bowlerRunsData: BowlerRunsDisplayData[] = localBowlingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    runsConceded: rand(15, 50),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));
  const visitorBowlerRunsData: BowlerRunsDisplayData[] = visitorBowlingPlayers.map(p => ({
    name: p.fullname || `Player #${p.player_id}`,
    runsConceded: rand(15, 50),
    buttons: [`Over:${generateRandomOdds()}`, `Under:${generateRandomOdds()}`],
  }));


  // Innings Runs & Wickets Data (Structure for RunsOptionsCard)
  // Ensure the 'options' structure matches the 'Option' type expected by RunsOptionsCard
  const runsAndWicketsData = {
    heading: "Innings Runs & Wickets", // Keep heading for context if needed by the card
    options: [
      // Local Team Overs Runs
      { label: `1 Over (${match.localTeam.name})`, noOdds: rand(5, 15), yesOdds: rand(5, 15) },
      { label: `6 Overs (${match.localTeam.name})`, noOdds: rand(40, 55), yesOdds: rand(40, 55) },
      { label: `10 Overs (${match.localTeam.name})`, noOdds: rand(70, 90), yesOdds: rand(70, 90) },
      { label: `15 Overs (${match.localTeam.name})`, noOdds: rand(100, 125), yesOdds: rand(100, 125) },
      { label: `20 Overs (${match.localTeam.name})`, noOdds: rand(150, 180), yesOdds: rand(150, 180) },
      // Visitor Team Overs Runs
      { label: `1 Over (${match.visitorTeam.name})`, noOdds: rand(5, 15), yesOdds: rand(5, 15) },
      { label: `6 Overs (${match.visitorTeam.name})`, noOdds: rand(40, 55), yesOdds: rand(40, 55) },
      { label: `10 Overs (${match.visitorTeam.name})`, noOdds: rand(70, 90), yesOdds: rand(70, 90) },
      { label: `15 Overs (${match.visitorTeam.name})`, noOdds: rand(100, 125), yesOdds: rand(100, 125) },
      { label: `20 Overs (${match.visitorTeam.name})`, noOdds: rand(150, 180), yesOdds: rand(150, 180) },
      // Total Runs & Boundaries
      { label: `Total Match Runs (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(300, 360), yesOdds: rand(300, 360) },
      { label: `Total Match 4s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(20, 35), yesOdds: rand(20, 35) },
      { label: `Total Match 6s (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(10, 25), yesOdds: rand(10, 25) },
      // Local Team Overs Wickets
      { label: `6 Over Wickets (${match.localTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.localTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.localTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.localTeam.name})`, noOdds: rand(4, 7), yesOdds: rand(4, 7) },
      // Visitor Team Overs Wickets
      { label: `6 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(1, 3), yesOdds: rand(1, 3) },
      { label: `10 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(2, 4), yesOdds: rand(2, 4) },
      { label: `15 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(3, 5), yesOdds: rand(3, 5) },
      { label: `20 Over Wickets (${match.visitorTeam.name})`, noOdds: rand(4, 7), yesOdds: rand(4, 7) },
      // Total Wickets
      { label: `Total Match Wickets (${match.localTeam.name} vs ${match.visitorTeam.name})`, noOdds: rand(9, 14), yesOdds: rand(9, 14) }
    ] as RunsOptionsOption[] // Assert type to ensure it matches RunsOptionsCard expectation
  };

  // Generate data for the main MatchCard (call the memoized function)
  const matchCardData = generateMatchCardData();


  // --- JSX Render ---
  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-gray-200">
      {/* Match Header Card */}
      <Card className="mb-8 bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
         <CardHeader className="pb-4">
           <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">{match.match}</CardTitle>
           <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-400 mt-2">
             <span className="flex items-center"><MdLocationOn className="mr-1 flex-shrink-0" /> {match.venue}</span>
             <span className="flex items-center"><MdCalendarToday className="mr-1 flex-shrink-0" /> {match.date}</span>
           </div>
         </CardHeader>
         <CardContent className="relative flex flex-col sm:flex-row justify-around items-center pt-4 pb-6 px-2">
           <div className="flex flex-col items-center text-center mb-4 sm:mb-0 w-full sm:w-1/3">
              {/* Added check for logo path before rendering Image */}
             {match.localTeamLogo && (
                <Image
                  src={match.localTeamLogo}
                  alt={`${match.localTeam.name} logo`}
                  width={64} height={64}
                  className="rounded-full mb-2 border-2 border-gray-600 bg-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }} // Fallback placeholder
                />
             )}
             <span className={`font-semibold text-base md:text-lg text-white px-3 py-1 rounded break-words ${teamColors[match.localTeam.name] || 'bg-gray-600'}`}>{match.localTeam.name}</span>
           </div>
           <div className="text-xl font-bold text-gray-400 mx-2 my-2 sm:my-0">VS</div>
           <div className="flex flex-col items-center text-center w-full sm:w-1/3">
             {match.visitorTeamLogo && (
                <Image
                  src={match.visitorTeamLogo}
                  alt={`${match.visitorTeam.name} logo`}
                  width={64} height={64}
                  className="rounded-full mb-2 border-2 border-gray-600 bg-gray-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/team-placeholder.png'; }} // Fallback placeholder
                />
             )}
             <span className={`font-semibold text-base md:text-lg text-white px-3 py-1 rounded break-words ${teamColors[match.visitorTeam.name] || 'bg-gray-600'}`}>{match.visitorTeam.name}</span>
           </div>
           {/* Display score/status */}
           {match.score && (
              <div className="w-full text-center mt-4 sm:mt-0 sm:absolute sm:top-2 sm:right-4">
                <Badge variant="secondary" className="text-xs sm:text-sm bg-gray-700 text-gray-200 px-2 py-1">{match.score}</Badge>
              </div>
            )}
         </CardContent>
      </Card>

      {/* General Betting Options & Fancy Link */}
        <div className="mb-8">
         <div className="flex flex-col sm:flex-row justify-center sm:space-x-8 md:space-x-20 mb-4">
           <h2 className="text-xl md:text-2xl font-semibold text-white text-center mb-2 sm:mb-0 hover:text-yellow-400 transition-colors">General Betting Options</h2>
           <Link href="/fancy" className="text-center"><h2 className="text-xl md:text-2xl font-semibold text-white hover:text-yellow-400 transition-colors">Fancy Betting Options</h2></Link>
         </div>
         <div className="flex items-center justify-center">
            {/* Render MatchCard with generated data, using oddsUpdateCount in key to force re-render */}
           {matchCardData ? (
             <MatchCard {...matchCardData} key={`match-card-${oddsUpdateCount}`} />
           ) : (
             <p className="text-gray-500">Match betting data not available yet.</p>
           )}
         </div>
       </div>


      {/* Match Runs & Wickets Options */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Match Runs & Wickets</h2>
        <RunsOptionsCard
          key={`runs-options-${oddsUpdateCount}`} // Re-render on odds update
          heading={runsAndWicketsData.heading}
          options={runsAndWicketsData.options} // Pass the correctly typed options
        />
      </div>

      {/* Player Runs (Using PlayerRunsCard and PlayerRunsDisplayData) */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Player Runs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PlayerRunsCard
            key={`local-runs-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.localTeam.name}`}
            players={playerRunsData} // Pass the correctly typed PlayerRunsDisplayData[]
          />
          <PlayerRunsCard
            key={`visitor-runs-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.visitorTeam.name}`}
            players={visitorPlayerRunsData} // Pass the correctly typed PlayerRunsDisplayData[]
          />
        </div>
      </div>

      {/* Player Wickets (Using PlayerWicketsCard and PlayerWicketsDisplayData) */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Player Wickets</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PlayerWicketsCard
            key={`local-wickets-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.localTeam.name}`}
            players={playerWicketsData} // Pass the correctly typed PlayerWicketsDisplayData[]
          />
          <PlayerWicketsCard
            key={`visitor-wickets-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.visitorTeam.name}`}
            players={visitorPlayerWicketsData} // Pass the correctly typed PlayerWicketsDisplayData[]
          />
        </div>
      </div>

      {/* Player Boundaries (Using PlayerBoundariesCard and PlayerBoundariesDisplayData) */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Player Total Boundaries</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PlayerBoundariesCard
            key={`local-boundaries-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.localTeam.name}`}
            players={playerBoundariesData} // Pass the correctly typed PlayerBoundariesDisplayData[]
          />
          <PlayerBoundariesCard
            key={`visitor-boundaries-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.visitorTeam.name}`}
            players={visitorPlayerBoundariesData} // Pass the correctly typed PlayerBoundariesDisplayData[]
          />
        </div>
      </div>

      {/* Bowler Runs Conceded (Using BowlerRunsCard and BowlerRunsDisplayData) */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Bowler Runs Conceded</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <BowlerRunsCard
            key={`local-bowler-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.localTeam.name}`}
            players={bowlerRunsData} // Pass the correctly typed BowlerRunsDisplayData[]
          />
          <BowlerRunsCard
            key={`visitor-bowler-${oddsUpdateCount}`} // Re-render on odds update
            heading={`${match.visitorTeam.name}`}
            players={visitorBowlerRunsData} // Pass the correctly typed BowlerRunsDisplayData[]
          />
        </div>
      </div>
    </div>
  );
}