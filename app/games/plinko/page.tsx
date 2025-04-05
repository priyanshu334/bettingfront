"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Game configuration
const CONFIG = {
  rows: 16,
  slots: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
  initialBalance: 1000,
  minBet: 10,
  ballSize: 16,
  pegSize: 6,
  boardWidth: 100,
  boardHeight: 80,
  animationDuration: 3,
};

type Peg = { x: number; y: number };
type BallPath = { x: number; y: number }[];
type GameState = "idle" | "dropping" | "finished";

// Generate pegs in a perfect triangular layout
const generatePegPositions = (): Peg[] => {
  const pegs: Peg[] = [];
  const { rows, boardWidth, boardHeight, pegSize } = CONFIG;
  
  const verticalSpacing = boardHeight / rows;
  const horizontalPadding = pegSize * 2; // Extra space on sides
  
  for (let row = 0; row < rows; row++) {
    const pegsInRow = row + 1;
    const availableWidth = boardWidth - horizontalPadding * 2;
    const horizontalSpacing = availableWidth / pegsInRow;
    
    for (let col = 0; col < pegsInRow; col++) {
      pegs.push({
        x: horizontalPadding + col * horizontalSpacing + horizontalSpacing / 2,
        y: (row + 1) * verticalSpacing,
      });
    }
  }
  
  return pegs;
};

