"use client";

import React, { useState } from "react";

interface Option {
  label: string;
  odds: number;
}

interface RunsOptionsCardProps {
  heading: string;
  options: Option[];
}

const RunsOptionsCard: React.FC<RunsOptionsCardProps> = ({ heading, options }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setBetAmount("");
    setIsDialogOpen(true);
  };

  const handlePlaceBet = () => {
    console.log(`Placing ₹${betAmount} on "${selectedOption?.label}" at odds ${selectedOption?.odds}`);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedOption(null);
    setBetAmount("");
  };

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 shadow-lg rounded-2xl p-5 w-full sm:max-w-2xl mx-auto border border-orange-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-700 relative">
        <span className="bg-orange-100 px-4 py-1 rounded-full inline-block">{heading}</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className="flex justify-between items-center bg-white border border-orange-200 rounded-xl px-5 py-3 hover:shadow-md hover:border-orange-400 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
          >
            <span className="text-gray-800 font-medium">{option.label}</span>
            <span className="bg-orange-100 text-orange-700 font-bold px-4 py-1 rounded-full">
              {option.odds.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Dialog Box */}
      {isDialogOpen && selectedOption && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm space-y-5 animate-fade-in">
            <h3 className="text-xl font-bold text-center text-orange-700">Bet on: {selectedOption.label}</h3>
            <p className="text-sm text-center text-gray-600 bg-orange-50 py-2 rounded-lg">Odds: {selectedOption.odds.toFixed(2)}</p>
            
            <div className="relative">
              <input
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter amount in ₹"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pl-8"
              />
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="order-2 sm:order-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBet}
                disabled={!betAmount}
                className="order-1 sm:order-2 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium flex-1"
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

export default RunsOptionsCard;