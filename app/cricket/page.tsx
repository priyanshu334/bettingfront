"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MdSportsCricket, MdLocationOn, MdCalendarToday } from "react-icons/md";
import { useRouter } from "next/navigation";

interface Match {
  id: number;
  match: string;
  date: string;
  venue: string;
}

const matches: Match[] = [
  { id: 1, match: "Delhi Capitals vs. Sunrisers Hyderabad", date: "April 3, 2025, 7:30 PM (IST)", venue: "Visakhapatnam" },
  { id: 2, match: "Rajasthan Royals vs. Chennai Super Kings", date: "April 4, 2025, 7:30 PM (IST)", venue: "Guwahati" },
  { id: 3, match: "Mumbai Indians vs. Kolkata Knight Riders", date: "April 5, 2025, 7:30 PM (IST)", venue: "Mumbai" },
  { id: 4, match: "Lucknow Super Giants vs. Punjab Kings", date: "April 6, 2025, 7:30 PM (IST)", venue: "Lucknow" },
  { id: 5, match: "Royal Challengers Bengaluru vs. Gujarat Titans", date: "April 7, 2025, 7:30 PM (IST)", venue: "Bengaluru" },
  { id: 6, match: "Sunrisers Hyderabad vs. Mumbai Indians", date: "April 8, 2025, 7:30 PM (IST)", venue: "Hyderabad" },
  { id: 7, match: "Gujarat Titans vs. Rajasthan Royals", date: "April 9, 2025, 7:30 PM (IST)", venue: "Ahmedabad" },
  { id: 8, match: "Royal Challengers Bengaluru vs. Delhi Capitals", date: "April 10, 2025, 7:30 PM (IST)", venue: "Bengaluru" },
  { id: 9, match: "Chennai Super Kings vs. Kolkata Knight Riders", date: "April 11, 2025, 7:30 PM (IST)", venue: "Chennai" },
  { id: 10, match: "Lucknow Super Giants vs. Gujarat Titans", date: "April 12, 2025, 3:30 PM (IST)", venue: "Lucknow" },
];

export default function IPLMatches() {
  const router = useRouter();
  
  // Function to get team colors for card styling
  const getTeamColors = (matchTitle) => {
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
    return "from-gray-700 to-gray-900"; // Default fallback
  };
  
  // Function to extract team names for display
  const formatMatchTitle = (matchTitle) => {
    const teams = matchTitle.split(" vs. ");
    return (
      <div className="flex flex-col text-center sm:text-left">
        <span className="font-bold">{teams[0]}</span>
        <span className="text-xs font-semibold my-1">VS</span>
        <span className="font-bold">{teams[1]}</span>
      </div>
    );
  };

  return (
    <div className="p-6 w-full bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <MdSportsCricket className="text-4xl text-yellow-400 mr-3" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
            Upcoming IPL 2025 Matches
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card
              key={match.id}
              onClick={() => router.push(`/matches/${match.id}`)}
              className={`cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 bg-gradient-to-br ${getTeamColors(match.match)}`}
            >
              <div className="absolute top-0 right-0 bg-black/30 text-white text-xs px-2 py-1 rounded-bl-md">
                Match #{match.id}
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  {formatMatchTitle(match.match)}
                </div>
                
                <div className="pt-3 border-t border-white/20">
                  <div className="flex items-center text-gray-200 text-sm mb-2">
                    <MdCalendarToday className="text-yellow-400 mr-2" />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center text-gray-200 text-sm">
                    <MdLocationOn className="text-yellow-400 mr-2" />
                    <span>{match.venue}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors">
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}