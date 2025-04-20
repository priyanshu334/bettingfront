import React from "react";

const RulesList: React.FC = () => {
  const rules = [
    "All bets will be settled based on official results from the recognized governing body of the match.",
    "If a match is abandoned, postponed, or cancelled, all bets will be void unless the game is completed within 48 hours of the original start time.",
    "Bets on match winner (outright) will be settled based on the official result. In case of a tie where no tie-breaker is used, bets will be void.",
    "For 'Top Batsman/Bowler' markets, the player must be in the starting XI for bets to stand.",
    "In 'Total Runs' markets, the full quoted overs must be bowled unless the result is already determined.",
    "For live betting, all bets stand regardless of subsequent interruptions, unless the match is abandoned.",
    "Any changes to scheduled start times (within 12 hours) will not affect betting unless the match is postponed to another day.",
    "Bets placed after the official start time will be void, except for live betting markets which are clearly indicated.",
    "In case of a player substitution before the match starts, all bets on that player will be void.",
    "All betting rules are subject to the bookmaker's terms and conditions, which take precedence in case of any dispute."
  ];

  return (
    <div className="mx-auto w-full border rounded-lg overflow-hidden shadow-md">
      <div className="bg-blue-600 text-white text-xl font-bold p-4 text-center">
        Cricket Betting Rules
      </div>
      <div className="bg-white p-4">
        <ol className="list-decimal list-inside space-y-2">
          {rules.map((rule, index) => (
            <li key={index} className="text-gray-800 mb-2 pl-2">
              {rule}
            </li>
          ))}
        </ol>
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700 font-medium">
            Note: These rules are general guidelines. Always check specific terms with your bookmaker.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesList;