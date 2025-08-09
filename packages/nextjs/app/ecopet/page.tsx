"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const EcoPet = () => {
  const { address } = useAccount();
  const [petName, setPetName] = useState("EcoFriend");

  // Read pet data
  const { data: hasPet } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "hasPet",
    args: [address],
  });

  const { data: petData, refetch: refetchPetData } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getPetData",
    args: [address],
    enabled: !!hasPet,
  });

  const { data: xpToNextLevel } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getXPToNextLevel",
    args: [address],
    enabled: !!hasPet,
  });

  const { data: progressPercentage } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getProgressToNextLevel",
    args: [address],
    enabled: !!hasPet,
  });

  // Contract write function
  const { writeAsync: createEcoPet } = useScaffoldContractWrite({
    contractName: "EcoPet",
    functionName: "createEcoPet",
  });

  const handleCreateEcoPet = async () => {
    if (!address) {
      notification.error("Please connect your wallet first");
      return;
    }

    try {
      await createEcoPet({
        functionName: "createEcoPet",
        args: [petName],
      });

      notification.success("EcoPet created successfully!");
      refetchPetData();
    } catch (error) {
      console.error("Error creating EcoPet:", error);
      notification.error("Failed to create EcoPet. Please try again.");
    }
  };

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="glass-card p-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">My EcoPet</h1>
            <p className="text-xl text-white/80">
              Please connect your wallet to view or create your EcoPet
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasPet) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-full max-w-4xl">
          <div className="text-center">
            <div className="glass-card p-12">
              <h1 className="text-4xl font-bold text-white mb-6">Create Your EcoPet</h1>
              <p className="text-xl text-white/80 mb-8">
                Your Non-Fungible Agent (NFA) companion that grows with your sustainable actions
              </p>
              
              <div className="glass-card p-8 bg-primary/10 mb-8">
                <img
                  src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&h=200&fit=crop&crop=center"
                  alt="EcoPet Preview"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 animate-float"
                />
                <h3 className="text-2xl font-bold text-white mb-2">EcoFriend</h3>
                <p className="text-white/70">
                  A curious and eco-friendly companion ready to grow with you
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Pet Name
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="glass-input w-full max-w-xs mx-auto"
                  placeholder="Enter pet name"
                />
              </div>

              <button
                onClick={handleCreateEcoPet}
                className="glass-button bg-primary/30 hover:bg-primary/50 text-lg px-8 py-4"
              >
                Create My EcoPet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="glass-card p-12 text-center">
            <div className="animate-pulse">Loading your EcoPet...</div>
          </div>
        </div>
      </div>
    );
  }

  const [tokenId, name, xp, level, stage, createdAt, traits, imageURI] = petData;

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">My EcoPet</h1>
          <p className="text-xl text-white/80">
            Your sustainable companion grows stronger with every eco-friendly action
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EcoPet Card */}
          <div className="glass-card p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img
                  src={imageURI}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/30 animate-float"
                />
                <div className="absolute -top-2 -right-2 glass-card px-3 py-1 bg-primary/30">
                  <span className="text-white font-bold">Lv.{level?.toString()}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mt-4">{name}</h2>
              <div className="text-lg text-primary font-semibold mb-2">{stage} Stage</div>
              <div className="flex justify-center space-x-2 mt-2">
                {traits?.map((trait, index) => (
                  <span
                    key={index}
                    className="glass-card px-3 py-1 text-sm text-white/80 bg-secondary/20"
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
                    ⚡ Experience
                  </span>
                  <span className="text-white font-medium">{xp?.toString()} XP</span>
                </div>
                <div className="glass-card h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${progressPercentage?.toString()}%` }}
                  ></div>
                </div>
                <p className="text-white/60 text-sm mt-1">{xpToNextLevel?.toString()} XP to next level</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 text-center bg-primary/10">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-white font-semibold">Level {level?.toString()}</div>
                  <div className="text-white/60 text-sm">Current Level</div>
                </div>
                
                <div className="glass-card p-4 text-center bg-secondary/10">
                  <div className="text-2xl mb-2">❤️</div>
                  <div className="text-white font-semibold">Healthy</div>
                  <div className="text-white/60 text-sm">Pet Status</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Growth Tips and Info */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                ✨ Growth Tips
              </h2>
              <div className="space-y-4">
                <div className="glass-card p-4 bg-primary/10">
                  <h3 className="font-semibold text-white mb-2">Complete Daily Actions</h3>
                  <p className="text-white/70 text-sm">
                    Use public transport, recycle, or participate in community events to earn XP
                  </p>
                </div>
                <div className="glass-card p-4 bg-secondary/10">
                  <h3 className="font-semibold text-white mb-2">Stage Evolution</h3>
                  <p className="text-white/70 text-sm">
                    Baby (<700 XP) → Youth (700-1700 XP) → Adult (>1700 XP)
                  </p>
                </div>
                <div className="glass-card p-4 bg-accent/10">
                  <h3 className="font-semibold text-white mb-2">Consistency Matters</h3>
                  <p className="text-white/70 text-sm">
                    Regular sustainable actions help your EcoPet grow faster and unlock new traits
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Pet Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Token ID:</span>
                  <span className="text-white">#{tokenId?.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Created:</span>
                  <span className="text-white">
                    {createdAt ? new Date(Number(createdAt) * 1000).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Stage:</span>
                  <span className="text-white">{stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total XP:</span>
                  <span className="text-white">{xp?.toString()}</span>
                </div>
              </div>
            </div>

            {/* Web3 Education */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">🎓 About NFAs</h2>
              <div className="space-y-2 text-white/80 text-sm">
                <p>• <strong>Non-Fungible Agent (NFA):</strong> Your unique digital companion stored on the blockchain</p>
                <p>• <strong>Ownership:</strong> You truly own your EcoPet - it's stored in your wallet</p>
                <p>• <strong>Evolution:</strong> Your pet's growth is permanently recorded on the blockchain</p>
                <p>• <strong>Uniqueness:</strong> Each EcoPet has its own traits and development path</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoPet;
