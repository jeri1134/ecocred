import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Recycle,
  Car,
  Lightbulb,
  Droplets,
  TreePine,
  ShoppingBag,
  Utensils,
  Wallet,
} from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { useEcoPet } from "../hooks/useEcoPet";

const Actions = () => {
  const { wallet } = useWallet();
  const { performAction } = useEcoPet();
  const [userStats, setUserStats] = useState({
    ecoCredits: 1250,
    xp: 3400,
    actionsCompleted: 47,
  });

  const actions = [
    {
      id: 1,
      title: "Use Public Transport",
      description: "Take the bus, train, or bike instead of driving",
      icon: Car,
      credits: 50,
      xp: 100,
      cost: 0.001, // ETH cost
      category: "Transport",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "Recycle Waste",
      description: "Properly sort and recycle your household waste",
      icon: Recycle,
      credits: 30,
      xp: 75,
      cost: 0.0005,
      category: "Waste",
      color: "from-green-400 to-green-600",
    },
    {
      id: 3,
      title: "Save Energy",
      description: "Turn off lights and unplug devices when not in use",
      icon: Lightbulb,
      credits: 25,
      xp: 50,
      cost: 0.0003,
      category: "Energy",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: 4,
      title: "Conserve Water",
      description: "Take shorter showers and fix leaky faucets",
      icon: Droplets,
      credits: 35,
      xp: 80,
      cost: 0.0007,
      category: "Water",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      id: 5,
      title: "Plant a Tree",
      description: "Plant or sponsor a tree in your community",
      icon: TreePine,
      credits: 100,
      xp: 200,
      cost: 0.002,
      category: "Nature",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: 6,
      title: "Use Reusable Bags",
      description: "Bring your own bags when shopping",
      icon: ShoppingBag,
      credits: 20,
      xp: 40,
      cost: 0.0002,
      category: "Lifestyle",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: 7,
      title: "Eat Plant-Based Meal",
      description: "Choose a vegetarian or vegan meal option",
      icon: Utensils,
      credits: 40,
      xp: 90,
      cost: 0.0008,
      category: "Food",
      color: "from-orange-400 to-orange-600",
    },
    {
      id: 8,
      title: "Reduce Plastic Use",
      description: "Avoid single-use plastics for a day",
      icon: Recycle,
      credits: 45,
      xp: 95,
      cost: 0.0006,
      category: "Waste",
      color: "from-teal-400 to-teal-600",
    },
  ];

  const handleCompleteAction = async (action: any) => {
    if (!wallet.isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (wallet.balance < action.cost) {
      alert("Insufficient balance");
      return;
    }

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user stats
      setUserStats((prev) => ({
        ecoCredits: prev.ecoCredits + action.credits,
        xp: prev.xp + action.xp,
        actionsCompleted: prev.actionsCompleted + 1,
      }));

      // Update EcoPet
      performAction(action.xp);

      // Store in localStorage for persistence
      const currentTokens = parseInt(
        localStorage.getItem("ecoCredTokens") || "0"
      );
      localStorage.setItem(
        "ecoCredTokens",
        (currentTokens + action.credits).toString()
      );

      alert(
        `Action completed! Earned ${action.credits} EcoCred tokens and ${action.xp} XP!`
      );
    } catch (error) {
      console.error("Action failed:", error);
      alert("Action failed. Please try again.");
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/80 mb-6">
            Please connect your wallet to start taking sustainable actions and
            earning rewards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Sustainable Actions
          </h1>
          <p className="text-xl text-white/80">
            Complete eco-friendly tasks to earn EcoCredits and XP
          </p>
        </motion.div>

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {wallet.balance.toFixed(4)} ETH
              </div>
              <div className="text-white/70">Wallet Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {parseInt(localStorage.getItem("ecoCredTokens") || "0")}
              </div>
              <div className="text-white/70">EcoCredits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {userStats.xp}
              </div>
              <div className="text-white/70">Experience Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-2">
                {userStats.actionsCompleted}
              </div>
              <div className="text-white/70">Actions Completed</div>
            </div>
          </div>
        </motion.div>

        {/* Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {actions.map((action, index) => {
            const canAfford = wallet.balance >= action.cost;

            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-white/70 mb-4">{action.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {action.credits}
                      </div>
                      <div className="text-xs text-white/60">Credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {action.xp}
                      </div>
                      <div className="text-xs text-white/60">XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {action.cost} ETH
                      </div>
                      <div className="text-xs text-white/60">Cost</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/80">
                    {action.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCompleteAction(action)}
                  disabled={!canAfford}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    canAfford
                      ? "btn-primary"
                      : "bg-red-500/20 text-red-300 cursor-not-allowed"
                  }`}
                >
                  {canAfford ? "Complete Action" : "Insufficient Balance"}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Actions;
