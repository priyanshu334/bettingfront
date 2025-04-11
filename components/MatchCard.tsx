"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  heading: string;
  // Allow team1 and team2 to be strings or other React nodes
  team1: React.ReactNode;
  team2: React.ReactNode;
  buttons: string[]; // Expecting strings like "Label:Odds"
}

const MatchCard: React.FC<MatchCardProps> = ({ heading, team1, team2, buttons }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(""); // Stores the full "Label:Odds" string
  const [selectedOdds, setSelectedOdds] = useState("0"); // Stores just the odds part
  const [selectedLabel, setSelectedLabel] = useState(""); // Stores just the label part
  const [betAmount, setBetAmount] = useState("");

  const handleOpenBetDialog = (buttonString: string) => {
    const [label, odds] = buttonString.split(":");
    setSelectedBet(buttonString); // Store the original string if needed
    setSelectedLabel(label || "");   // Store the label part
    setSelectedOdds(odds || "0");  // Store the odds part
    setIsDialogOpen(true);
    setBetAmount(""); // Reset amount when opening dialog
  };

  const handlePlaceBet = () => {
    // In a real app, you would use selectedLabel, selectedOdds, betAmount
    // to call an API or update state management.
    console.log(`Bet placed on "${selectedLabel}" (Odds: ${selectedOdds}) with amount ₹${betAmount}`);

    // Close the dialog and reset relevant state
    setIsDialogOpen(false);
    setBetAmount("");
    // Optionally reset selectedBet states if needed after placement
    // setSelectedBet("");
    // setSelectedLabel("");
    // setSelectedOdds("0");
  };

  // Calculate potential winnings safely
  const calculatePotentialWinnings = () => {
    const amount = parseFloat(betAmount);
    const odds = parseFloat(selectedOdds);
    if (!isNaN(amount) && amount > 0 && !isNaN(odds) && odds > 0) {
      return (amount * odds).toFixed(2);
    }
    return "0.00";
  };

  const potentialWinnings = calculatePotentialWinnings();
  // Validate bet amount for enabling the Place Bet button
  const isBetAmountValid = !isNaN(parseFloat(betAmount)) && parseFloat(betAmount) >= 10;

  return (
    <>
      {/* The Card displaying the betting option */}
      <Card className="w-full max-w-md mx-auto p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700 bg-gray-800 text-gray-200">
        {/* Heading (e.g., "Who will win the match") */}
        <h2 className="text-lg font-semibold text-center mb-3 text-white">{heading}</h2>
        <CardContent className="p-0">
          {/* Optional Team Display Area (if team1/team2 are provided) */}
          {(team1 || team2) && (
             <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md mb-4 text-sm">
               <div className="text-left font-medium">{team1}</div>
               {/* Show VS only if both teams are present */}
               {team1 && team2 && <div className="text-xs text-gray-400 font-medium px-2">VS</div>}
               <div className="text-right font-medium">{team2}</div>
             </div>
          )}
          {/* Grid for Betting Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {buttons.map((btnString, index) => {
              // Split each button string ("Label:Odds")
              const [label, odds] = btnString.split(":");
              return (
                <button
                  key={index}
                  // Styling for the button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-1 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center h-16 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                  // Open the dialog when clicked
                  onClick={() => handleOpenBetDialog(btnString)}
                  title={`Bet on ${label}`} // Tooltip for accessibility
                  disabled={!odds} // Disable button if odds are missing
                >
                  {/* Display the Label (e.g., "CSK", "Draw", "Over 40.5") */}
                  {/* line-clamp-2 limits label to 2 lines */}
                  <span className="mb-1 text-center line-clamp-2">{label || "N/A"}</span>
                  {/* Display the Odds */}
                  <Badge variant="secondary" className="bg-gray-600 text-gray-100 px-1.5 py-0.5 text-xs">
                    {odds || "N/A"} {/* Handle cases where odds might be missing */}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* The Bet Placement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-xl p-0">
          <DialogHeader className="p-4 border-b border-gray-200">
            {/* Dialog Title */}
            <DialogTitle className="text-center text-xl font-semibold text-gray-800">Place Your Bet</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {/* Section displaying the selected bet details */}
            <div className="mb-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-2">Selected Bet Option</div>
              <div className="flex justify-between items-center">
                {/* Display the selected label */}
                <div className="font-semibold text-gray-800 text-lg">{selectedLabel}</div>
                {/* Display the selected odds */}
                <Badge className="bg-blue-600 text-white px-2 py-1 text-sm">{selectedOdds}</Badge>
              </div>
               {/* Optionally display the original heading if it provides context */}
               {/* <div className="text-xs text-gray-500 mt-1">{heading}</div> */}
            </div>

            {/* Bet Amount Input */}
            <div className="mb-4">
              <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Amount (₹)
              </label>
              <Input
                id="bet-amount"
                type="number"
                placeholder="Minimum ₹10"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="10" // HTML5 validation
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum bet: ₹10</p>
            </div>

            {/* Potential Winnings Display */}
            <div className="mt-2 text-sm h-10 flex items-center"> {/* Fixed height to prevent layout shift */}
              {isBetAmountValid ? (
                <div className="bg-blue-50 text-blue-800 p-2 rounded-md w-full border border-blue-200">
                  Potential Winnings: <span className="font-semibold">₹{potentialWinnings}</span>
                </div>
              ) : (
                 // Placeholder or message when amount is invalid/empty
                 <div className="text-gray-400 italic">Enter a valid amount (₹10+)</div>
              )}
            </div>
          </div>
          {/* Dialog Footer with Buttons */}
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit" // Should ideally be tied to a form submit if using a form
              onClick={handlePlaceBet}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              // Disable button if amount is invalid
              disabled={!isBetAmountValid}
            >
              Place Bet (₹{betAmount || 0})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCard;