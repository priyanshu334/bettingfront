"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MdSportsCricket, MdLocationOn, MdCalendarToday, MdAccessTime } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Match {
  id: number;
  match: string;
  date: string;
  venue: string;
  timestamp?: number;
  localTeam?: string;
  visitorTeam?: string;
  localTeamLogo?: string;
  visitorTeamLogo?: string;
  starting_at: string;
  ending_at: string;
}

const IPLMatches = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/fixtures");
  
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
  
        const data = await res.json();
  
        if (!data?.data?.length) {
          throw new Error("No matches found");
        }
  
        const formatted = data.data.map((m: any) => {
          const startingAt = new Date(m.starting_at);
          const endingAt = new Date(m.ending_at);
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
          };
        
          return {
            id: m.id,
            match: `${m.localteam?.name || 'TBD'} vs. ${m.visitorteam?.name || 'TBD'}`,
            date: startingAt.toLocaleString("en-IN", options),
            timestamp: startingAt.getTime(),
            endingTimestamp: endingAt.getTime(),
            venue: m.venue?.name || "Venue TBD",
            localTeam: m.localteam?.name || 'TBD',
            visitorTeam: m.visitorteam?.name || 'TBD',
            localTeamLogo: m.localteam?.image_path || '/team-placeholder.png',
            visitorTeamLogo: m.visitorteam?.image_path || '/team-placeholder.png',
            starting_at: m.starting_at,
            ending_at: m.ending_at
          };
        });
        
        setMatches(formatted);
        setError(null);
      } catch (err) {
        console.error("Error fetching match data", err);
        setError(err instanceof Error ? err.message : "Failed to fetch matches");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatches();
  }, []);
  
  const getMatchStatus = (match: Match) => {
    const now = Date.now();
    const startTime = match.timestamp || 0;
    const endTime = new Date(match.ending_at).getTime();
    
    if (now < startTime) {
      // Match is upcoming
      const diff = startTime - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return { status: 'upcoming', text: `${days}d ${hours}h remaining` };
      return { status: 'upcoming', text: `${hours}h ${minutes}m remaining` };
    } else if (now >= startTime && now <= endTime) {
      // Match is live
      return { status: 'live', text: 'Live Now' };
    } else {
      // Match is completed
      return { status: 'completed', text: 'Completed' };
    }
  };

  const getTeamColors = (matchTitle: string, status: string) => {
    // Special glow effect for live matches
    if (status === 'live') {
      return "from-orange-600 to-red-600 animate-pulse";
    }
    
    if (matchTitle.includes("Mumbai Indians")) return "from-blue-800 to-blue-900";
    if (matchTitle.includes("Chennai Super Kings")) return "from-yellow-600 to-yellow-700";
    if (matchTitle.includes("Royal Challengers")) return "from-red-700 to-red-900";
    if (matchTitle.includes("Kolkata Knight Riders")) return "from-purple-700 to-purple-900";
    if (matchTitle.includes("Sunrisers Hyderabad")) return "from-orange-500 to-orange-700";
    if (matchTitle.includes("Delhi Capitals")) return "from-blue-500 to-blue-700";
    if (matchTitle.includes("Rajasthan Royals")) return "from-pink-600 to-pink-800";
    if (matchTitle.includes("Punjab Kings")) return "from-red-500 to-red-700";
    if (matchTitle.includes("Gujarat Titans")) return "from-blue-600 to-blue-800";
    if (matchTitle.includes("Lucknow Super Giants")) return "from-teal-600 to-teal-800";
    return "from-gray-700 to-gray-900";
  };

  // Separate matches into different categories
  const liveMatches = matches.filter(match => {
    const status = getMatchStatus(match);
    return status.status === 'live';
  });

  const upcomingMatches = matches.filter(match => {
    const status = getMatchStatus(match);
    return status.status === 'upcoming';
  });

  const completedMatches = matches.filter(match => {
    const status = getMatchStatus(match);
    return status.status === 'completed';
  });

  if (loading) {
    return (
      <div className="p-6 w-full bg-gradient-to-br from-orange-500 via-orange-500 to-orange-500 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full bg-gradient-to-br from-orange-500 via-orange-500 to-orange-500 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl text-center">
          Error: {error}<br />
          Please try again later
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gradient-to-br from-orange-500 via-orange-500 to-orange-500 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <MdSportsCricket className="text-4xl text-yellow-400 mr-3" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
            IPL 2025 Matches
          </h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-white text-center text-xl">No matches found</div>
        ) : (
          <div className="space-y-8">
            {/* Live Matches Section */}
            {liveMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Live Matches
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map((match) => {
                    const status = getMatchStatus(match);
                    return (
                      <Card
                        key={match.id}
                        onClick={() => router.push(`/matches/${match.id}`)}
                        className={`cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-gradient-to-br ${getTeamColors(match.match, status.status)}`}
                      >
                        <div className="absolute top-0 right-0 bg-black/30 text-white text-xs px-2 py-1 rounded-bl-md">
                          Match #{match.id}
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.localTeamLogo || '/team-placeholder.png'} 
                                alt={match.localTeam || "Team 1"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.localTeam}</span>
                            </div>
                            <span className="text-white font-bold">VS</span>
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.visitorTeamLogo || '/team-placeholder.png'} 
                                alt={match.visitorTeam || "Team 2"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.visitorTeam}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/20">
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdCalendarToday className="text-yellow-400 mr-2" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdLocationOn className="text-yellow-400 mr-2" />
                              <span>{match.venue}</span>
                            </div>
                            <div className="flex items-center text-red-300 font-bold text-sm">
                              <MdAccessTime className="text-yellow-400 mr-2" />
                              {status.text}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                              LIVE
                            </span>
                            <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                              Watch Now
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming Matches Section */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Upcoming Matches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map((match) => {
                    const status = getMatchStatus(match);
                    return (
                      <Card
                        key={match.id}
                        onClick={() => router.push(`/matches/${match.id}`)}
                        className={`cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-gradient-to-br ${getTeamColors(match.match, status.status)}`}
                      >
                        <div className="absolute top-0 right-0 bg-black/30 text-white text-xs px-2 py-1 rounded-bl-md">
                          Match #{match.id}
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.localTeamLogo || '/team-placeholder.png'} 
                                alt={match.localTeam || "Team 1"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.localTeam}</span>
                            </div>
                            <span className="text-white font-bold">VS</span>
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.visitorTeamLogo || '/team-placeholder.png'} 
                                alt={match.visitorTeam || "Team 2"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.visitorTeam}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/20">
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdCalendarToday className="text-yellow-400 mr-2" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdLocationOn className="text-yellow-400 mr-2" />
                              <span>{match.venue}</span>
                            </div>
                            <div className="flex items-center text-green-300 text-sm">
                              <MdAccessTime className="text-yellow-400 mr-2" />
                              {status.text}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                              View Details
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Matches Section */}
            {completedMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Completed Matches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedMatches.map((match) => {
                    const status = getMatchStatus(match);
                    return (
                      <Card
                        key={match.id}
                        onClick={() => router.push(`/matches/${match.id}`)}
                        className={`cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-gradient-to-br ${getTeamColors(match.match, status.status)} opacity-80 hover:opacity-100`}
                      >
                        <div className="absolute top-0 right-0 bg-black/30 text-white text-xs px-2 py-1 rounded-bl-md">
                          Match #{match.id}
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.localTeamLogo || '/team-placeholder.png'} 
                                alt={match.localTeam || "Team 1"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.localTeam}</span>
                            </div>
                            <span className="text-white font-bold">VS</span>
                            <div className="flex flex-col items-center gap-2">
                              <Image 
                                src={match.visitorTeamLogo || '/team-placeholder.png'} 
                                alt={match.visitorTeam || "Team 2"} 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/team-placeholder.png';
                                }}
                              />
                              <span className="text-white text-sm font-semibold text-center">{match.visitorTeam}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/20">
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdCalendarToday className="text-yellow-400 mr-2" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center text-gray-200 text-sm mb-1">
                              <MdLocationOn className="text-yellow-400 mr-2" />
                              <span>{match.venue}</span>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                              <MdAccessTime className="text-yellow-400 mr-2" />
                              {status.text}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                              View Results
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IPLMatches;