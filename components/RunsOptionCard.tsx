"use client";

import React from "react";

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
  return (
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
          <div className="py-3 bg-red-100">
            <div className="text-lg font-bold text-red-700">{option.noOdds}</div>
            <div className="text-xs text-gray-600">100</div>
          </div>

          {/* Yes Odds */}
          <div className="py-3 bg-blue-100">
            <div className="text-lg font-bold text-blue-700">{option.yesOdds}</div>
            <div className="text-xs text-gray-600">100</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RunsOptionsCard;
