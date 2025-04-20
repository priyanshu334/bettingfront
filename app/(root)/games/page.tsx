import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Gem, Palette } from 'lucide-react';

const games = [
  { 
    name: 'Plinko', 
    description: 'Drop balls and win big prizes',
    icon: <Gamepad2 size={48} />, 
    color: 'from-blue-500 to-indigo-600',
    link: '/games/plinko' 
  },
  { 
    name: 'Mines', 
    description: 'Find gems, avoid bombs',
    icon: <Gem size={48} />, 
    color: 'from-emerald-500 to-green-600',
    link: '/games/mines' 
  },
  { 
    name: 'Color Change', 
    description: 'Match colors to win rewards',
    icon: <Palette size={48} />, 
    color: 'from-purple-500 to-pink-600',
    link: '/games/colorCode' 
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start  text-white px-4 sm:px-6 md:px-8 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl text-white md:text-5xl font-extrabold mb-4  bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Choose Your Game
          </h1>
          <p className="text-white text-base sm:text-lg max-w-2xl mx-auto">
            Select from our collection of exciting games and test your luck.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white sm:gap-8">
          {games.map((game) => (
            <Link key={game.name} href={game.link} className="block">
              <Card className="h-full bg-gray-800 border border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden backdrop-blur-sm group">
                <div className={`bg-gradient-to-br ${game.color} p-6 sm:p-8 flex items-center justify-center`}>
                  <div className="text-white transform group-hover:scale-110 transition duration-300">
                    {game.icon}
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl text-white font-bold mb-1 sm:mb-2">{game.name}</h2>
                  <p className=" text-white text-sm sm:text-base">{game.description}</p>
                </CardContent>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="bg-gray-700/50 text-center text-white text-sm sm:text-base py-2 rounded-lg group-hover:bg-white/10 transition duration-300 font-medium">
                    Play Now
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

