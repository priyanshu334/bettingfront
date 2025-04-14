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
  const [selectedOdds, setSelectedOdds] = useState<string>("");
  const [amount, setAmount] = useState<number>(100);

  const handleOddsClick = (playerName: string, odds: string) => {
    const cleanOdds = odds.replace(/^:/, "");
    setSelectedPlayer(playerName);
    setSelectedOdds(cleanOdds);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
    setAmount(100);
    setSelectedOdds("");
  };

  const handlePlaceBet = () => {
    console.log(`Placed bet on ${selectedPlayer} with odds ${selectedOdds} and amount ${amount}`);
    closeModal();
  };

  return (
    <>
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
            className="grid grid-cols-4 items-center text-center border-b border-gray-100"
          >
            {/* Name */}
            <div className="text-left px-4 py-3 text-sm font-medium text-gray-700 col-span-2 bg-white capitalize">
              {player.name}
            </div>

            {/* Runs */}
            <div className="py-3 bg-yellow-50 text-yellow-700 font-semibold">
              {player.runs}
            </div>

            {/* Odds */}
            <div className="py-3 bg-gray-50 flex flex-wrap justify-center gap-2 px-2">
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-pink-100 rounded-lg shadow-xl w-[90%] max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg font-bold text-gray-700 hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center text-red-900">Place Bet</h2>
            <div className="text-sm text-gray-700 mb-2">Player: <span className="font-medium">{selectedPlayer}</span></div>
            <div className="text-sm text-gray-700 mb-4">Odds: <span className="font-medium">{selectedOdds}</span></div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              min={100}
              max={200000}
            />

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1000, 2000, 5000, 10000, 20000, 25000, 50000, 75000, 90000, 95000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(amount + val)}
                  className="bg-orange-300 text-white py-2 rounded font-semibold text-sm hover:bg-orange-400"
                >
                  +{val / 1000}k
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={handlePlaceBet}
                className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 font-semibold"
              >
                Place Bet
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerRunsCard;
