import React, { useState } from "react";

type TeamOdds = {
  team: string;
  back: string;
  lay: string;
  stake: string;
};

type BookmakerOdds = {
  team: string;
  back: string;
  lay: string;
  stake: string;
};

type TossOdds = {
  team: string;
  back: string;
  lay: string;
  stake: string;
};

type WinPrediction = {
  team: string;
  odds: string;
};

type MatchOddsProps = {
  matchOdds: TeamOdds[];
  bookmakerOdds: BookmakerOdds[];
  tossOdds: TossOdds[];
  winPrediction: WinPrediction[];
};

const BetDialog: React.FC<{
  title: string;
  currentStake: string;
  oddsValue: string;
  onClose: () => void;
  onPlaceBet: (amount: string) => void;
}> = ({ title, currentStake, oddsValue, onClose, onPlaceBet }) => {
  const [amount, setAmount] = useState(currentStake);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleQuickAmountAdd = (value: number) => {
    setAmount(prev => {
      const currentAmount = parseInt(prev) || 0;
      return (currentAmount + value).toString();
    });
  };

  const handleClear = () => {
    setAmount("0");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center text-black justify-center z-50">
      <div className="w-full max-w-md rounded overflow-hidden">
        <div className="bg-orange-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Place Bet</h2>
          <button onClick={onClose} className="text-white text-3xl">&times;</button>
        </div>
        
        <div className="bg-pink-200 p-4">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl">{title}</h3>
            <div className="text-xl">Profit: 0</div>
          </div>
          
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <div className="text-xl mb-2">Odds</div>
              <input 
                type="text" 
                value={oddsValue}
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-white"
              />
            </div>
            <div className="w-1/2 pl-2">
              <div className="text-xl mb-2">Amount</div>
              <input 
                type="text" 
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 mb-4">
            <button onClick={() => handleQuickAmountAdd(1000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+1k</button>
            <button onClick={() => handleQuickAmountAdd(2000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+2k</button>
            <button onClick={() => handleQuickAmountAdd(5000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+5k</button>
            <button onClick={() => handleQuickAmountAdd(10000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+10k</button>
          </div>
          
          <div className="grid grid-cols-4 gap-1 mb-4">
            <button onClick={() => handleQuickAmountAdd(20000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+20k</button>
            <button onClick={() => handleQuickAmountAdd(25000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+25k</button>
            <button onClick={() => handleQuickAmountAdd(50000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+50k</button>
            <button onClick={() => handleQuickAmountAdd(75000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+75k</button>
          </div>
          
          <div className="grid grid-cols-2 gap-1 mb-6">
            <button onClick={() => handleQuickAmountAdd(90000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+90k</button>
            <button onClick={() => handleQuickAmountAdd(95000)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded text-lg">+95k</button>
          </div>
          
          <div className="grid grid-cols-2 gap-1 mb-4">
            <button onClick={handleClear} className="bg-blue-500 text-white py-3 text-xl font-bold">Clear</button>
            <button 
              onClick={() => onPlaceBet(amount)}
              className="bg-green-700 hover:bg-green-800 text-white py-3 text-xl font-bold"
            >
              Place Bet
            </button>
          </div>
          
          <div className="mb-2 text-lg">Range: 100 to 2L</div>
          <div className="w-full h-4 bg-pink-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationDialog: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <div className="text-xl font-bold mb-4">{message}</div>
        <button 
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const MatchOdds: React.FC<MatchOddsProps> = ({ 
  matchOdds, 
  bookmakerOdds, 
  tossOdds, 
  winPrediction 
}) => {
  const [showBetDialog, setShowBetDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentBetTitle, setCurrentBetTitle] = useState("");
  const [currentStake, setCurrentStake] = useState("");
  const [currentOddsValue, setCurrentOddsValue] = useState("");

  const handlePlaceBet = (amount: string) => {
    console.log(`Placing bet: ${amount} on ${currentBetTitle} with odds ${currentOddsValue}`);
    setShowBetDialog(false);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      <div className="p-4 space-y-6 text-sm bg-gray-50 font-sans shadow-lg rounded-lg w-full">
        {/* Match Odds Header */}
        <div className="flex items-center justify-between bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">
          <span className="text-base">Match Odds</span>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1 rounded transition duration-200">
            CASHOUT
          </button>
        </div>

        {/* Match Odds Table */}
        <div className="border border-gray-300 text-black rounded-md overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 bg-gray-200 text-xs font-bold text-center">
            <span className="col-span-2 py-2">Teams</span>
            <span className="py-2">BACK</span>
            <span className="py-2">LAY</span>
          </div>
          {matchOdds.map((team, i) => (
            <div key={i} className="grid grid-cols-4 border-t text-center text-sm">
              <div className="col-span-2 py-2 px-3 text-left font-medium">{team.team}</div>
              <div 
                className="bg-blue-400 py-2 font-semibold cursor-pointer hover:bg-blue-500 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Match Odds - ${team.team} (BACK)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.back);
                  setShowBetDialog(true);
                }}
              >
                {team.back}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
              <div 
                className="bg-red-400 py-2 font-semibold cursor-pointer hover:bg-red-500 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Match Odds - ${team.team} (LAY)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.lay);
                  setShowBetDialog(true);
                }}
              >
                {team.lay}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bookmaker Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">BOOKMAKER</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min:100 Max:100k</div>
          <div className="grid grid-cols-4 bg-gray-200 text-xs font-bold text-center">
            <span className="col-span-2 py-2">Teams</span>
            <span className="py-2">BACK</span>
            <span className="py-2">LAY</span>
            <span className="py-2">-</span>
            <span className="py-2">-</span>
          </div>
          {bookmakerOdds.map((team, i) => (
            <div key={i} className="grid grid-cols-4 border-t text-black text-center text-sm">
              <div className="col-span-2 py-2 text-left px-3 font-medium">{team.team}</div>
              <div 
                className="bg-blue-400 py-2 font-semibold cursor-pointer hover:bg-blue-500 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Bookmaker - ${team.team} (BACK)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.back);
                  setShowBetDialog(true);
                }}
              >
                {team.back}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
              <div 
                className="bg-red-400 py-2 font-semibold cursor-pointer hover:bg-red-500 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Bookmaker - ${team.team} (LAY)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.lay);
                  setShowBetDialog(true);
                }}
              >
                {team.lay}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
              <span className="py-2">-</span>
              <span className="py-2">-</span>
            </div>
          ))}
        </div>

        {/* Toss Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">TOSS</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min:100 Max:500k</div>
          <div className="grid grid-cols-4 bg-gray-200 text-xs font-bold text-center">
            <span className="col-span-2 py-2">Teams</span>
            <span className="py-2">BACK</span>
            <span className="py-2">LAY</span>
            <span className="py-2">-</span>
          </div>
          {tossOdds.map((team, i) => (
            <div key={i} className="grid grid-cols-4 border-t text-center text-sm">
              <div className="col-span-2 py-2 text-left px-3 font-medium">{team.team}</div>
              <div 
                className="bg-blue-200 py-2 font-semibold cursor-pointer hover:bg-blue-300 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Toss - ${team.team} (BACK)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.back);
                  setShowBetDialog(true);
                }}
              >
                {team.back}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
              <div 
                className="bg-red-200 py-2 font-semibold cursor-pointer hover:bg-red-300 transition duration-200"
                onClick={() => {
                  setCurrentBetTitle(`Toss - ${team.team} (LAY)`);
                  setCurrentStake(team.stake);
                  setCurrentOddsValue(team.lay);
                  setShowBetDialog(true);
                }}
              >
                {team.lay}<br /><span className="text-xs text-gray-700">{team.stake}</span>
              </div>
              <span className="py-2">-</span>
            </div>
          ))}
        </div>

        {/* Win Prediction Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">Who will Win the Match?</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min: - Max: 1</div>
          <div className="grid grid-cols-2 gap-4 text-center mt-3">
            {winPrediction.map((item, i) => (
              <div 
                key={i} 
                className="bg-blue-200 p-4 rounded shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                onClick={() => {
                  setCurrentBetTitle(`Win Prediction - ${item.team}`);
                  setCurrentStake("100");
                  setCurrentOddsValue(item.odds);
                  setShowBetDialog(true);
                }}
              >
                <div className="font-semibold text-sm mb-1">{item.team}</div>
                <div className="text-2xl font-bold text-blue-800">{item.odds}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bet Dialog */}
        {showBetDialog && (
          <BetDialog
            title={currentBetTitle}
            currentStake={currentStake}
            oddsValue={currentOddsValue}
            onClose={() => setShowBetDialog(false)}
            onPlaceBet={handlePlaceBet}
          />
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <ConfirmationDialog
            message="Your bet has been placed successfully!"
            onClose={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MatchOdds;