"use client";

import React, { useState } from "react";

interface Player {
  name: string;
  runs: number;
  buttons: string[];
}

interface PlayerRunsCardProps {
  heading: string;
  players: Player[];
}

const PlayerRunsCard: React.FC<PlayerRunsCardProps> = ({ heading, players }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedOdds, setSelectedOdds] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState("");

  const handleOddsClick = (playerName: string, odds: string) => {
    setSelectedPlayer(playerName);
    setSelectedOdds(odds.replace(/^:/, ""));
    setBetAmount("");
  };

  const handlePlaceBet = () => {
    console.log(`Bet ₹${betAmount} on ${selectedPlayer} at odds ${selectedOdds}`);
    setSelectedPlayer(null);
    setSelectedOdds(null);
    setBetAmount("");
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    setSelectedOdds(null);
    setBetAmount("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full overflow-hidden border border-gray-200">
      {/* Heading */}
      <div className="bg-yellow-100 px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
        {heading}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-center text-sm font-semibold border-b border-gray-300">
        <div className="text-left px-4 py-2 col-span-2 bg-gray-50">Player</div>
        <div className="bg-yellow-500 text-white py-2">Runs</div>
        <div className="bg-blue-500 text-white py-2">Odds</div>
      </div>

      {/* Player Rows */}
      {players.map((player, index) => (
        <div
          key={index}
          className="grid grid-cols-4 items-start text-center border-b border-gray-100"
        >
          {/* Name */}
          <div className="text-left px-4 py-3 text-sm font-medium text-gray-700 col-span-2 bg-white capitalize">
            {player.name}
          </div>

          {/* Runs */}
          <div className="py-3 bg-yellow-50 text-yellow-700 font-semibold">
            {player.runs}
          </div>

          {/* Odds + Inline Input */}
          <div className="py-3 bg-gray-50 flex flex-col items-center gap-2 px-2">
            <div className="flex flex-wrap justify-center gap-2">
              {player.buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleOddsClick(player.name, btn)}
                  className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition"
                >
                  {btn.replace(/^:/, "")}
                </button>
              ))}
            </div>

            {selectedPlayer === player.name && selectedOdds && (
              <div className="w-full text-left mt-2 space-y-2">
                <p className="text-xs text-gray-600 pl-1">
                  Placing bet on <strong>{selectedPlayer}</strong> at odds <strong>{selectedOdds}</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceBet}
                      disabled={!betAmount}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Place Bet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerRunsCard;
