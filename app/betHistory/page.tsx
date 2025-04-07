"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BetHistory = () => {
  const data = [
    {
      sport: "Cricket",
      event: "Ipl-2025",
      market: "---",
      option: "123 back",
      amount: "1,000",
      status: "Current",
    },
    {
      sport: "Football",
      event: "Premier League",
      market: "Match Odds",
      option: "Team A back",
      amount: "500",
      status: "Settle",
    },
    {
      sport: "Tennis",
      event: "US Open",
      market: "Set Winner",
      option: "Player B back",
      amount: "750",
      status: "Un-Settle",
    },
  ];

  return (
    <div className="p-6 w-full mx-auto bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-700 text-white">
          <CardTitle className="text-2xl font-bold">BET HISTORY</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700 font-medium">All Bet</Button>
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">Back</Button>
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">Lay</Button>
          </div>

          {/* Table container with overflow for mobile */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-[600px] w-full border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white">
                  {[
                    "Sports",
                    "Event Name",
                    "Market Name",
                    "User Option",
                    "Amount",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="p-3 border border-blue-800 text-left font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((bet, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border border-gray-200">{bet.sport}</td>
                    <td className="p-3 border border-gray-200">{bet.event}</td>
                    <td className="p-3 border border-gray-200">{bet.market}</td>
                    <td className="p-3 border border-gray-200 font-medium">{bet.option}</td>
                    <td className="p-3 border border-gray-200 font-medium text-blue-600">{bet.amount}</td>
                    <td className="p-3 border border-gray-200">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`px-4 py-1 font-medium ${
                              bet.status === "Current" 
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200" 
                                : bet.status === "Settle" 
                                ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                : "bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                            }`}
                          >
                            {bet.status}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer hover:bg-yellow-50">Current</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-green-50">Settle</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-red-50">Un-Settle</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing page 2 of 5
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:bg-gray-100"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(page => (
                  <Button 
                    key={page}
                    variant={page === 2 ? "default" : "outline"}
                    className={`w-10 h-10 ${page === 2 ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:bg-gray-100"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetHistory;