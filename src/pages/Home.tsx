import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Zap,
  Heart,
  Gift,
  TrendingUp,
  Users,
  Award,
  Wallet,
} from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import { useEcoPet } from "../hooks/useEcoPet";

const Home = () => {
  const { wallet } = useWallet();
  const { ecoPet } = useEcoPet();

  const stats = [
    { icon: TrendingUp, label: "Total Users", value: "12,847" },
    { icon: Users, label: "Actions Completed", value: "89,234" },
    { icon: Award, label: "CO2 Saved", value: "2,456 kg" },
    { icon: Leaf, label: "Trees Planted", value: "1,234" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Sustainable Actions",
      description: "Complete eco-friendly tasks and earn EcoCredits",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Heart,
      title: "EcoPet Companion",
      description: "Care for your virtual pet that reflects your eco-habits",
      color: "from-pink-400 to-red-500",
    },
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Redeem credits for real-world sustainable products",
      color: "from-purple-400 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-green-400">EcoCred</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Transform your sustainable actions into blockchain rewards while
            caring for your virtual EcoPet companion
          </p>
          
          {wallet.isConnected ? (
            <div className="flex justify-center space-x-4">
              <Link to="/actions" className="btn-primary">
                Start Taking Action
              </Link>
              <Link to="/ecopet" className="btn-secondary">
                Visit Your EcoPet
              </Link>
            </div>
          ) : (
            <div className="glass-card p-8 max-w-md mx-auto">
              <Wallet className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Connect your wallet to get started
              </h3>
              <p className="text-white/70">
                Connect your Web3 wallet to start earning EcoCredits and caring
                for your EcoPet
              </p>
            </div>
          )}
        </motion.div>

        {/* Wallet Status */}
        {wallet.isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-card p-6 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {wallet.balance.toFixed(4)} ETH
                </div>
                <div className="text-white/70">Wallet Balance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {localStorage.getItem("ecoCredTokens") || "0"} ECC
                </div>
                <div className="text-white/70">EcoCredits Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  Level {ecoPet.level}
                </div>
                <div className="text-white/70">EcoPet Level</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <stat.icon className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-8 text-center"
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6`}
              >
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Connect Wallet
              </h3>
              <p className="text-white/70">
                Connect your MetaMask or other Web3 wallet to get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Take Action</h3>
              <p className="text-white/70">
                Complete sustainable actions and pay small gas fees to verify
                your commitment
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Earn Rewards
              </h3>
              <p className="text-white/70">
                Earn EcoCredits and watch your EcoPet grow as you make a
                positive impact
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
