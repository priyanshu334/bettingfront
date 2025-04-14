"use client";

import React, { useState } from "react";

interface Option {
  label: string;
  noOdds: number;
  yesOdds: number;
}

interface RunsOptionsCardProps {
  heading: string;
  options: Option[];
}

const RunsOptionsCard: React.FC<RunsOptionsCardProps> = ({ heading, options }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<"Yes" | "No" | "">("");
  const [selectedOdds, setSelectedOdds] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(100);

  const handleOddsClick = (label: string, choice: "Yes" | "No", odds: number) => {
    setSelectedOption(label);
    setSelectedChoice(choice);
    setSelectedOdds(odds);
  };

  const closeModal = () => {
    setSelectedOption(null);
    setSelectedChoice("");
    setSelectedOdds(null);
    setAmount(100);
  };

  const handlePlaceBet = () => {
    console.log(`Placed bet on "${selectedOption}" (${selectedChoice}) with odds ${selectedOdds} and amount ${amount}`);
    closeModal();
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg w-full overflow-hidden border border-gray-200">
        {/* Heading Bar */}
        <div className="bg-orange-200 px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
          {heading}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 text-center text-sm font-semibold border-b border-gray-300">
          <div className="text-left px-4 py-2 col-span-1 bg-gray-50">Normal</div>
          <div className="bg-red-500 text-white py-2">No</div>
          <div className="bg-blue-500 text-white py-2">Yes</div>
        </div>

        {/* Table Rows */}
        {options.map((option, index) => (
          <div
            key={index}
            className="grid grid-cols-3 text-center items-center border-b border-gray-100"
          >
            {/* Label */}
            <div className="text-left px-4 py-3 text-sm font-medium text-gray-700 bg-white">
              {option.label}
            </div>

            {/* No Odds */}
            <div
              className="py-3 bg-red-100 cursor-pointer hover:bg-red-200"
              onClick={() => handleOddsClick(option.label, "No", option.noOdds)}
            >
              <div className="text-lg font-bold text-red-700">{option.noOdds}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>

            {/* Yes Odds */}
            <div
              className="py-3 bg-blue-100 cursor-pointer hover:bg-blue-200"
              onClick={() => handleOddsClick(option.label, "Yes", option.yesOdds)}
            >
              <div className="text-lg font-bold text-blue-700">{option.yesOdds}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedOption && selectedOdds !== null && (
        <div className="fixed inset-0 z-50 text-black bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-pink-100 rounded-lg shadow-xl w-[90%] max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg font-bold text-gray-700 hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center text-red-900">Place Bet</h2>
            <div className="text-sm text-gray-700 mb-2">
              Option: <span className="font-medium">{selectedOption}</span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              Choice: <span className="font-medium">{selectedChoice}</span>
            </div>
            <div className="text-sm text-gray-700 mb-4">
              Odds: <span className="font-medium">{selectedOdds}</span>
            </div>

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

export default RunsOptionsCard;
