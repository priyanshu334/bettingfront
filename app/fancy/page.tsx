import React from "react";

const statsData = [
  { title: "Total Wickets in IPL", pink: 925, blue: 945, total: "Matches Played :- 24" },
  { title: "Total Wides in IPL", pink: 865, blue: 895, total: "314" },
  { title: "Total LBW in IPL", pink: 44, blue: 49, total: "12 (Matches Played :- 24)" },
  { title: "Total Stumpings in IPL", pink: 15, blue: 17, total: "5 (Matches Played :- 24)" },
  { title: "Total Run Out in IPL", pink: 48, blue: 53, total: "13 Run Out" },
  { title: "Total Duck Outs in IPL", pink: 84, blue: 90, total: "25 (Matches Played :- 24)" },
  { title: "Total Dot Balls in IPL", pink: 178, blue: 182, total: "62 (Matches Played :- 24)" },
  { title: "Total Free Hits in IPL", pink: 0, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total No Balls in IPL", pink: 1, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total Highest Scoring Overs", pink: 157, blue: 157, total: "504" },
];

export default function IPLStatsPage() {
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
            <div className="col-span-1 p-3 bg-pink-100 font-semibold">
              <div className="text-base">{item.pink}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
            <div className="col-span-1 p-3 bg-blue-100 font-semibold">
              <div className="text-base">{item.blue}</div>
              <div className="text-xs text-gray-600">100</div>
            </div>
            <div className="col-span-1 p-3 text-red-600 text-sm">
              {item.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
