import React from "react";

const MatchOdds = () => {
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
          <div className="grid grid-cols-4 border-t text-center text-sm">
            <div className="col-span-2 py-2 px-3 text-left font-medium">Royal Challengers Bengaluru</div>
            <div className="bg-blue-400 py-2 font-semibold">
              1.82<br /><span className="text-xs text-gray-700">100</span>
            </div>
            <div className="bg-red-400 py-2 font-semibold">
              1.83<br /><span className="text-xs text-gray-700">100</span>
            </div>
          </div>
          <div className="grid grid-cols-4 border-t text-center text-sm">
            <div className="col-span-2 py-2 px-3 text-left font-medium">Delhi Capitals</div>
            <div className="bg-blue-400 py-2 font-semibold">
              2.2<br /><span className="text-xs text-gray-700">100</span>
            </div>
            <div className="bg-red-400 py-2 font-semibold">
              2.22<br /><span className="text-xs text-gray-700">100</span>
            </div>
          </div>
        </div>

        {/* Bookmaker Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">BOOKMAKER</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min:100 Max:100k</div>
          <div className="grid grid-cols-6 bg-gray-200 text-xs font-bold text-center">
            <span className="col-span-2 py-2">Teams</span>
            <span className="py-2">BACK</span>
            <span className="py-2">LAY</span>
            <span className="py-2">-</span>
            <span className="py-2">-</span>
          </div>
          <div className="grid grid-cols-6 border-t text-black text-center text-sm">
            <div className="col-span-2 py-2 text-left px-3 font-medium">Royal Challengers ...</div>
            <div className="bg-blue-400 py-2 font-semibold">83<br /><span className="text-xs text-gray-700">100</span></div>
            <div className="bg-red-400 py-2 font-semibold">86<br /><span className="text-xs text-gray-700">100</span></div>
            <span className="py-2">-</span>
            <span className="py-2">-</span>
          </div>
          <div className="grid grid-cols-6 border-t text-center text-sm">
            <div className="col-span-2 py-2 text-left px-3 font-medium">Delhi Capitals</div>
            <div className="bg-blue-400 py-2 font-semibold">115<br /><span className="text-xs text-gray-700">100</span></div>
            <div className="bg-red-400 py-2 font-semibold">121<br /><span className="text-xs text-gray-700">100</span></div>
            <span className="py-2">-</span>
            <span className="py-2">-</span>
          </div>
        </div>

        {/* Toss Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">TOSS</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min:100 Max:500k</div>
          <div className="grid grid-cols-5 bg-gray-200 text-xs font-bold text-center">
            <span className="col-span-2 py-2">Teams</span>
            <span className="py-2">BACK</span>
            <span className="py-2">LAY</span>
            <span className="py-2">-</span>
          </div>
          <div className="grid grid-cols-5 border-t text-center text-sm">
            <div className="col-span-2 py-2 text-left px-3 font-medium">Royal Challengers ...</div>
            <div className="bg-blue-200 py-2 font-semibold">98<br /><span className="text-xs text-gray-700">100</span></div>
            <div className="bg-red-200 py-2 font-semibold">0<br /><span className="text-xs text-gray-700">0.0</span></div>
            <span className="py-2">-</span>
          </div>
          <div className="grid grid-cols-5 border-t text-center text-sm">
            <div className="col-span-2 py-2 text-left px-3 font-medium">Delhi Capitals</div>
            <div className="bg-blue-200 py-2 font-semibold">98<br /><span className="text-xs text-gray-700">100</span></div>
            <div className="bg-red-200 py-2 font-semibold">0<br /><span className="text-xs text-gray-700">0.0</span></div>
            <span className="py-2">-</span>
          </div>
        </div>

        {/* Win Prediction Section */}
        <div className="text-black">
          <div className="bg-emerald-800 text-white font-semibold px-4 py-3 rounded-t-md">Who will Win the Match?</div>
          <div className="text-xs text-gray-600 mt-2 mb-2 px-1">Min: - Max: 1</div>
          <div className="grid grid-cols-2 gap-4 text-center mt-3">
            <div className="bg-blue-200 p-4 rounded shadow-md hover:shadow-lg transition duration-200">
              <div className="font-semibold text-sm mb-1">Royal Challengers Bengaluru</div>
              <div className="text-2xl font-bold text-blue-800">1.81</div>
            </div>
            <div className="bg-blue-200 p-4 rounded shadow-md hover:shadow-lg transition duration-200">
              <div className="font-semibold text-sm mb-1">Delhi Capitals</div>
              <div className="text-2xl font-bold text-blue-800">2.14</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOdds;
