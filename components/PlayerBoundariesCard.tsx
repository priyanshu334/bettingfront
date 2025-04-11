"use client";

import React, { useState } from "react";

interface Player {
  name: string;
  boundaries: number;
  buttons: string[];
}

interface PlayerBoundariesCardProps {
  heading: string;
  players: Player[];
}

const PlayerBoundariesCard: React.FC<PlayerBoundariesCardProps> = ({ heading, players }) => {
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
      <div className="bg-blue-200 px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
        {heading}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 text-sm font-semibold border-b border-gray-300 text-center">
        <div className="text-left px-4 py-2 bg-gray-50 col-span-1">Player</div>
        <div className="bg-blue-500 text-white py-2 hidden md:block">Boundaries</div>
        <div className="bg-gray-100 py-2">Odds</div>
      </div>

      {/* Table Rows */}
      {players.map((player, index) => (
        <div
          key={index}
          className="grid grid-cols-2 md:grid-cols-3 border-b border-gray-100 items-start text-sm text-gray-700 text-center"
        >
          <div className="text-left px-4 py-3 font-medium capitalize">{player.name}</div>
          <div className="py-3 hidden md:block text-blue-700 font-semibold">{player.boundaries}</div>
          <div className="flex flex-wrap gap-2 justify-center px-4 py-3">
            {player.buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleOddsClick(player.name, btn)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-200 hover:text-blue-800 transition"
              >
                {btn.replace(/^:/, "")}
              </button>
            ))}

            {/* Inline Betting Input */}
            {selectedPlayer === player.name && selectedOdds && (
              <div className="w-full mt-4 text-left space-y-3 col-span-full">
                <p className="text-sm text-gray-600">
                  <strong>{selectedPlayer}</strong> selected at odds <strong>{selectedOdds}</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-1/2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-1/2">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceBet}
                      disabled={!betAmount}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PlayerBoundariesCard;
