"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

interface Position {
  row: number;
  col: number;
}

interface Tile extends Position {
  revealed: boolean;
  isBomb: boolean;
}

interface GameSettings {
  gridSize: number;
  bombCount: number;
  minBet: number;
  maxBet: number;
  baseMultiplier: number;
  multiplierIncrement: number;
}

interface RevealedTile extends Position {
  isBomb: boolean;
}

type GameState = 'active' | 'cashed_out' | 'lost';

interface GameSession {
  sessionId: string;
  gridSize: number;
  bombPositions: Position[];
  revealedTiles: RevealedTile[];
  multiplier: number;
  state: GameState;
}

interface StartGameResponse {
  sessionId: string;
  gridSize: number;
  currentBalance: number;
}

interface RevealTileResponse {
  result: 'success' | 'lost';
  revealedTile: RevealedTile;
  bombPositions: Position[];
  currentMultiplier: number;
  potentialReward: number;
}

interface CashoutResponse {
  winnings: number;
  newBalance: number;
  multiplier: number;
}

interface User {
  id: string;
  name: string | null;
  balance: number;
  token: string;
}

const MinesGame: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [reward, setReward] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [cashoutMessage, setCashoutMessage] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch user data and game settings on component mount
  useEffect(() => {
    const fetchUserAndSettings = async (): Promise<void> => {
      try {
        // Fetch user data from your custom auth endpoint
        const userResponse = await axios.get<User>('/api/auth/user');
        setUser(userResponse.data);
        
        // Fetch game settings
        const settingsResponse = await axios.get<GameSettings>('/api/games/mines/settings');
        setSettings(settingsResponse.data);
      } catch (error) {
        if ((error as AxiosError)?.response?.status === 401) {
          toast.error('Please login to play');
        } else {
          toast.error('Failed to load game data');
          console.error('Error fetching data:', error);
        }
      }
    };
    
    fetchUserAndSettings();
  }, []);

  // Initialize grid based on settings
  useEffect(() => {
    if (settings) {
      const initialGrid: Tile[][] = [];
      for (let i = 0; i < settings.gridSize; i++) {
        const row: Tile[] = [];
        for (let j = 0; j < settings.gridSize; j++) {
          row.push({
            row: i,
            col: j,
            revealed: false,
            isBomb: false
          });
        }
        initialGrid.push(row);
      }
      setGrid(initialGrid);
    }
  }, [settings]);

  const getAuthHeaders = () => {
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  const startGame = async (): Promise<void> => {
    if (!user) {
      toast.error('Please login to play');
      return;
    }

    if (!betAmount || isNaN(Number(betAmount))) {
      toast.error('Please enter a valid bet amount');
      return;
    }

    const amount = Number(betAmount);
    if (settings && (amount < settings.minBet || amount > settings.maxBet)) {
      toast.error(`Bet must be between ${settings.minBet} and ${settings.maxBet}`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<StartGameResponse>('/api/games/mines/start', {
        betAmount: amount
      }, {
        headers: getAuthHeaders()
      });

      const { sessionId } = response.data;
      
      // Get the full session details
      const sessionResponse = await axios.get<GameSession>(
        `/api/games/mines/session/${sessionId}`,
        { headers: getAuthHeaders() }
      );

      setCurrentSession(sessionResponse.data);
      setGameStarted(true);
      setGameOver(false);
      setCashoutMessage(null);
      setMultiplier(sessionResponse.data.multiplier || 1);
      setReward(amount * (sessionResponse.data.multiplier || 1));
      toast.success('Game started!');
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTileClick = async (row: number, col: number): Promise<void> => {
    if (!currentSession || gameOver || grid[row][col].revealed || !gameStarted) return;

    setIsLoading(true);
    try {
      const response = await axios.post<RevealTileResponse>('/api/games/mines/reveal', {
        sessionId: currentSession.sessionId,
        row,
        col
      }, {
        headers: getAuthHeaders()
      });

      const { result, revealedTile, bombPositions, currentMultiplier, potentialReward } = response.data;

      // Update local state
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...newGrid[row][col],
        revealed: true,
        isBomb: revealedTile.isBomb
      };

      setGrid(newGrid);
      setMultiplier(currentMultiplier);
      setReward(potentialReward);

      if (result === 'lost') {
        setGameOver(true);
        // Reveal all bombs
        bombPositions.forEach((pos: Position) => {
          if (!newGrid[pos.row][pos.col].revealed) {
            newGrid[pos.row][pos.col] = {
              ...newGrid[pos.row][pos.col],
              revealed: true,
              isBomb: true
            };
          }
        });
        setGrid(newGrid);
        setCashoutMessage("Game Over! You hit a bomb!");
        toast.error('You hit a bomb! Game over.');
      } else {
        toast.success('Safe! Multiplier increased.');
      }
    } catch (error) {
      console.error('Error revealing tile:', error);
      toast.error('Failed to reveal tile');
    } finally {
      setIsLoading(false);
    }
  };

  const cashOut = async (): Promise<void> => {
    if (!currentSession || !gameStarted) return;

    setIsLoading(true);
    try {
      const response = await axios.post<CashoutResponse>('/api/games/mines/cashout', {
        sessionId: currentSession.sessionId
      }, {
        headers: getAuthHeaders()
      });

      const { winnings, newBalance, multiplier: finalMultiplier } = response.data;
      
      // Update user balance
      if (user) {
        setUser({
          ...user,
          balance: newBalance
        });
      }
      
      setGameOver(true);
      setCashoutMessage(`Congratulations! You cashed out ₹${winnings.toFixed(2)}!`);
      setMultiplier(finalMultiplier);
      setReward(winnings);
      toast.success(`Successfully cashed out ₹${winnings.toFixed(2)}!`);
    } catch (error) {
      console.error('Error cashing out:', error);
      toast.error('Failed to cash out');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = (): void => {
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(tile => ({ ...tile, revealed: false, isBomb: false }))
      )
    );
    setReward(0);
    setGameOver(false);
    setGameStarted(false);
    setCashoutMessage(null);
    setMultiplier(1);
    setCurrentSession(null);
    setBetAmount("");
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      resetGame();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Mines Game</h1>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Balance</p>
              <p className="font-bold text-green-400">₹{user.balance.toFixed(2)}</p>
            </div>
            <Button 
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 text-sm"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
      
      {!user ? (
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
          <div className="text-center py-6">
            <h2 className="text-xl font-semibold mb-4">Please login to play</h2>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-6 font-medium"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
          {cashoutMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center font-semibold text-lg bg-gradient-to-r ${cashoutMessage.includes("Congratulations") ? 'from-green-500/20 to-emerald-500/20 border border-green-500/30' : 'from-blue-500/20 to-purple-500/20 border border-blue-500/30'}`}>
              {cashoutMessage}
            </div>
          )}
          
          {!gameStarted ? (
            <div className="mb-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Enter Bet Amount (₹)</label>
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder={`${settings.minBet} - ${settings.maxBet}`}
                  className="bg-gray-700 border-gray-600 text-white"
                  min={settings.minBet}
                  max={settings.maxBet}
                />
                <p className="text-xs text-gray-500">Min: ₹{settings.minBet}, Max: ₹{settings.maxBet}</p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 font-medium"
                onClick={startGame}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Game'}
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
                  <span className="text-2xl font-bold text-green-400">₹{reward.toFixed(2)}</span>
                </div>
              </div>
              
              <div className={`grid grid-cols-${settings.gridSize} gap-2 mb-6`}>
                {grid.map((row, rowIndex) =>
                  row.map((tile, colIndex) => (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                      className={`aspect-square flex items-center justify-center text-xl
                        ${!tile.revealed ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' : 
                          tile.isBomb ? 'bg-gradient-to-br from-red-500 to-orange-600' : 
                          'bg-gradient-to-br from-blue-500 to-purple-600'}
                        border ${!tile.revealed ? 'border-gray-600' : 'border-gray-500'} rounded-lg transition-all duration-200`}
                      disabled={gameOver || tile.revealed || isLoading}
                    >
                      {tile.revealed && (tile.isBomb ? '💣' : '💎')}
                    </Button>
                  ))
                )}
              </div>
              
              <div className="flex justify-between">
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 font-medium"
                  onClick={cashOut}
                  disabled={gameOver || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Cash Out'}
                </Button>
                <Button
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 font-medium"
                  onClick={resetGame}
                  disabled={isLoading}
                >
                  New Game
                </Button>
              </div>
            </>
          )}
        </Card>
      )}
      
      <div className="mt-6 text-sm text-gray-400 text-center max-w-md">
        <p>Click tiles to reveal diamonds (💎) and increase your multiplier. Avoid bombs (💣) or you'll lose your bet!</p>
        {gameStarted && <p className="mt-2">Current bet: ₹{betAmount || "0.00"}</p>}
      </div>
    </div>
  );
};

export default MinesGame;