const Plinko = () => {
  const [balance, setBalance] = useState<number>(CONFIG.initialBalance);
  const [bet, setBet] = useState<number>(50);
  const [message, setMessage] = useState<string>("Place your bet and drop the ball!");
  const [ballPath, setBallPath] = useState<BallPath>([]);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [winnings, setWinnings] = useState<number>(0);
  const [slotIndex, setSlotIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<number>(50);
  const boardRef = useRef<HTMLDivElement>(null);
  
  const pegs = generatePegPositions();

  // Reset message after timeout
  useEffect(() => {
    if (message.includes("Insufficient")) {
      const timer = setTimeout(() => {
        setMessage("Place your bet and drop the ball!");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= CONFIG.minBet) {
      setBet(Math.min(value, balance));
    }
  };

  const handleDropPositionChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState === "dropping" || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setDropPosition(Math.max(10, Math.min(90, newPosition)));
  };

  // Advanced physics-based ball path simulation
  const simulateBallPath = (): { path: BallPath; finalSlot: number } => {
    const path: BallPath = [];
    const { boardWidth, ballSize, pegSize, slots } = CONFIG;
    const slotWidth = boardWidth / slots.length;
    
    // Physics parameters
    const physics = {
      gravity: 0.2,
      friction: 0.92,
      restitution: 0.65,
      randomness: 0.15,
      terminalVelocity: 5,
    };
    
    // Ball state
    const ball = {
      x: dropPosition,
      y: 0,
      vx: 0,
      vy: 0.1,
      radius: ballSize / 2,
    };
    
    path.push({ x: ball.x, y: ball.y });
    
    // Organize pegs by row for efficient collision detection
    const pegsByRow: Record<number, Peg[]> = {};
    pegs.forEach(peg => {
      const row = Math.round(peg.y / (CONFIG.boardHeight / CONFIG.rows));
      if (!pegsByRow[row]) pegsByRow[row] = [];
      pegsByRow[row].push(peg);
    });
    
    let currentRow = 0;
    const maxRow = Math.max(...Object.keys(pegsByRow).map(Number));
    
    while (ball.y < CONFIG.boardHeight) {
      // Apply forces
      ball.vy = Math.min(ball.vy + physics.gravity, physics.terminalVelocity);
      
      // Update position
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // Check for collisions with current row
      if (currentRow <= maxRow && pegsByRow[currentRow]) {
        for (const peg of pegsByRow[currentRow]) {
          const dx = ball.x - peg.x;
          const dy = ball.y - peg.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ball.radius + pegSize / 2;
          
          if (distance < minDistance) {
            // Collision response
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Position correction
            const overlap = minDistance - distance;
            ball.x += nx * overlap * 0.5;
            ball.y += ny * overlap * 0.5;
            
            // Calculate impulse
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx = (ball.vx - 2 * dot * nx) * physics.restitution;
            ball.vy = (ball.vy - 2 * dot * ny) * physics.restitution;
            
            // Add randomness
            ball.vx += (Math.random() - 0.5) * physics.randomness;
            ball.vy += (Math.random() - 0.1) * physics.randomness;
          }
        }
      }
      
      // Move to next row if we've passed it
      if (ball.y > (currentRow + 1) * (CONFIG.boardHeight / CONFIG.rows)) {
        currentRow++;
      }
      
      // Boundary collisions
      if (ball.x < ball.radius) {
        ball.x = ball.radius;
        ball.vx = -ball.vx * physics.friction;
      } else if (ball.x > boardWidth - ball.radius) {
        ball.x = boardWidth - ball.radius;
        ball.vx = -ball.vx * physics.friction;
      }
      
      // Apply friction
      ball.vx *= physics.friction;
      ball.vy *= physics.friction;
      
      // Record position (with decimation to optimize path)
      if (path.length < 2 || 
          Math.abs(ball.x - path[path.length-1].x) > 1 || 
          Math.abs(ball.y - path[path.length-1].y) > 1) {
        path.push({ x: ball.x, y: ball.y });
      }
    }
    
    // Determine final slot
    const finalSlot = Math.min(
      Math.floor(ball.x / slotWidth), 
      slots.length - 1
    );
    
    // Add final position
    path.push({ 
      x: (finalSlot + 0.5) * slotWidth, 
      y: CONFIG.boardHeight 
    });
    
    return { path, finalSlot };
  };

  const dropBall = () => {
    if (gameState === "dropping") return;
    
    if (bet > balance) {
      setMessage("Insufficient balance!");
      return;
    }

    setGameState("dropping");
    setMessage("Ball dropping...");
    setSlotIndex(null);
    setBallPath([]);
    
    // Small delay to allow state to update before animation
    setTimeout(() => {
      const { path, finalSlot } = simulateBallPath();
      setBallPath(path);
      
      const currentWinnings = bet * CONFIG.slots[finalSlot];
      setWinnings(currentWinnings);
      
      setTimeout(() => {
        setSlotIndex(finalSlot);
        setBalance(prev => prev - bet + currentWinnings);
        setMessage(`Ball landed on x${CONFIG.slots[finalSlot]}. You won $${currentWinnings.toFixed(2)}!`);
        setGameState("finished");
      }, CONFIG.animationDuration * 1000);
    }, 50);
  };

  const resetGame = () => {
    setBallPath([]);
    setGameState("idle");
    setSlotIndex(null);
    setMessage("Place your bet and drop the ball!");
  };

  // Slot color gradient based on multiplier value
  const getSlotColor = (multiplier: number) => {
    if (multiplier >= 41) return "from-pink-500 to-pink-600";
    if (multiplier >= 5) return "from-red-500 to-red-600";
    if (multiplier >= 1.5) return "from-orange-500 to-orange-600";
    if (multiplier >= 1) return "from-yellow-500 to-yellow-600";
    if (multiplier >= 0.5) return "from-yellow-400 to-yellow-500";
    return "from-yellow-300 to-yellow-400";
  };

  return (
    <div className="flex flex-col items-center p-6 w-full mx-auto bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl shadow-2xl border border-blue-700">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
        Plinko Game
      </h1>
      
      {/* Game info panel */}
      <div className="w-full flex flex-wrap justify-between items-center mb-6 p-5 bg-blue-950/80 rounded-xl shadow-lg backdrop-blur-sm border border-blue-800">
        <div className="flex items-center text-lg text-white mb-2 sm:mb-0">
          <span className="font-semibold mr-2">Balance:</span>
          <span className="font-mono text-green-400 font-bold">${balance.toFixed(2)}</span>
        </div>
        
        {winnings > 0 && gameState === "finished" && (
          <div className="flex items-center text-lg text-white">
            <span className="font-semibold mr-2">Won:</span>
            <span className="font-mono text-yellow-400 font-bold">${winnings.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-center mb-6 gap-4">
        <div className="flex items-center text-white">
          <label className="mr-3 font-medium">Bet Amount:</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">$</span>
            <input
              type="number"
              className="pl-8 pr-3 py-2 w-28 border border-blue-700 bg-blue-950/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={bet}
              onChange={handleBetChange}
              min={CONFIG.minBet}
              max={balance}
              disabled={gameState === "dropping"}
            />
          </div>
        </div>
        
        <button
          className={`px-8 py-3 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
            gameState === "dropping" 
              ? "bg-gray-600 cursor-not-allowed" 
              : gameState === "finished"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          }`}
          onClick={gameState === "finished" ? resetGame : dropBall}
          disabled={gameState === "dropping"}
        >
          {gameState === "finished" ? "Play Again" : "Drop Ball"}
        </button>
      </div>
      
      {/* Game message */}
      <p className={`text-lg mb-6 font-medium px-4 py-2 rounded-lg ${
        message.includes("Insufficient") ? "bg-red-900/50 text-red-300" : 
        message.includes("won") ? "bg-green-900/50 text-green-300" : 
        "bg-blue-900/50 text-blue-200"
      }`}>
        {message}
      </p>
      
      {/* Plinko board */}
      <div 
        ref={boardRef}
        className="relative w-full h-[32rem] bg-gradient-to-b from-blue-950 to-blue-900 rounded-2xl shadow-inner overflow-hidden border-2 border-blue-700/50"
        onClick={handleDropPositionChange}
      >
        {/* Drop position indicator */}
        {gameState !== "dropping" && (
          <motion.div 
            className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 z-30 cursor-pointer shadow-lg"
            style={{ 
              left: `calc(${dropPosition}% - 1rem)`, 
              top: "-0.5rem",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        )}
        
        {/* Pegs */}
        {pegs.map((peg, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-gradient-to-br from-white to-gray-200 z-10 shadow-md"
            style={{ 
              left: `${peg.x}%`, 
              top: `${peg.y}%`,
              width: `${CONFIG.pegSize}px`,
              height: `${CONFIG.pegSize}px`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.002, type: "spring" }}
          />
        ))}
        
        {/* Ball animation */}
        <AnimatePresence>
          {ballPath.length > 0 && (
            <motion.div
              className="absolute rounded-full z-20 shadow-xl"
              style={{
                width: `${CONFIG.ballSize}px`,
                height: `${CONFIG.ballSize}px`,
                background: "radial-gradient(circle at 30% 30%, #ff6b6b, #d32f2f)",
                boxShadow: "0 0 10px rgba(255, 100, 100, 0.7)",
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ 
                top: "0%", 
                left: `${ballPath[0].x}%`,
                opacity: 0,
                scale: 0.5
              }}
              animate={{ 
                top: ballPath.map(p => `${p.y}%`), 
                left: ballPath.map(p => `${p.x}%`),
                opacity: 1,
                scale: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: CONFIG.animationDuration,
                times: ballPath.map((_, i) => i / (ballPath.length - 1)),
                ease: "linear"
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Slot containers at bottom */}
        <div className="absolute bottom-0 w-full flex justify-between h-12">
          {CONFIG.slots.map((multiplier, index) => (
            <motion.div
              key={index}
              className={`relative flex-1 flex items-center justify-center border-t-2 ${
                slotIndex === index 
                  ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]" 
                  : "border-blue-950"
              } transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${getSlotColor(multiplier)} opacity-90`} />
              <span className="relative z-10 text-xs font-bold text-white drop-shadow-md">
                {multiplier}x
              </span>
            </motion.div>
          ))}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-900/80 to-transparent" />
        </div>
      </div>
      
      <p className="text-blue-300 mt-4 text-center text-sm">
        Click on the top of the board to set drop position
      </p>
    </div>
  );
};

export default Plinko;