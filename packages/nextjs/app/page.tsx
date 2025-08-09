"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const stats = [
    { label: "Total Users", value: "12,847", icon: "👥" },
    { label: "Actions Completed", value: "89,234", icon: "🏆" },
    { label: "CO2 Saved", value: "2,456 kg", icon: "📈" },
    { label: "Trees Planted", value: "1,234", icon: "🌱" },
  ];

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16 mt-8">
            <div className="glass-card p-12 mb-8">
              <h1 className="text-5xl font-bold text-white mb-6">
                Earn <span className="text-primary">EcoCred</span> for
                <br />
                Sustainable Actions
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
                Join the blockchain-powered platform that rewards you for making environmentally 
                conscious choices. Earn EcoCred tokens and grow your EcoPet companion.
              </p>
              
              {connectedAddress ? (
                <div className="flex justify-center space-x-4 flex-col sm:flex-row gap-4">
                  <Link href="/actions" className="glass-button bg-primary/30 hover:bg-primary/50 inline-flex items-center">
                    Start Earning
                    <SparklesIcon className="w-4 h-4 ml-2" />
                  </Link>
                  <Link href="/ecopet" className="glass-button inline-flex items-center">
                    View My EcoPet
                  </Link>
                </div>
              ) : (
                <p className="text-white/60">Connect your wallet to get started</p>
              )}
            </div>

            {/* Hero Image */}
            <div className="glass-card p-8">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center"
                alt="Sustainable Environment"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">EcoCred Tokens</h2>
              <p className="text-white/80 mb-6">
                Earn non-tradable EcoCred tokens by completing sustainable actions. 
                These tokens represent your commitment to environmental responsibility.
              </p>
              <div className="glass-card p-4 bg-primary/10">
                <div className="flex items-center justify-between">
                  <span className="text-white">Your Balance</span>
                  <span className="text-primary font-bold">
                    {connectedAddress ? '1,247 ECC' : '--- ECC'}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">EcoPet Companion</h2>
              <p className="text-white/80 mb-6">
                Your Non-Fungible Agent (NFA) that grows and evolves based on your 
                sustainable actions. The more you contribute, the stronger it becomes.
              </p>
              <Link href="/ecopet" className="glass-button w-full text-center inline-block">
                Create Your EcoPet
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="glass-card p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="glass-card p-4 bg-primary/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
                <p className="text-white/70">
                  Connect your Web3 wallet to the Sepolia network to get started.
                </p>
              </div>

              <div className="text-center">
                <div className="glass-card p-4 bg-primary/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Take Action</h3>
                <p className="text-white/70">
                  Complete sustainable actions like using public transport or recycling.
                </p>
              </div>

              <div className="text-center">
                <div className="glass-card p-4 bg-primary/20 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Earn Rewards</h3>
                <p className="text-white/70">
                  Receive EcoCred tokens and watch your EcoPet grow stronger.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <BugAntIcon className="h-8 w-8 fill-secondary" />
                <p>
                  Tinker with your smart contract using the{" "}
                  <Link href="/debug" passHref className="link">
                    Debug Contracts
                  </Link>{" "}
                  tab.
                </p>
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
                <p>
                  Explore your local transactions with the{" "}
                  <Link href="/blockexplorer" passHref className="link">
                    Block Explorer
                  </Link>{" "}
                  tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
