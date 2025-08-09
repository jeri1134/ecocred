import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Zap, Clock, TrendingUp } from "lucide-react";

const EcoPet = () => {
  const [petStats, setPetStats] = useState({
    happiness: 85,
    energy: 70,
    level: 12,
    xp: 3400,
    lastFed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    lastAction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  });

  const [currentMood, setCurrentMood] = useState("happy");
  const [moodMessage, setMoodMessage] = useState("");

  // Calculate mood based on last action
  const calculateMood = () => {
    const daysSinceLastAction = Math.floor(
      (Date.now() - petStats.lastAction.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastAction <= 3) {
      setCurrentMood("happy");
      setMoodMessage(
        "I'm so happy! You've been taking great care of the environment! 🌟"
      );
    } else if (daysSinceLastAction <= 7) {
      setCurrentMood("neutral");
      setMoodMessage(
        "I'm doing okay, but I'd love to see more eco-actions from you! 🌱"
      );
    } else {
      setCurrentMood("sad");
      setMoodMessage(
        "I'm feeling a bit neglected... Let's do some eco-friendly activities together! 😢"
      );
    }
  };

  useEffect(() => {
    calculateMood();
    const interval = setInterval(calculateMood, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [petStats.lastAction]);

  const getMoodColor = () => {
    switch (currentMood) {
      case "happy":
        return "from-green-400 to-emerald-500";
      case "neutral":
        return "from-yellow-400 to-orange-500";
      case "sad":
        return "from-red-400 to-pink-500";
      default:
        return "from-green-400 to-emerald-500";
    }
  };

  const getMoodEmoji = () => {
    switch (currentMood) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      default:
        return "😊";
    }
  };

  const feedPet = () => {
    setPetStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
      energy: Math.min(100, prev.energy + 15),
      lastFed: new Date(),
    }));
  };

  const playWithPet = () => {
    setPetStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 15),
      energy: Math.max(0, prev.energy - 10),
      xp: prev.xp + 50,
    }));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Your EcoPet</h1>
          <p className="text-xl text-white/80">
            Your virtual companion that reflects your eco-friendly habits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 text-center"
          >
            {/* Pet Avatar */}
            <div
              className={`w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br ${getMoodColor()} flex items-center justify-center relative`}
            >
              <div className="text-8xl">{getMoodEmoji()}</div>

              {/* Floating mood bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg max-w-xs"
              >
                <div className="text-sm text-gray-800 font-medium">
                  {moodMessage}
                </div>
                <div className="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
              </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">EcoFriend</h2>
            <p className="text-white/70 mb-6">
              Level {petStats.level} • {petStats.xp} XP
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={feedPet}
                className="btn-primary flex items-center space-x-2"
              >
                <Heart className="h-5 w-5" />
                <span>Feed</span>
              </button>
              <button
                onClick={playWithPet}
                className="btn-secondary flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Play</span>
              </button>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Happiness & Energy Bars */}
            <div className="glass-card p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Pet Stats</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-400" />
                      Happiness
                    </span>
                    <span className="text-white font-bold">
                      {petStats.happiness}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${petStats.happiness}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-gradient-to-r from-red-400 to-pink-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      Energy
                    </span>
                    <span className="text-white font-bold">
                      {petStats.energy}%
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${petStats.energy}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Info */}
            <div className="glass-card p-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Activity Info
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-400" />
                    Last Fed
                  </span>
                  <span className="text-white">
                    {petStats.lastFed.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/80 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Last Action
                  </span>
                  <span className="text-white">
                    {petStats.lastAction.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/80">Current Mood</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentMood === "happy"
                        ? "bg-green-500/20 text-green-400"
                        : currentMood === "neutral"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Care Tips */}
            <div className="glass-card p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Care Tips</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Complete eco-actions regularly to keep your pet happy</li>
                <li>• Feed your pet to maintain happiness and energy</li>
                <li>• Play with your pet to earn bonus XP</li>
                <li>• Your pet's mood reflects your environmental impact</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EcoPet;
