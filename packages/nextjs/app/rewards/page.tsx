"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Rewards = () => {
  const { address } = useAccount();
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Read user profile and pet data
  const { data: userProfile } = useScaffoldContractRead({
    contractName: "ETHTransactionContract",
    functionName: "getUserProfile",
    args: [address],
  });

  const { data: petData } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getPetData",
    args: [address],
  });

  const { data: isAdultLevel } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "isAdultLevel",
    args: [address],
  });

  // Contract write function
  const { writeAsync: redeemReward } = useScaffoldContractWrite({
    contractName: "ETHTransactionContract",
    functionName: "redeemReward",
  });

  const rewards = [
    {
      id: "mrt_day_pass",
      name: "Free MRT/LRT Day Pass",
      cost: 200,
      category: "Public Transport Incentives",
      icon: "🚇",
      requiresAdult: false,
    },
    {
      id: "transport_discount",
      name: "50% Discount on Monthly Public Transport Pass",
      cost: 500,
      category: "Public Transport Incentives",
      icon: "🎫",
      requiresAdult: false,
    },
    {
      id: "eco_badge",
      name: "EcoWarrior Badge",
      cost: 100,
      category: "Green Community Perks",
      icon: "🏆",
      requiresAdult: false,
    },
    {
      id: "eco_tshirt",
      name: "Limited Edition EcoCred T-Shirt",
      cost: 700,
      category: "Green Community Perks",
      icon: "👕",
      requiresAdult: false,
    },
    {
      id: "beauty_discount",
      name: "RM 20 off on Beauty & Wellness Product",
      cost: 1000,
      category: "Groceries & Essentials",
      icon: "💄",
      requiresAdult: true,
    },
    {
      id: "grocer_discount",
      name: "RM 10 off at Jaya Grocer",
      cost: 700,
      category: "Groceries & Essentials",
      icon: "🛒",
      requiresAdult: true,
    },
  ];

  const handleRedeemReward = async (reward: any) => {
    if (!address) {
      notification.error("Please connect your wallet first");
      return;
    }

    if (!userProfile || userProfile[0] < reward.cost) {
      notification.error("Insufficient tokens to redeem this reward");
      return;
    }

    if (reward.requiresAdult && !isAdultLevel) {
      notification.error("Your EcoPet must reach Adult level to redeem this reward");
      return;
    }

    setIsRedeeming(true);

    try {
      const petLevel = petData ? petData[3] : 0; // Get pet level
      
      await redeemReward({
        functionName: "redeemReward",
        args: [reward.id, petLevel],
      });

      notification.success(`Successfully redeemed ${reward.name}!`);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      notification.error("Failed to redeem reward. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, typeof rewards>);

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="glass-card p-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Rewards Store</h1>
            <p className="text-xl text-white/80">
              Please connect your wallet to view and redeem rewards
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tokenBalance = userProfile ? Number(userProfile[0]) : 0;
  const petLevel = petData ? Number(petData[3]) : 0;
  const petStage = petData ? petData[4] : "Baby";

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Rewards Store</h1>
          <p className="text-xl text-white/80">
            Redeem your EcoCred tokens for exclusive rewards and benefits
          </p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-4">🪙</div>
            <div className="text-2xl font-bold text-white mb-2">{tokenBalance}</div>
            <div className="text-white/70">EcoCred Tokens</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-4">🐾</div>
            <div className="text-2xl font-bold text-white mb-2">Level {petLevel}</div>
            <div className="text-white/70">EcoPet Level</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="text-4xl mb-4">
              {petStage === "Baby" ? "🐣" : petStage === "Youth" ? "🐱" : "🦁"}
            </div>
            <div className="text-2xl font-bold text-white mb-2">{petStage}</div>
            <div className="text-white/70">Pet Stage</div>
          </div>
        </div>

        {/* Adult Level Notice */}
        {!isAdultLevel && (
          <div className="glass-card p-6 mb-8 bg-warning/10 border-warning/30">
            <h2 className="text-xl font-bold text-white mb-2">🔒 Adult Level Required</h2>
            <p className="text-white/80">
              Some premium rewards require your EcoPet to reach Adult level (>1700 XP). 
              Keep completing sustainable actions to unlock all rewards!
            </p>
          </div>
        )}

        {/* Rewards by Category */}
        {Object.entries(groupedRewards).map(([category, categoryRewards]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryRewards.map((reward) => {
                const canAfford = tokenBalance >= reward.cost;
                const canRedeem = canAfford && (!reward.requiresAdult || isAdultLevel);
                const isDisabled = reward.requiresAdult && !isAdultLevel;

                return (
                  <div
                    key={reward.id}
                    className={`glass-card p-6 ${
                      isDisabled ? 'opacity-50' : 'hover:scale-105'
                    } transition-all duration-300`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{reward.icon}</div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {reward.name}
                          {reward.requiresAdult && (
                            <span className="ml-2 text-xs bg-warning/20 text-warning px-2 py-1 rounded-full">
                              Adult Only
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-primary font-bold">{reward.cost} ECC</span>
                            {!canAfford && (
                              <span className="text-error text-sm">(Insufficient tokens)</span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRedeemReward(reward)}
                            disabled={!canRedeem || isRedeeming}
                            className={`glass-button ${
                              canRedeem && !isRedeeming
                                ? 'hover:bg-primary/30 hover:text-white'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {isRedeeming ? 'Redeeming...' : 'Redeem'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Web3 Education */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">💡 How Token Redemption Works</h2>
          <div className="space-y-3 text-white/80">
            <p>• <strong>Token Burning:</strong> When you redeem rewards, tokens are permanently removed from circulation</p>
            <p>• <strong>Blockchain Record:</strong> All redemptions are recorded on the blockchain for transparency</p>
            <p>• <strong>Adult Restrictions:</strong> Premium rewards require your EcoPet to reach maturity (Adult level)</p>
            <p>• <strong>Real Benefits:</strong> Redeemed rewards can be claimed through our partner network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
