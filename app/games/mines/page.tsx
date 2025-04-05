"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Grid = (null | 'diamond' | 'bomb')[][];

const MinesGame: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(Array(5).fill(null).map(() => Array(5).fill(null)));
  const [reward, setReward] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [bombPositions, setBombPositions] = useState<{row: number, col: number}[]>([]);
  const [cashoutMessage, setCashoutMessage] = useState<string | null>(null);
  
  // Pre-determine bomb positions at the start of each game for fairness
  useEffect(() => {
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
  }, [gameOver]);

  const handleTileClick = (row: number, col: number): void => {
    if (gameOver || grid[row][col]) return;
    
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
      setReward(prev => prev + 10);
    }
    
    setGrid(newGrid);
  };

  const resetGame = (): void => {
    setGrid(Array(5).fill(null).map(() => Array(5).fill(null)));
    setReward(0);
    setGameOver(false);
    setCashoutMessage(null);
  };
  
  const cashOut = (): void => {
    setCashoutMessage(`Congratulations! You cashed out $${reward}!`);
    setGameOver(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Mines Game</h1>
      
      <Card className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        {cashoutMessage && (
          <div className="mb-4 p-3 rounded-lg text-center font-semibold text-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            {cashoutMessage}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Current Reward</span>
            <span className="text-2xl font-bold text-green-400">${reward}</span>
          </div>
          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 font-medium"
            onClick={cashOut}
            disabled={gameOver || reward === 0}
          >
            Cash Out
          </Button>
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
        
        <div className="flex justify-center">
          <Button
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 font-medium"
            onClick={resetGame}
          >
            New Game
          </Button>
        </div>
      </Card>
      
      <div className="mt-6 text-sm text-gray-400 text-center max-w-md">
        <p>Click tiles to reveal diamonds (💎) and earn $10 each. Avoid bombs (💣) or you'll lose everything!</p>
      </div>
    </div>
  );
};

export default MinesGame;