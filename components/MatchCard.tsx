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
  team1: React.ReactNode;
  team2: React.ReactNode;
  buttons: string[];
}

const MatchCard: React.FC<MatchCardProps> = ({ heading, team1, team2, buttons }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState("");
  const [betAmount, setBetAmount] = useState("");

  const handleOpenBetDialog = (bet: string) => {
    setSelectedBet(bet);
    setIsDialogOpen(true);
  };

  const handlePlaceBet = () => {
    // Here you would handle the actual bet placement logic
    // For now we'll just close the dialog and reset state
    setIsDialogOpen(false);
    setBetAmount("");
    
    // In a real app, you would call an API to process the bet
    console.log(`Bet placed: ${selectedBet} with ₹${betAmount}`);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
        <h2 className="text-xl font-bold text-center mb-4 text-slate-800">{heading}</h2>
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div className="text-left font-medium text-lg">{team1}</div>
            <div className="text-xs text-gray-500 font-medium">VS</div>
            <div className="text-right font-medium text-lg">{team2}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {buttons.map((btn, index) => {
              const [label, odds] = btn.split(":");
              return (
                <button
                  key={index}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center"
                  onClick={() => handleOpenBetDialog(btn)}
                >
                  <span className="mb-1">{label}</span>
                  <Badge className="bg-blue-700">{odds}</Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Place Your Bet</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Selected Bet</div>
              <div className="flex justify-between items-center">
                <div className="font-medium">{heading}</div>
                <Badge className="bg-blue-500">{selectedBet}</Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="bet-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Amount (₹)
              </label>
              <Input
                id="bet-amount"
                type="number"
                placeholder="100"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="10"
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum bet: ₹10</p>
            </div>
            
            <div className="mt-2 text-sm text-gray-500">
              {betAmount && !isNaN(parseFloat(betAmount)) && parseFloat(betAmount) > 0 ? (
                <div className="bg-blue-50 p-2 rounded-md">
                  <p>Potential winning: ₹{(parseFloat(betAmount) * parseFloat(selectedBet.split(":")[1] || "0")).toFixed(2)}</p>
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter className="flex sm:justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handlePlaceBet} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!betAmount || isNaN(parseFloat(betAmount)) || parseFloat(betAmount) < 10}
            >
              Place Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MatchCard;