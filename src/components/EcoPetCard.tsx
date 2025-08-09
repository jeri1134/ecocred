import React from 'react';
import { EcoPet } from '../types';
import { Star, Heart, Zap } from 'lucide-react';

interface MoodData {
  mood: string;
  message: string;
  emoji: string;
  color: string;
}

interface EcoPetCardProps {
  ecoPet: EcoPet;
  moodData: MoodData;
}

const EcoPetCard: React.FC<EcoPetCardProps> = ({ ecoPet, moodData }) => {
  const xpToNextLevel = (ecoPet.level * 100) - ecoPet.xp;
  const progressPercentage = ((ecoPet.xp % 100) / 100) * 100;

  const getMoodAnimation = (mood: string) => {
    switch (mood) {
      case 'Happy':
        return 'animate-bounce';
      case 'Neutral':
        return 'animate-pulse';
      case 'Sad':
        return 'animate-none opacity-75';
      default:
        return 'animate-float';
    }
  };

  const getMoodBubbleStyle = (mood: string) => {
    switch (mood) {
      case 'Happy':
        return 'bg-green-500/20 border-green-400/50 text-green-300';
      case 'Neutral':
        return 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300';
      case 'Sad':
        return 'bg-red-500/20 border-red-400/50 text-red-300';
      default:
        return 'bg-blue-500/20 border-blue-400/50 text-blue-300';
    }
  };

  return (
    <div className="glass-card p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <img
            src={ecoPet.image}
            alt={ecoPet.name}
            className={`w-32 h-32 rounded-full object-cover border-4 border-eco-primary/30 ${getMoodAnimation(moodData.mood)}`}
          />
          
          {/* Level Badge */}
          <div className="absolute -top-2 -right-2 glass-card px-3 py-1 bg-eco-primary/30">
            <span className="text-white font-bold">Lv.{ecoPet.level}</span>
          </div>
          
          {/* Mood Bubble */}
          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 glass-card px-3 py-2 border-2 ${getMoodBubbleStyle(moodData.mood)} rounded-full min-w-max`}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{moodData.emoji}</span>
              <span className="text-sm font-medium">{moodData.message}</span>
            </div>
            {/* Speech bubble tail */}
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${moodData.mood === 'Happy' ? 'border-t-green-400/50' : moodData.mood === 'Neutral' ? 'border-t-yellow-400/50' : 'border-t-red-400/50'}`}></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-6">{ecoPet.name}</h2>
        <div className="flex justify-center space-x-2 mt-2">
          {ecoPet.traits.map((trait, index) => (
            <span
              key={index}
              className="glass-card px-3 py-1 text-sm text-white/80 bg-eco-secondary/20"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 flex items-center">
              <Zap className="w-4 h-4 mr-1 text-eco-primary" />
              Experience
            </span>
            <span className="text-white font-medium">{ecoPet.xp} XP</span>
          </div>
          <div className="glass-card h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-eco-primary to-eco-secondary transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-white/60 text-sm mt-1">{xpToNextLevel} XP to next level</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 text-center bg-eco-primary/10">
            <Star className="w-6 h-6 text-eco-primary mx-auto mb-2" />
            <div className="text-white font-semibold">Level {ecoPet.level}</div>
            <div className="text-white/60 text-sm">Current Level</div>
          </div>
          
          <div className={`glass-card p-4 text-center ${moodData.mood === 'Happy' ? 'bg-green-500/10' : moodData.mood === 'Neutral' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
            <Heart className={`w-6 h-6 mx-auto mb-2 ${moodData.color}`} />
            <div className={`font-semibold ${moodData.color}`}>{moodData.mood}</div>
            <div className="text-white/60 text-sm">Pet Mood</div>
          </div>
        </div>

        {/* Recent Activity Indicator */}
        <div className="glass-card p-4 bg-eco-accent/10">
          <h3 className="text-white font-semibold mb-2">Recent Activity</h3>
          <div className="flex space-x-1">
            {ecoPet.recentActions?.slice(0, 5).map((timestamp, index) => {
              const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
              const isRecent = daysSince <= 1;
              return (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${isRecent ? 'bg-eco-primary' : daysSince <= 3 ? 'bg-eco-secondary' : 'bg-white/20'}`}
                  title={`${Math.floor(daysSince)} days ago`}
                ></div>
              );
            })}
            {(!ecoPet.recentActions || ecoPet.recentActions.length < 5) && 
              Array.from({ length: 5 - (ecoPet.recentActions?.length || 0) }).map((_, index) => (
                <div key={`empty-${index}`} className="w-3 h-3 rounded-full bg-white/10"></div>
              ))
            }
          </div>
          <p className="text-white/60 text-xs mt-2">Last 5 actions</p>
        </div>
      </div>
    </div>
  );
};

export default EcoPetCard;
