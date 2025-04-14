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
  userId: string;
  amount: number;
  betTitle: string;
  selectedTeam: 'pink' | 'blue';
  odds: number | string;
  won: boolean;
  creditedTo: 'admin' | 'member';
}

const statsData: Stat[] = [
  { title: "Lowest inning Runs IPL", pink: 100, blue: 144, total: "" },
  { title: "Highest inning Runs IPL", pink: 240, blue: 260, total: "" },
  { title: "Tournament topBatsman Runs in IPL", pink: 140, blue: 150, total: "" },
  { title: "Highest Runs Scorer", pink: 730, blue: 765, total: "" },
  { title: "Highest Partnership Runs in IPL", pink: 166, blue: 174, total: "" },
  { title: "Highest Wicket Taker IPL", pink: 27, blue: 29, total: "" },
  { title: "How many times 5 or More wickets taken by a Bowler", pink: 5, blue: 4, total: "" },
  { title: "Fastest 50 of IPL", pink: 15, blue: 17, total: "" },
  { title: "Total 4's in IPL", pink: 2215, blue: 2255, total: "" },
  { title: "Total 6's in IPL", pink: 1300, blue: 1345, total: "" },
  { title: "Total 30's in IPL", pink: 190, blue: 196, total: "" },
  { title: "Total 50s in IPL", pink: 146, blue: 153, total: "" },
  { title: "Total 100s in IPL", pink: 9, blue: 16, total: "" },
  { title: "Total No Ball's in IPL", pink: 68, blue: 73, total: "" },
  { title: "Total Caught outs in IPL", pink: 655, blue: 680, total: "" },
  { title: "Total Bowled in IPL", pink: 139, blue: 150, total: "" },
  { title: "Total Wickets in IPL", pink: 925, blue: 995, total: "" },
  { title: "Total Wides in IPL", pink: 865, blue: 895, total: "" },
  { title: "Total LWB's in IPL", pink: 44, blue: 49, total: "" },
  { title: "Most Ducks by Team", pink: 47, blue: 54, total: "" },
  { title: "Total Runout's in IPL", pink: 84, blue: 90, total: "" },
];

const IPLStatsPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedBet, setSelectedBet] = useState<Stat | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'pink' | 'blue'>('pink');
  const [amount, setAmount] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceBet = async (): Promise<void> => {
    if (selectedBet && amount > 0) {
      try {
        const betData: Bet = {
          userId: "current_user_id", // You should replace this with actual user ID from your auth system
          amount,
          betTitle: selectedBet.title,
          selectedTeam,
          odds: selectedTeam === 'pink' ? selectedBet.pink : selectedBet.blue,
          won: false, // Initially set to false, can be updated later
          creditedTo: "admin" // Or "member" based on your logic
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bet/place`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(betData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to place bet');
        }

        console.log("Bet placed successfully");
        resetBetState();
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
      } catch (err) {
        console.error("Error placing bet:", err);
       
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const openBetDialog = (item: Stat, team: 'pink' | 'blue') => {
    setSelectedBet(item);
    setSelectedTeam(team);
    setAmount(0); // Reset amount when opening new bet
    setShowDialog(true);
    setError(null); // Clear any previous errors
  };

  const resetBetState = () => {
    setShowDialog(false);
    setSelectedBet(null);
    setAmount(0);
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
              onClick={() => openBetDialog(item, 'pink')}
            >
              <div className="text-base">{item.pink}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
            <div
              className="col-span-1 p-3 bg-blue-100 font-semibold cursor-pointer"
              onClick={() => openBetDialog(item, 'blue')}
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
              onClick={resetBetState}
              className="absolute top-2 right-3 text-white bg-red-500 rounded-full px-2 text-sm"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-orange-900">Place Bet</h2>
            <p className="text-sm font-medium text-black">{selectedBet.title}</p>
            
            <div className={`p-2 rounded-md ${selectedTeam === 'pink' ? 'bg-pink-100' : 'bg-blue-100'}`}>
              <p className="font-bold">
                {selectedTeam === 'pink' ? 'Pink' : 'Blue'}: {selectedTeam === 'pink' ? selectedBet.pink : selectedBet.blue}
              </p>
            </div>

            <div>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="p-2 rounded-md bg-white w-full"
                placeholder="Amount"
                min="100"
              />
            </div>

            {/* Chips */}
            <div className="grid grid-cols-4 gap-2">
              {[1000, 2000, 5000, 10000, 20000, 25000, 50000, 75000, 90000, 95000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(prev => prev + val)}
                  className="bg-orange-400 hover:bg-orange-500 text-white py-1 rounded text-sm"
                >
                  +{val / 1000}k
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-700">Range: 100 to 2L</p>

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setAmount(0)}
                className="text-blue-700 underline text-sm"
              >
                Clear
              </button>
              <button
                onClick={handlePlaceBet}
                disabled={amount <= 0}
                className={`px-4 py-2 rounded ${amount > 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 cursor-not-allowed text-gray-200'}`}
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

      {/* Error Popup */}
      {error && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default IPLStatsPage;