"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Type definitions
interface Team {
  id: number;
  name: string;
  code: string;
  image_path: string;
}

interface Player {
  id: number;
  name: string;
  image_path?: string;
}

interface Batting {
  id: number;
  player_id: number;
  player_name?: string;
  score: number;
  ball?: number;
  four_x: number;
  six_x: number;
  rate: number;
  team_id: number;
  active: boolean;
}

interface Bowling {
  id: number;
  player_id: number;
  player_name?: string;
  overs: number;
  runs: number;
  wickets: number;
  wide: number;
  noball: number;
  rate: number;
  team_id: number;
  active: boolean;
}

interface Runs {
  team_id: number;
  inning: number;
  score: number;
  wickets: number;
  overs: number;
}

interface FixtureData {
  id: number;
  localteam: Team;
  visitorteam: Team;
  venue: { name: string };
  starting_at: string;
  status: string;
  note?: string;
  batting: Batting[];
  bowling: Bowling[];
  runs: Runs[];
  winner_team_id?: number;
}

export default function LiveScorecard() {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<FixtureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const fetchMatchData = async () => {
    if (!id) {
      setError("Match ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/live/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data) {
        throw new Error("Invalid API response structure");
      }

      const processedData: FixtureData = {
        id: data.data.id,
        localteam: data.data.localteam,
        visitorteam: data.data.visitorteam,
        venue: data.data.venue || { name: "Unknown Venue" },
        starting_at: formatDate(data.data.starting_at),
        status: data.data.status,
        note: data.data.note,
        batting: data.data.batting || [],
        bowling: data.data.bowling || [],
        runs: data.data.runs || [],
        winner_team_id: data.data.winner_team_id
      };

      setMatch(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch match data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 mt-6">
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 mt-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!match) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 mt-6">
        No match data available
      </div>
    );
  }

  const getTeamRuns = (teamId: number) => {
    return match.runs.find(run => run.team_id === teamId);
  };

  const getBatters = (teamId: number) => {
    return match.batting
      .filter(batter => batter.team_id === teamId)
      .sort((a, b) => b.active ? 1 : -1);
  };

  const getBowlers = (teamId: number) => {
    return match.bowling
      .filter(bowler => bowler.team_id === teamId)
      .sort((a, b) => b.active ? 1 : -1);
  };

  const localTeamRuns = getTeamRuns(match.localteam.id);
  const visitorTeamRuns = getTeamRuns(match.visitorteam.id);
  const isMatchFinished = match.status === "Finished";

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 mt-6">
      <CardContent>
        {/* Match Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex flex-col items-center flex-1">
              <Image 
                src={match.localteam.image_path} 
                alt={match.localteam.name} 
                width={64} 
                height={64}
                className="h-16 w-auto object-contain"
              />
              <h2 className="text-lg font-bold mt-2">{match.localteam.name}</h2>
              {localTeamRuns && (
                <p className="text-xl font-bold">
                  {localTeamRuns.score}/{localTeamRuns.wickets} ({localTeamRuns.overs} ov)
                </p>
              )}
            </div>

            <div className="mx-4 flex flex-col items-center">
              <span className="text-sm text-gray-500">
                {isMatchFinished ? "RESULT" : "VS"}
              </span>
              {isMatchFinished && match.winner_team_id && (
                <span className="text-sm font-semibold text-green-600">
                  {match.winner_team_id === match.localteam.id 
                    ? match.localteam.name 
                    : match.visitorteam.name} won
                </span>
              )}
              {match.note && (
                <span className="text-xs text-center text-gray-600 mt-1 max-w-xs">
                  {match.note}
                </span>
              )}
            </div>

            <div className="flex flex-col items-center flex-1">
              <Image 
                src={match.visitorteam.image_path} 
                alt={match.visitorteam.name} 
                width={64} 
                height={64}
                className="h-16 w-auto object-contain"
              />
              <h2 className="text-lg font-bold mt-2">{match.visitorteam.name}</h2>
              {visitorTeamRuns && (
                <p className="text-xl font-bold">
                  {visitorTeamRuns.score}/{visitorTeamRuns.wickets} ({visitorTeamRuns.overs} ov)
                </p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 w-full text-center border-t border-b border-gray-200 py-2">
            <div>Venue: {match.venue.name}</div>
            <div>Date: {match.starting_at}</div>
            <div>Status: {match.status}</div>
          </div>
        </div>

        {/* Scorecard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local Team */}
          <div>
            <h3 className="font-bold text-lg mb-2">
              {match.localteam.name} Batting
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Batter</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">R</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">B</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">4s</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">6s</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">SR</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getBatters(match.localteam.id).map((batter) => (
                    <tr key={batter.id} className={batter.active ? "bg-blue-50" : ""}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm">
                        {batter.active && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>}
                        {batter.player_name || `Player ${batter.player_id}`}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.score}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.ball || '-'}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.four_x}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.six_x}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-lg mt-4 mb-2">
              {match.localteam.name} Bowling
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Bowler</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">O</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">R</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">W</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">Econ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getBowlers(match.localteam.id).map((bowler) => (
                    <tr key={bowler.id} className={bowler.active ? "bg-blue-50" : ""}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm">
                        {bowler.active && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>}
                        {bowler.player_name || `Player ${bowler.player_id}`}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.overs}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.runs}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.wickets}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visitor Team */}
          <div>
            <h3 className="font-bold text-lg mb-2">
              {match.visitorteam.name} Batting
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Batter</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">R</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">B</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">4s</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">6s</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">SR</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getBatters(match.visitorteam.id).map((batter) => (
                    <tr key={batter.id} className={batter.active ? "bg-blue-50" : ""}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm">
                        {batter.active && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>}
                        {batter.player_name || `Player ${batter.player_id}`}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.score}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.ball || '-'}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.four_x}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.six_x}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{batter.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-lg mt-4 mb-2">
              {match.visitorteam.name} Bowling
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Bowler</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">O</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">R</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">W</th>
                    <th className="px-2 py-1 text-right text-xs font-medium text-gray-500">Econ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getBowlers(match.visitorteam.id).map((bowler) => (
                    <tr key={bowler.id} className={bowler.active ? "bg-blue-50" : ""}>
                      <td className="px-2 py-1 whitespace-nowrap text-sm">
                        {bowler.active && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>}
                        {bowler.player_name || `Player ${bowler.player_id}`}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.overs}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.runs}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.wickets}</td>
                      <td className="px-2 py-1 whitespace-nowrap text-sm text-right">{bowler.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}