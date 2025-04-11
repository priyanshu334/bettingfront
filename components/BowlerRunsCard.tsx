"use client";

import React from "react";

interface Player {
  name: string;
  runsConceded: number;
  buttons: string[]; // odds
}

interface BowlerRunsCardProps {
  heading: string;
  players: Player[];
}

const BowlerRunsCard: React.FC<BowlerRunsCardProps> = ({ heading, players }) => {
  return (
    <div className="bg-white shadow-md rounded-lg w-full overflow-hidden border border-gray-200">
      {/* Heading Bar */}
      <div className="bg-red-100 px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
        {heading}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-center text-sm font-semibold border-b border-gray-300">
        <div className="text-left px-4 py-2 col-span-2 bg-gray-50">Bowler</div>
        <div className="bg-red-500 text-white py-2">Runs</div>
        <div className="bg-blue-500 text-white py-2">Odds</div>
      </div>

      {/* Table Rows */}
      {players.map((player, index) => (
        <div
          key={index}
          className="grid grid-cols-4 items-center text-center border-b border-gray-100"
        >
          {/* Name */}
          <div className="text-left px-4 py-3 text-sm font-medium text-gray-700 col-span-2 bg-white capitalize">
            {player.name}
          </div>

          {/* Runs */}
          <div className="py-3 bg-red-50 text-red-700 font-semibold">
            {player.runsConceded}
          </div>

          {/* Odds */}
          <div className="py-3 bg-blue-50 flex flex-wrap justify-center gap-2 px-2">
            {player.buttons.map((btn, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
              >
                {btn.replace(/^:/, "")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BowlerRunsCard;