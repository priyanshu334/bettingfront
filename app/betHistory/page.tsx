import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const BetHistory = () => {
  const data = [
    { sport: "Cricket", event: "Ipl-2025", market: "---", option: "123 back", amount: "1,000", status: "Current" },
  ];

  return (
    <div className="p-4  w-full mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">BET History</h1>
      <div className="flex space-x-2 mb-4">
        <Button variant="destructive">All Bet</Button>
        <Button variant="outline">Back</Button>
        <Button>Lay</Button>
      </div>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-red-700 text-white">
            {['Sports', 'Event Name', 'Market Name', 'User Option', 'Amount', 'Status'].map((heading) => (
              <th key={heading} className="p-2 border border-gray-300">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((bet, index) => (
            <tr key={index} className="bg-orange-200">
              <td className="p-2 border border-gray-300">{bet.sport}</td>
              <td className="p-2 border border-gray-300">{bet.event}</td>
              <td className="p-2 border border-gray-300">{bet.market}</td>
              <td className="p-2 border border-gray-300">{bet.option}</td>
              <td className="p-2 border border-gray-300">{bet.amount}</td>
              <td className="p-2 border border-gray-300">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-red-700 font-semibold">{bet.status}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Current</DropdownMenuItem>
                    <DropdownMenuItem>Settle</DropdownMenuItem>
                    <DropdownMenuItem>Un-Settle</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center space-x-2 mt-[600px]">
        <Button variant="outline" size="icon">{'<'}</Button>
        <span>2</span>
        <Button variant="outline" size="icon">{'>'}</Button>
      </div>
      <p className="text-center mt-2">Page 2 of 5</p>
    </div>
  );
};

export default BetHistory;
