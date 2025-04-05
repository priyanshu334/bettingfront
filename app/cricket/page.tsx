"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdSportsCricket } from "react-icons/md";
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

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Upcoming IPL 2025 Matches</h1>
      <Card>
        <CardContent className="overflow-x-auto">
          <Table className="border-collapse border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-200 text-black">
                <TableHead className="w-1/2 border border-gray-300">Match</TableHead>
                <TableHead className="border border-gray-300">Date</TableHead>
                <TableHead className="border border-gray-300">Venue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow
                  key={match.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/matches/${match.id}`)}
                >
                  <TableCell className="border border-gray-300 flex items-center space-x-2">
                    <MdSportsCricket className="text-green-500" />
                    <span>{match.match}</span>
                  </TableCell>
                  <TableCell className="border border-gray-300">{match.date}</TableCell>
                  <TableCell className="border border-gray-300">{match.venue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
