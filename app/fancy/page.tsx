"use client";
import React, { useState } from "react";

// Define types for the stat items and bet data
interface Stat {
  title: string;
  pink: number | string;
  blue: number | string;
  total: string;
}

interface Bet {
  title: string;
  odds: number;
  amount: number;
}

const statsData: Stat[] = [
  { title: "Total Wickets in IPL", pink: 925, blue: 945, total: "Matches Played :- 24" },
  { title: "Total Wides in IPL", pink: 865, blue: 895, total: "314" },
  { title: "Total LBW in IPL", pink: 44, blue: 49, total: "12 (Matches Played :- 24)" },
  { title: "Total Stumpings in IPL", pink: 15, blue: 17, total: "5 (Matches Played :- 24)" },
  { title: "Total Run Outs in IPL", pink: 48, blue: 53, total: "13 Run Outs (Matches Played :- 24)" },
  { title: "Total Duck Outs in IPL", pink: 84, blue: 90, total: "25 (Matches Played :- 24)" },
  { title: "Total Dot Balls in IPL", pink: 178, blue: 182, total: "62 (Matches Played :- 24)" },
  { title: "Total Free Hits in IPL", pink: 0, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total No Balls in IPL", pink: 1, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total Highest Scoring Overs", pink: 157, blue: 157, total: "504" },
  { title: "Total 50s in IPL", pink: 46, blue: 51, total: "Total: 97 (Matches Played :- 24)" },
  { title: "Total 100s in IPL", pink: 5, blue: 4, total: "Total: 9 (Matches Played :- 24)" },
  { title: "Highest Partnership in IPL", pink: 142, blue: 138, total: "280 Runs (RCB vs MI)" },
  { title: "Total Purple Caps", pink: "Mohammed Siraj", blue: "Kuldeep Yadav", total: "Wickets: 24 (Season)" },
  { title: "Total Orange Caps", pink: "Virat Kohli", blue: "David Warner", total: "Runs: 741 (Season)" },
  { title: "Most No Balls by Team", pink: 12, blue: 14, total: "26 (Season Total)" },
  { title: "Most Run Outs by Team", pink: 7, blue: 8, total: "15 (Season Total)" },
  { title: "Most Stumpings by Team", pink: 3, blue: 4, total: "7 (Season Total)" },
  { title: "Most Ducks by Team", pink: 9, blue: 7, total: "16 (Season Total)" },
  { title: "Total Wides in IPL", pink: 865, blue: 895, total: "314" },
];

const IPLStatsPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedBet, setSelectedBet] = useState<Stat | null>(null);
  const [odds, setOdds] = useState<number>(1);
  const [amount, setAmount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handlePlaceBet = (): void => {
    if (selectedBet) {
      const betData: Bet = {
        title: selectedBet.title,
        odds,
        amount,
      };
      console.log("Placed bet:", betData);
      setShowDialog(false);
      setShowConfirmation(true);

      // Hide after 3 seconds
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">IPL Match Stats</h1>

      <div className="max-w-3xl mx-auto bg-white shadow rounded-xl overflow-hidden">
        {statsData.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 items-center text-center border-b last:border-b-0"
          >
            <div className="col-span-1 p-3 font-semibold text-sm text-left border-r">
              {item.title}
            </div>
            <div
              className="col-span-1 p-3 bg-pink-100 font-semibold cursor-pointer"
              onClick={() => {
                setSelectedBet(item);
                setShowDialog(true);
              }}
            >
              <div className="text-base">{item.pink}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
            <div
              className="col-span-1 p-3 bg-blue-100 font-semibold cursor-pointer"
              onClick={() => {
                setSelectedBet(item);
                setShowDialog(true);
              }}
            >
              <div className="text-base">{item.blue}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
            <div className="col-span-1 p-3 text-red-600 text-sm">{item.total}</div>
          </div>
        ))}
      </div>

      {/* Betting Dialog */}
      {showDialog && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-pink-200 border-t-[6px] border-orange-700 rounded-xl p-5 w-[400px] shadow-lg space-y-4 relative">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-2 right-3 text-white bg-red-500 rounded-full px-2 text-sm"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-orange-900">Place Bet</h2>
            <p className="text-sm font-medium text-black">{selectedBet.title}</p>

            {/* Odds and Amount */}
            <div className="grid grid-cols-2 gap-2 items-center">
              <input
                type="number"
                value={odds}
                onChange={(e) => setOdds(parseInt(e.target.value))}
                className="p-2 rounded-md bg-white w-full"
                placeholder="Odds"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="p-2 rounded-md bg-white w-full"
                placeholder="Amount"
              />
            </div>

            {/* Chips */}
            <div className="grid grid-cols-4 gap-2">
              {[1000, 2000, 5000, 10000, 20000, 25000, 50000, 75000, 90000, 95000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(amount + val)}
                  className="bg-orange-400 hover:bg-orange-500 text-white py-1 rounded text-sm"
                >
                  +{val / 1000}k
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-700">Range: 100 to 2L</p>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setAmount(0);
                  setOdds(1);
                }}
                className="text-blue-700 underline text-sm"
              >
                Clear
              </button>
              <button
                onClick={handlePlaceBet}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Place Bet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300">
          🎉 Bet placed successfully!
        </div>
      )}
    </div>
  );
};

export default IPLStatsPage;
