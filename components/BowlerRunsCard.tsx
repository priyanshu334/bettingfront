"use client";

import React, { useState } from "react";

interface Player {
  name: string;
  runsConceded: number;
  buttons: string[];
}

interface BowlerRunsCardProps {
  heading: string;
  players: Player[];
}

const BowlerRunsCard: React.FC<BowlerRunsCardProps> = ({ heading, players }) => {
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
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-3xl p-6 w-full max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-800 border-b pb-4 border-gray-100">{heading}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {players.map((player, idx) => (
          <div 
            key={idx} 
            className="border border-gray-200 rounded-2xl p-5 bg-white hover:shadow-md transition-all duration-300 transform hover:scale-102"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg text-gray-800 capitalize">{player.name}</span>
              <span className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">
                Runs: {player.runsConceded}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              {player.buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleOddsClick(player.name, btn)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 flex items-center justify-center"
                >
                  {btn.replace(/^:/, "")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Betting Dialog */}
      {isDialogOpen && selectedPlayer && selectedOdds && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-5 animate-fadeIn">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-center text-red-800">
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
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-lg"
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
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
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

export default BowlerRunsCard;