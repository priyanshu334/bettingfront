'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Gift, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-600 via-orange-600 to-orange-600 text-white px-4 sm:px-6 md:px-8 py-16 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-yellow-500/20 blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-80 h-80 rounded-full bg-purple-500/20 blur-3xl -bottom-20 -right-20"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="text-yellow-400 inline-block relative">
              BetChamp
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Predict today's match or explore thrilling games and win exciting rewards. 
            Your fortune awaits!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link href="/cricket">
            <Button className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 transition border-0 font-medium group">
              🏏 Play Today's Match
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/games">
            <Button className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg bg-white/10 border-2 border-white/50 text-white hover:bg-white/20 transition font-medium">
              🎮 Play Games
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-10">
          {[
            { icon: <Gift className="w-5 h-5 text-indigo-300" />, title: "Daily Rewards", desc: "Login daily for bonus rewards", bg: "bg-indigo-500/30" },
            { icon: <Trophy className="w-5 h-5 text-yellow-300" />, title: "Weekly Tournaments", desc: "Compete for big prizes", bg: "bg-yellow-500/30" },
            { icon: <Sparkles className="w-5 h-5 text-purple-300" />, title: "Instant Payouts", desc: "Get rewards within minutes", bg: "bg-purple-500/30" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <div className={`w-10 h-10 rounded-full ${feature.bg} flex items-center justify-center`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="font-semibold mb-1 text-base sm:text-lg">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-6 text-xs sm:text-sm text-gray-400 items-center">
          <Sparkles className="mr-2 w-4 h-4" />
          <span>100% secure & legal | 18+ only</span>
        </div>
      </div>
    </main>
  );
}
