"use client";

import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Profile = () => {
  const { address } = useAccount();

  // Read user profile
  const { data: userProfile } = useScaffoldContractRead({
    contractName: "ETHTransactionContract",
    functionName: "getUserProfile",
    args: [address],
  });

  // Read pet data
  const { data: petData } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getPetData",
    args: [address],
  });

  const { data: xpToNextLevel } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getXPToNextLevel",
    args: [address],
  });

  const { data: progressPercentage } = useScaffoldContractRead({
    contractName: "EcoPet",
    functionName: "getProgressToNextLevel",
    args: [address],
  });

  // Mock activity history (in a real app, this would come from events)
  const activityHistory = [
    {
      id: 1,
      action: "Public Transportation",
      xp: 10,
      tokens: 1,
      timestamp: new Date("2024-01-15"),
      type: "action",
    },
    {
      id: 2,
      action: "Community Cleanup",
      xp: 18,
      tokens: 1,
      timestamp: new Date("2024-01-14"),
      type: "action",
    },
    {
      id: 3,
      action: "Recycling Activity",
      xp: 15,
      tokens: 1,
      timestamp: new Date("2024-01-13"),
      type: "action",
    },
    {
      id: 4,
      action: "EcoWarrior Badge",
      tokens: -100,
      timestamp: new Date("2024-01-12"),
      type: "redemption",
    },
  ];

  if (!address) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="glass-card p-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">User Profile</h1>
            <p className="text-xl text-white/80">
              Please connect your wallet to view your profile
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tokenBalance = userProfile ? Number(userProfile[0]) : 0;
  const totalActions = userProfile ? Number(userProfile[1]) : 0;
  const totalXP = userProfile ? Number(userProfile[2]) : 0;

  const petName = petData ? petData[1] : "No EcoPet";
  const petLevel = petData ? Number(petData[3]) : 0;
  const petStage = petData ? petData[4] : "N/A";
  const petXP = petData ? Number(petData[2]) : 0;
  const petImage = petData ? petData[7] : "";

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">User Profile Dashboard</h1>
          <p className="text-xl text-white/80">
            Track your sustainable journey and EcoPet progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Balance & Stats */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Account Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 bg-primary/10 text-center">
                  <div className="text-3xl mb-2">🪙</div>
                  <div className="text-2xl font-bold text-primary">{tokenBalance}</div>
                  <div className="text-white/70">EcoCred Tokens</div>
                </div>
                <div className="glass-card p-4 bg-secondary/10 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-secondary">{totalActions}</div>
                  <div className="text-white/70">Actions Completed</div>
                </div>
                <div className="glass-card p-4 bg-accent/10 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-2xl font-bold text-accent">{totalXP}</div>
                  <div className="text-white/70">Total XP Earned</div>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Activity History</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activityHistory.map((activity) => (
                  <div key={activity.id} className="glass-card p-4 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`glass-card p-2 ${
                          activity.type === 'action' ? 'bg-primary/20' : 'bg-warning/20'
                        }`}>
                          {activity.type === 'action' ? '🎯' : '🎁'}
                        </div>
                        
                        <div>
                          <div className="text-white font-medium">{activity.action}</div>
                          <div className="text-white/60 text-sm">
                            {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {activity.xp && (
                          <div className="text-primary font-medium">+{activity.xp} XP</div>
                        )}
                        <div className={`font-medium ${
                          activity.tokens > 0 ? 'text-success' : 'text-warning'
                        }`}>
                          {activity.tokens > 0 ? '+' : ''}{activity.tokens} ECC
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
              <div className="space-y-4">
                <div className="glass-card p-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="glass-card p-2 bg-success/20">
                        ✅
                      </div>
                      <div>
                        <div className="text-white font-medium">Action Completed</div>
                        <div className="text-white/60 text-sm">Public Transportation</div>
                      </div>
                    </div>
                    <div className="text-success text-sm">Confirmed</div>
                  </div>
                </div>
                
                <div className="glass-card p-4 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="glass-card p-2 bg-warning/20">
                        🎁
                      </div>
                      <div>
                        <div className="text-white font-medium">Reward Redeemed</div>
                        <div className="text-white/60 text-sm">EcoWarrior Badge</div>
                      </div>
                    </div>
                    <div className="text-success text-sm">Confirmed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EcoPet Info */}
          <div className="space-y-6">
            {petData ? (
              <>
                {/* EcoPet Card */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">My EcoPet</h2>
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <img
                        src={petImage}
                        alt={petName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
                      />
                      <div className="absolute -top-2 -right-2 glass-card px-2 py-1 bg-primary/30">
                        <span className="text-white text-sm font-bold">Lv.{petLevel}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-2">{petName}</h3>
                    <div className="text-primary font-semibold">{petStage} Stage</div>
                  </div>

                  {/* XP Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Experience</span>
                      <span className="text-white text-sm">{petXP} XP</span>
                    </div>
                    <div className="glass-card h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-white/60 text-xs mt-1">
                      {xpToNextLevel} XP to next level
                    </p>
                  </div>

                  {/* Pet Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3 bg-primary/10 text-center">
                      <div className="text-primary font-bold">{petLevel}</div>
                      <div className="text-white/70 text-xs">Level</div>
                    </div>
                    <div className="glass-card p-3 bg-secondary/10 text-center">
                      <div className="text-secondary font-bold">{petXP}</div>
                      <div className="text-white/70 text-xs">Total XP</div>
                    </div>
                  </div>
                </div>

                {/* Progress to Next Level */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Progress to Next Level</h2>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {progressPercentage}%
                    </div>
                    <div className="text-white/70 mb-4">Complete</div>
                    <div className="glass-card h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-white/60 text-sm mt-2">
                      {xpToNextLevel} XP remaining
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-4">No EcoPet</h2>
                <p className="text-white/70 mb-4">Create your EcoPet companion to start your journey!</p>
                <a href="/ecopet" className="glass-button bg-primary/30 hover:bg-primary/50">
                  Create EcoPet
                </a>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a href="/actions" className="glass-button w-full text-center block">
                  🎯 Complete Actions
                </a>
                <a href="/rewards" className="glass-button w-full text-center block">
                  🎁 Browse Rewards
                </a>
                <a href="/ecopet" className="glass-button w-full text-center block">
                  🐾 View EcoPet
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
