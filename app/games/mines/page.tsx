"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Grid = (null | 'diamond' | 'bomb')[][];

const MinesGame: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(Array(5).fill(null).map(() => Array(5).fill(null)))
  const [reward, setReward] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [bombPositions, setBombPositions] = useState<{row: number, col: number}[]>([]);
  const [cashoutMessage, setCashoutMessage] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  
  // Pre-determine bomb positions at the start of each game for fairness
  useEffect(() => {
    if (!gameStarted) return;
    
    const newBombPositions: {row: number, col: number}[] = [];
    while (newBombPositions.length < 5) { // 5 bombs in total (20% of 25 tiles)
      const row = Math.floor(Math.random() * 5);
      const col = Math.floor(Math.random() * 5);
      
      // Check if this position is already selected
      if (!newBombPositions.some(pos => pos.row === row && pos.col === col)) {
        newBombPositions.push({row, col});
      }
    }
    setBombPositions(newBombPositions);
  }, [gameStarted, gameOver]);

  const handleTileClick = (row: number, col: number): void => {
    if (gameOver || grid[row][col] || !gameStarted) return;
    
    const newGrid = [...grid.map(r => [...r])];
    const isMine = bombPositions.some(pos => pos.row === row && pos.col === col);
    
    if (isMine) {
      newGrid[row][col] = 'bomb';
      setGameOver(true);
      
      // Show all bombs
      bombPositions.forEach(pos => {
        newGrid[pos.row][pos.col] = 'bomb';
      });
      
      setCashoutMessage("Game Over! You hit a bomb!");
    } else {
      newGrid[row][col] = 'diamond';
      const newMultiplier = multiplier + 0.2; // Increase multiplier by 0.2 for each diamond
      setMultiplier(newMultiplier);
      setReward(Number(betAmount) * newMultiplier);
    }
    
    setGrid(newGrid);
  };

  const resetGame = (): void => {
    setGrid(Array(5).fill(null).map(() => Array(5).fill(null)));
    setReward(0);
    setGameOver(false);
    setGameStarted(false);
    setCashoutMessage(null);
    setMultiplier(1);
    setBetAmount("");
  };
  
  const cashOut = (): void => {
    if (!gameStarted) return;
    setCashoutMessage(`Congratulations! You cashed out $${reward.toFixed(2)}!`);
    setGameOver(true);
  };

  const startGame = () => {
    if (!betAmount || isNaN(Number(betAmount))) {
      setCashoutMessage("Please enter a valid bet amount");
      return;
    }
    if (Number(betAmount) <= 0) {
      setCashoutMessage("Bet amount must be greater than 0");
      return;
    }
    
    setGameStarted(true);
    setGameOver(false);
    setCashoutMessage(null);
    setReward(Number(betAmount)); // Initial reward is the bet amount (1x multiplier)
    setMultiplier(1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Mines Game</h1>
      
      <Card className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        {cashoutMessage && (
          <div className={`mb-4 p-3 rounded-lg text-center font-semibold text-lg bg-gradient-to-r ${cashoutMessage.includes("Congratulations") ? 'from-green-500/20 to-emerald-500/20 border border-green-500/30' : 'from-blue-500/20 to-purple-500/20 border border-blue-500/30'}`}>
            {cashoutMessage}
          </div>
        )}
        
        {!gameStarted ? (
          <div className="mb-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Enter Bet Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 font-medium"
              onClick={startGame}
            >
              Start Game
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Current Multiplier</span>
                <span className="text-2xl font-bold text-purple-400">{multiplier.toFixed(1)}x</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Potential Reward</span>
                <span className="text-2xl font-bold text-green-400">${reward.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                    className={`aspect-square flex items-center justify-center text-xl
                      ${cell === null ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' : 
                        cell === 'diamond' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 
                        'bg-gradient-to-br from-red-500 to-orange-600'}
                      border ${cell === null ? 'border-gray-600' : 'border-gray-500'} rounded-lg transition-all duration-200`}
                    disabled={gameOver || cell !== null}
                  >
                    {cell === 'diamond' && '💎'}
                    {cell === 'bomb' && '💣'}
                  </Button>
                ))
              )}
            </div>
            
            <div className="flex justify-between">
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 font-medium"
                onClick={cashOut}
                disabled={gameOver}
              >
                Cash Out
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 font-medium"
                onClick={resetGame}
              >
                New Game
              </Button>
            </div>
          </>
        )}
      </Card>
      
      <div className="mt-6 text-sm text-gray-400 text-center max-w-md">
        <p>Click tiles to reveal diamonds (💎) and increase your multiplier. Avoid bombs (💣) or you'll lose your bet!</p>
        <p className="mt-2">Current bet: ${betAmount || "0.00"}</p>
      </div>
    </div>
  );
};

export default MinesGame;