import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Star, ShoppingCart, Leaf, Award, Zap } from "lucide-react";

const Rewards = () => {
  const [userCredits, setUserCredits] = useState(1250);
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([]);

  const rewards = [
    {
      id: 1,
      title: "Bamboo Water Bottle",
      description: "Sustainable bamboo water bottle with leak-proof design",
      credits: 200,
      image:
        "https://images.pexels.com/photos/6621451/pexels-photo-6621451.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Lifestyle",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      title: "Solar Power Bank",
      description: "10,000mAh solar-powered portable charger",
      credits: 500,
      image:
        "https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tech",
      rating: 4.6,
      inStock: true,
    },
    {
      id: 3,
      title: "Organic Cotton Tote Bag",
      description: "Reusable shopping bag made from 100% organic cotton",
      credits: 150,
      image:
        "https://images.pexels.com/photos/6621451/pexels-photo-6621451.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Lifestyle",
      rating: 4.9,
      inStock: true,
    },
    {
      id: 4,
      title: "LED Smart Bulb Set",
      description: "Energy-efficient smart LED bulbs (4-pack)",
      credits: 300,
      image:
        "https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Home",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 5,
      title: "Seed Starter Kit",
      description: "Complete kit to grow your own herbs and vegetables",
      credits: 250,
      image:
        "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Garden",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 6,
      title: "Eco-Friendly Phone Case",
      description: "Biodegradable phone case made from plant materials",
      credits: 180,
      image:
        "https://images.pexels.com/photos/4254557/pexels-photo-4254557.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Tech",
      rating: 4.4,
      inStock: false,
    },
    {
      id: 7,
      title: "Reusable Food Wraps",
      description: "Beeswax food wraps set - plastic-free food storage",
      credits: 120,
      image:
        "https://images.pexels.com/photos/6621451/pexels-photo-6621451.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Kitchen",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 8,
      title: "Carbon Offset Certificate",
      description: "Offset 1 ton of CO2 emissions through verified projects",
      credits: 400,
      image:
        "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "Impact",
      rating: 5.0,
      inStock: true,
    },
  ];

  const handleRedeem = (reward: any) => {
    if (
      userCredits >= reward.credits &&
      !redeemedRewards.includes(reward.id)
    ) {
      setUserCredits((prev) => prev - reward.credits);
      setRedeemedRewards((prev) => [...prev, reward.id]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tech":
        return Zap;
      case "Lifestyle":
        return Star;
      case "Home":
        return Gift;
      case "Garden":
        return Leaf;
      case "Kitchen":
        return ShoppingCart;
      case "Impact":
        return Award;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tech":
        return "from-blue-400 to-blue-600";
      case "Lifestyle":
        return "from-purple-400 to-purple-600";
      case "Home":
        return "from-orange-400 to-orange-600";
      case "Garden":
        return "from-green-400 to-green-600";
      case "Kitchen":
        return "from-yellow-400 to-yellow-600";
      case "Impact":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

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
          <h1 className="text-5xl font-bold text-white mb-4">Rewards Store</h1>
          <p className="text-xl text-white/80">
            Redeem your EcoCredits for sustainable products
          </p>
        </motion.div>

        {/* Credits Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-4">
            <Gift className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-3xl font-bold text-white">
                {userCredits}
              </div>
              <div className="text-white/70">Available EcoCredits</div>
            </div>
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rewards.map((reward, index) => {
            const CategoryIcon = getCategoryIcon(reward.category);
            const isRedeemed = redeemedRewards.includes(reward.id);
            const canAfford = userCredits >= reward.credits;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`glass-card overflow-hidden ${
                  !reward.inStock ? "opacity-60" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-4 left-4 w-10 h-10 rounded-lg bg-gradient-to-r ${getCategoryColor(
                      reward.category
                    )} flex items-center justify-center`}
                  >
                    <CategoryIcon className="h-5 w-5 text-white" />
                  </div>
                  {!reward.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {isRedeemed && (
                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        Redeemed!
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {reward.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white/70 text-sm">
                        {reward.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 mb-4">{reward.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-green-400">
                        {reward.credits}
                      </div>
                      <div className="text-white/60">Credits</div>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white/80">
                      {reward.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !reward.inStock || isRedeemed}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      canAfford && reward.inStock && !isRedeemed
                        ? "btn-primary"
                        : "bg-gray-500/50 text-white/50 cursor-not-allowed"
                    }`}
                  >
                    {isRedeemed
                      ? "Redeemed"
                      : !reward.inStock
                      ? "Out of Stock"
                      : !canAfford
                      ? "Insufficient Credits"
                      : "Redeem"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
