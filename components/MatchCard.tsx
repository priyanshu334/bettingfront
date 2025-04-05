'use client';

import { Card, CardContent } from '@/components/ui/card';

interface MatchCardProps {
  heading: string;
  team1: React.ReactNode;
  team2: React.ReactNode;
  buttons: React.ReactNode;
}

const MatchCard: React.FC<MatchCardProps> = ({ heading, team1, team2, buttons }) => {
  return (
    <Card className="w-full max-w-md mx-auto p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">{heading}</h2>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="text-left">{team1}</div>
          <div className="text-right">{team2}</div>
        </div>
        <div className="flex justify-around mt-4">
          {buttons}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
