"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Actions = () => {
  const { address } = useAccount();
  const [isPerforming, setIsPerforming] = useState(false);

  // Read user profile
  const { data: userProfile } = useScaffoldContractRead({
    contractName: "ETHTransactionContract",
    functionName: "getUserProfile",
    args: [address],
  });

  // Contract write functions
  const { writeAsync: performAction } = useScaffoldContractWrite({
    contractName: "ETHTransactionContract",
    functionName: "performAction",
  });

  const { writeAsync: addXP } = useScaffoldContractWrite({
    contractName: "EcoPet",
    functionName: "addXP",
  });

  const actions = [
    {
      id: "public_transport",
      name: "Public Transportation",
      description: "Use bus, MRT, LRT, or DRT for your daily commute",
      xpReward: 10,
      cost: "0.0005",
      icon: "🚌",
      requiresPayment: true,
    },
    {
      id: "community_cleanup",
      name: "Community Cleanup",
      description: "Participate in community cleanup events",
      xpReward: 18,
      cost: "0",
      icon: "👥",
      requiresPayment: false,
    },
    {
      id: "recycling",
      name: "Recycle Waste",
      description: "Recycle household waste (plastic, paper, e-waste)",
      xpReward: 15,
      cost: "0",
      icon: "♻️",
      requiresPayment: false,
    },
    {
      id: "tree_planting",
      name: "Plant a Tree",
      description: "Plant a tree or join reforestation events",
      xpReward: 20,
      cost: "0",
      icon: "🌳",
      requiresPayment: false,
    },
  ];

  const handlePerformAction = async (action: any) => {
    if (!address) {
      notification.error("Please connect your wallet first");
      return;
    }

    setIsPerforming(true);

    try {
      // Perform the action on the contract
      await performAction({
        functionName: "performAction",
        args: [action.id],
        value: action.requiresPayment ? parseEther(action.cost) : undefined,
      });

      // Add XP to EcoPet
      await addXP({
        functionName: "addXP",
        args: [address, BigInt(action.xpReward)],
      });

      notification.success(`Action completed! You earned ${action.xpReward} XP and 1 EcoCred token.`);
    } catch (error) {
      console.error("Error performing action:", error);
      notification.error("Transaction failed. Please try again.");
    } finally {
      setIsPerforming(false);
    }
  };

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="glass-card p-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Sustainable Actions</h1>
            <p className="text-xl text-white/80">
              Please connect your wallet to perform sustainable actions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Sustainable Actions</h1>
          <p className="text-xl text-white/80">
            Complete these actions to earn EcoCred tokens and XP for your EcoPet
          </p>
        </div>

        <div className="space-y-6">
          {actions.map((action) => (
            <div key={action.id} className="glass-card p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="glass-card p-3 bg-primary/20 text-2xl">
                  {action.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{action.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{action.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-primary font-medium">+{action.xpReward} XP</span>
                      {action.requiresPayment && (
                        <span className="text-white/60 text-sm">{action.cost} ETH</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePerformAction(action)}
                      disabled={isPerforming}
                      className={`glass-button ${
                        isPerforming 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-primary/30 hover:text-white'
                      }`}
                    >
                      {isPerforming ? 'Processing...' : 'Perform Action'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* User Stats */}
        {userProfile && (
          <div className="glass-card p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 bg-primary/10 text-center">
                <div className="text-2xl font-bold text-primary">{userProfile[0]?.toString()}</div>
                <div className="text-white/70">EcoCred Tokens</div>
              </div>
              <div className="glass-card p-4 bg-secondary/10 text-center">
                <div className="text-2xl font-bold text-secondary">{userProfile[1]?.toString()}</div>
                <div className="text-white/70">Actions Completed</div>
              </div>
              <div className="glass-card p-4 bg-accent/10 text-center">
                <div className="text-2xl font-bold text-accent">{userProfile[2]?.toString()}</div>
                <div className="text-white/70">Total XP Earned</div>
              </div>
            </div>
          </div>
        )}

        {/* Web3 Beginner Tips */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">💡 Web3 Beginner Tips</h2>
          <div className="space-y-3 text-white/80">
            <p>• <strong>Gas Fees:</strong> Each blockchain transaction requires a small fee paid in ETH</p>
            <p>• <strong>Confirmation:</strong> Transactions may take 15-30 seconds to confirm on the network</p>
            <p>• <strong>MetaMask:</strong> Your wallet extension that securely manages your crypto and NFTs</p>
            <p>• <strong>Sepolia Network:</strong> A test network where you can experiment without real money</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
