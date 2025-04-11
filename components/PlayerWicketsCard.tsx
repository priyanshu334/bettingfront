"use client";

import React, { useState } from "react";

interface Player {
  name: string;
  wickets: number;
  buttons: string[];
}

interface PlayerWicketsCardProps {
  heading: string;
  players: Player[];
}

const PlayerWicketsCard: React.FC<PlayerWicketsCardProps> = ({ heading, players }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedOdds, setSelectedOdds] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOddsClick = (playerName: string, odds: string) => {
    setSelectedPlayer(playerName);
    setSelectedOdds(odds.replace(/^:/, ""));
    setBetAmount("");
    setIsDialogOpen(true);
  };

  const handlePlaceBet = () => {
    console.log(`Placed ₹${betAmount} on ${selectedPlayer} (odds: ${selectedOdds})`);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setSelectedPlayer(null);
    setSelectedOdds(null);
    setBetAmount("");
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full overflow-hidden border border-gray-200">
      {/* Heading Bar */}
      <div className="bg-purple-100 px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
        {heading}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 text-center text-sm font-semibold border-b border-gray-300">
        <div className="text-left px-4 py-2 col-span-2 bg-gray-50">Player</div>
        <div className="bg-purple-500 text-white py-2">Wickets</div>
        <div className="bg-blue-500 text-white py-2">Odds</div>
      </div>

      {/* Table Rows */}
      {players.map((player, index) => (
        <div
          key={index}
          className="grid grid-cols-4 items-center text-center border-b border-gray-100"
        >
          {/* Name */}
          <div className="text-left px-4 py-3 text-sm font-medium text-gray-700 col-span-2 capitalize">
            {player.name}
          </div>

          {/* Wickets */}
          <div className="py-3 bg-purple-50 text-purple-700 font-semibold">
            {player.wickets}
          </div>

          {/* Odds */}
          <div className="py-3 bg-blue-50 flex flex-wrap justify-center gap-2 px-2">
            {player.buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handleOddsClick(player.name, btn)}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200"
              >
                {btn.replace(/^:/, "")}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Betting Dialog */}
      {isDialogOpen && selectedPlayer && selectedOdds && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-5 animate-fadeIn">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-center text-purple-800">
                Bet on {selectedPlayer}
              </h3>
              <p className="text-sm text-center text-gray-600 mt-2">Odds: {selectedOdds}</p>
            </div>

            <div className="py-4">
              <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your bet amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  id="betAmount"
                  type="number"
                  min="1"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBet}
                disabled={!betAmount}
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                Place Bet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerWicketsCard;