"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card"; // Assuming shadcn/ui components
import { MdSportsCricket, MdLocationOn, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface for the structure coming directly from the API
interface ApiMatch {
  id: number;
  starting_at: string;
  ending_at?: string | null;
  live: boolean;
  status: string; // e.g., "NS", "1st Innings", "Finished", "Aban."
  localteam: Team | null;
  visitorteam: Team | null;
  venue: Venue | null;
  // Add any other fields you might need from the API response
}

// Interface for Team data within ApiMatch
interface Team {
  id: number;
  name: string;
  image_path: string;
}

// Interface for Venue data within ApiMatch
interface Venue {
  id: number;
  name: string;
}

// Interface for the formatted data used within the component
interface FormattedMatch {
  id: number;
  match: string; // e.g., "Team A vs. Team B"
  date: string; // Formatted start date/time string (e.g., "April 14, 2025, 07:30 PM")
  timestamp: number; // Start timestamp in milliseconds
  endingTimestamp?: number | null; // Optional end timestamp in milliseconds
  venue: string;
  localTeam: string;
  visitorTeam: string;
  localTeamLogo: string;
  visitorTeamLogo: string;
  starting_at: string; // Raw start time string from API
  ending_at?: string | null; // Raw end time string from API
  live: boolean; // API live flag
  status: string; // API status string
}

// --- Status Code Constants ---
// Define known status codes that mean the match is actively live or has started
const LIVE_STATUSES = ["1st Innings", "2nd Innings", "Innings Break", "Live", "Int.", "Lunch", "Tea", "Stumps", "Rain Delay", "Review", "Delayed"];
// Define known status codes that strictly mean the match hasn't started
const UPCOMING_STATUSES = ["NS"]; // "NS" for Not Started
// Define known status codes that mean the match is finished/over
const COMPLETED_STATUSES = ["Finished", "Aban.", "Cancl.", "Postp.", "Awarded", "Complete", "Cancelled", "Walkover", "Ended"]; // Add any other variations your API might use


// --- Main React Component ---
const IPLMatches = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<FormattedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Status Determination Logic (Revised & Stricter) ---
  const getMatchStatusInfo = (match: FormattedMatch): { status: 'live' | 'upcoming' | 'completed' | 'unknown', text: string } => {
    const now = new Date().getTime();
    const startTime = match.timestamp;

    // --- Prioritize Definitive Statuses ---

    // 1. Check for explicitly COMPLETED statuses first
    if (COMPLETED_STATUSES.includes(match.status)) {
        const completedText = (match.status === "Finished" || match.status === "Complete" || match.status === "Ended") ? 'Match Completed' : `Finished (${match.status})`;
        if(match.live && (match.status !== 'Postp.' && match.status !== 'Cancl.' && match.status !== 'Aban.')) {
             // Log warning if status is finished but live flag is somehow true (unless postponed/cancelled/abandoned where flag might linger)
             console.warn(`Match ${match.id} has completed status '${match.status}' but live flag is true.`);
        }
        return { status: 'completed', text: completedText };
    }
     // Also consider if the API explicitly says live: false AND start time is past
     if (match.live === false && now > startTime && !UPCOMING_STATUSES.includes(match.status)) {
         // If API says not live, start time is past, and it's not explicitly 'NS'
         // it's highly likely completed or abandoned without the specific status string yet.
         console.warn(`Match ${match.id} has live: false and start time is past, assuming completed.`);
         return { status: 'completed', text: 'Match Finished' };
     }

    // 2. Check for explicitly LIVE statuses OR live flag is true
    //    Make sure it's NOT also marked as completed above
    if (match.live || LIVE_STATUSES.includes(match.status)) {
        // Sanity check: if start time is far in the future, it's unlikely live
        if (startTime > now + (60 * 60 * 1000)) { // If start time is > 1 hour in the future
             console.warn(`Match ${match.id} has live status/flag but start time (${new Date(startTime).toLocaleString()}) is >1hr in future. Treating as upcoming.`);
             // Fall through to upcoming logic might be better
        } else {
             // Provide more specific live status text if available
             const statusText = LIVE_STATUSES.includes(match.status) && match.status !== "Live" ? `Live: ${match.status}` : 'Live Now';
             return { status: 'live', text: statusText };
        }
    }

    // 3. Check for explicitly UPCOMING status ("NS")
    if (UPCOMING_STATUSES.includes(match.status)) {
         // Handle potential API lag: If start time is past but status is still NS
         if (now >= startTime) {
             // Check if it perhaps just went live but status/live flag didn't update yet (allow small buffer)
             if (match.live || now < startTime + (5 * 60 * 1000) ) { // e.g., within 5 mins of start
                // It might be starting or just started
                 return { status: 'upcoming', text: 'Starting Soon...' };
             } else {
                 // If it's significantly past start time and still NS, assume completed/error
                  console.warn(`Match ${match.id} status is 'NS' but start time (${new Date(startTime).toLocaleString()}) is significantly past. Assuming completed/error.`);
                  return { status: 'completed', text: 'Status Error' };
             }
         }

         // Calculate time remaining for truly upcoming matches
         const diff = startTime - now;
         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

         if (days > 0) return { status: 'upcoming', text: `Starts in ${days}d ${hours}h` };
         if (hours > 0) return { status: 'upcoming', text: `Starts in ${hours}h ${minutes}m` };
         if (minutes > 5) return { status: 'upcoming', text: `Starts in ${minutes}m` }; // Show minutes if > 5
         return { status: 'upcoming', text: 'Starting Soon' }; // Less than 5 minutes away
    }

    // --- Handle Ambiguous Cases / Fallbacks ---

    // 4. If status is none of the above, use time as a fallback, but be conservative
    if (now < startTime) {
        // If current time is before start time, and status wasn't 'NS', it's still likely upcoming
        console.warn(`Match ${match.id} has unknown status '${match.status}', but start time (${new Date(startTime).toLocaleString()}) is future. Treating as upcoming.`);
        // Recalculate time remaining
         const diff = startTime - now;
         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
         const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
         if (days > 0) return { status: 'upcoming', text: `Starts in ${days}d ${hours}h` };
         if (hours > 0) return { status: 'upcoming', text: `Starts in ${hours}h ${minutes}m` };
         if (minutes > 5) return { status: 'upcoming', text: `Starts in ${minutes}m` };
         return { status: 'upcoming', text: 'Starting Soon' };
    } else {
        // If start time is past, status wasn't explicitly live/completed/NS
        // It's most likely completed or abandoned/delayed without a clear status.
        // Default to 'completed' in this scenario to ensure it's filtered out.
        console.warn(`Match ${match.id} has unknown status '${match.status}' and start time (${new Date(startTime).toLocaleString()}) is past. Assuming completed.`);
        return { status: 'completed', text: 'Match Finished (Unknown Status)' };
    }
};


  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // *** Replace with your actual API endpoint ***
        const res = await fetch("/api/fixtures");

        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }

        const data = await res.json();
        // *** Adjust '.data' based on your actual API response structure ***
        const apiMatches: ApiMatch[] = data?.data;

        if (!apiMatches || apiMatches.length === 0) {
           setMatches([]); // Set empty if no data
           setError(null);
           console.log("No match data found in the API response.");
        } else {
            const formatted = apiMatches.map((m: ApiMatch) => {
              const startingAt = new Date(m.starting_at);
              const endingAt = m.ending_at ? new Date(m.ending_at) : null;
              // Format date/time for India specifically
              const options: Intl.DateTimeFormatOptions = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', // IST
                hour12: true // Use AM/PM format
              };
              return {
                id: m.id,
                match: `${m.localteam?.name || 'TBD'} vs. ${m.visitorteam?.name || 'TBD'}`,
                date: startingAt.toLocaleString("en-IN", options), // Use Indian English locale
                timestamp: startingAt.getTime(),
                endingTimestamp: endingAt ? endingAt.getTime() : null,
                venue: m.venue?.name || "Venue TBD",
                localTeam: m.localteam?.name || 'TBD',
                visitorTeam: m.visitorteam?.name || 'TBD',
                // Provide a default placeholder image path
                localTeamLogo: m.localteam?.image_path || '/images/team-placeholder.png',
                visitorTeamLogo: m.visitorteam?.image_path || '/images/team-placeholder.png',
                starting_at: m.starting_at,
                ending_at: m.ending_at,
                live: m.live,
                status: m.status,
              };
            });
             // Sort matches chronologically by start time
             formatted.sort((a, b) => a.timestamp - b.timestamp);
             setMatches(formatted);
             setError(null); // Clear any previous error
        }

      } catch (err) {
        console.error("Error fetching or processing match data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch matches");
         setMatches([]); // Clear matches on error
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchMatches();
    // Optional: Refresh data periodically (e.g., every 60 seconds)
    // const intervalId = setInterval(fetchMatches, 60000);
    // return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array ensures this runs only once on mount


  // --- Helper function for Card Background Colors ---
   const getTeamColors = (matchTitle: string, status: string) => {
    // Live matches get a distinct pulsing background
    if (status === 'live') {
      return "from-red-500 via-orange-500 to-red-600 animate-pulse";
    }
    // Team specific colors (adjust as needed)
    if (matchTitle.includes("Mumbai Indians")) return "from-blue-600 to-blue-800";
    if (matchTitle.includes("Chennai Super Kings")) return "from-yellow-500 to-yellow-700";
    if (matchTitle.includes("Royal Challengers")) return "from-red-600 to-red-800";
    if (matchTitle.includes("Kolkata Knight Riders")) return "from-purple-600 to-purple-800";
    if (matchTitle.includes("Sunrisers Hyderabad")) return "from-orange-500 to-orange-700";
    if (matchTitle.includes("Delhi Capitals")) return "from-blue-500 to-blue-700";
    if (matchTitle.includes("Rajasthan Royals")) return "from-pink-500 to-pink-700";
    if (matchTitle.includes("Punjab Kings")) return "from-red-500 to-red-700";
    if (matchTitle.includes("Gujarat Titans")) return "from-cyan-600 to-blue-800";
    if (matchTitle.includes("Lucknow Super Giants")) return "from-teal-500 to-teal-700";
    // Default background for upcoming matches or TBD teams
    return "from-gray-700 to-gray-800";
  };


  // --- Loading State ---
  if (loading) {
    return (
      <div className="p-6 w-full bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl flex items-center">
           {/* Simple spinner */}
           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           Loading Matches...
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="p-6 w-full bg-gradient-to-br from-red-800 to-red-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl text-center p-4 bg-red-900/50 rounded-lg">
          <p className="font-semibold">Error Loading Matches</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-3">Please try refreshing the page or check back later.</p>
        </div>
      </div>
    );
  }

  // --- Filter Matches: Keep only Live and Upcoming ---
  const visibleMatches = matches.filter(match => {
    const statusInfo = getMatchStatusInfo(match);
    // Explicitly keep only 'live' or 'upcoming' statuses
    return statusInfo.status === 'live' || statusInfo.status === 'upcoming';
  });


  // --- Main Render ---
  return (
    <div className="p-4 sm:p-6 w-full bg-gradient-to-br from-gray-800 via-gray-900 to-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 text-center">
          <MdSportsCricket className="text-4xl sm:text-5xl text-yellow-400 mr-2 sm:mr-3" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-300">
              IPL Live & Upcoming Matches
            </h1>
            <p className="text-xs text-gray-400 mt-1">As of {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: true, hour: 'numeric', minute: '2-digit'})}</p>
          </div>
        </div>

        {/* Match Grid or Empty State */}
        {visibleMatches.length === 0 ? (
           <div className="text-center text-gray-400 text-lg mt-16">
              <MdSportsCricket className="text-6xl mx-auto mb-4 text-gray-600" />
              No live or upcoming matches found right now.
              <br />
              Check back later!
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Map over the FILITERED list */}
            {visibleMatches.map((match) => {
              // Get status info again for rendering (already determined for filtering)
              const statusInfo = getMatchStatusInfo(match);
              const isLive = statusInfo.status === 'live';

              return (
                <Card
                  key={match.id}
                  onClick={() => router.push(`/matches/${match.id}`)} // Example navigation
                  className={`cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700/50 relative bg-gradient-to-br ${getTeamColors(match.match, statusInfo.status)} rounded-lg shadow-md`}
                >
                  {/* --- Conditional LIVE Tag --- */}
                  {isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-lg z-10">
                      LIVE
                    </div>
                  )}
                  {/* No tag shown for upcoming matches */}

                  <CardContent className="p-4 space-y-3 text-white relative"> {/* Use relative for potential z-index needs */}
                    {/* Add padding top to ensure content doesn't overlap with LIVE tag */}
                    <div className="flex items-center justify-between gap-2 pt-6">
                      {/* Local Team */}
                      <div className="flex flex-col items-center text-center gap-1 flex-1 min-w-0"> {/* Added min-w-0 for better truncation */}
                        <Image
                          src={match.localTeamLogo}
                          alt={match.localTeam}
                          width={40} height={40}
                          className="rounded-full object-cover bg-white/10 shadow-sm" // Added slight background
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/team-placeholder.png'; }}
                        />
                        <span className="text-xs sm:text-sm font-semibold truncate w-full px-1">{match.localTeam}</span>
                      </div>
                      {/* VS Separator */}
                      <span className="text-sm sm:text-base font-bold text-gray-300/80 px-1">VS</span>
                      {/* Visitor Team */}
                      <div className="flex flex-col items-center text-center gap-1 flex-1 min-w-0">
                        <Image
                          src={match.visitorTeamLogo}
                          alt={match.visitorTeam}
                          width={40} height={40}
                          className="rounded-full object-cover bg-white/10 shadow-sm"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/team-placeholder.png'; }}
                        />
                        <span className="text-xs sm:text-sm font-semibold truncate w-full px-1">{match.visitorTeam}</span>
                      </div>
                    </div>

                    {/* Match Details Section */}
                    <div className="pt-3 border-t border-white/10 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-center text-gray-300">
                        <MdCalendarToday className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                        <span>{match.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MdLocationOn className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                        <span className="truncate" title={match.venue}>{match.venue}</span>
                      </div>
                      {/* Status Text (e.g., "Live: 1st Innings", "Starts in 2h 10m") */}
                      <div className={`flex items-center font-medium ${
                        isLive ? 'text-red-300' : 'text-blue-300' // Use blue for upcoming text color
                      }`}>
                        <MdAccessTime className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                        <span>{statusInfo.text}</span> {/* Display detailed status text */}
                      </div>
                    </div>

                    {/* Optional Action Buttons */}
                    <div className="mt-3 flex justify-end items-center pt-2 border-t border-white/5">
                      {isLive && (
                        <button
                          aria-label={`View live score for ${match.match}`}
                          className="text-xs bg-red-500/80 hover:bg-red-500 text-white px-3 py-1 rounded-full transition-colors shadow-sm mr-2"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click navigation
                            router.push(`/matches/${match.id}/live`); // Adjust route as needed
                          }}
                        >
                          Live Score
                        </button>
                      )}
                      <button
                         aria-label={`View details for ${match.match}`}
                         className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors shadow-sm"
                         onClick={(e) => {
                            // No need for stopPropagation if the main card click handler does this action
                            // e.stopPropagation();
                            router.push(`/matches/${match.id}`);
                         }}
                      >
                        Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IPLMatches;