import React from "react";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "../hooks/useWallet";
import WalletAvatar from "./WalletAvatar";

const WalletButton = () => {
  const { wallet, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number) => {
    return balance.toFixed(4);
  };

  if (!wallet.isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="h-5 w-5" />
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Balance Display */}
      <div className="glass-card px-4 py-2">
        <div className="text-sm text-white/70">Balance</div>
        <div className="text-white font-bold">
          {formatBalance(wallet.balance)} ETH
        </div>
      </div>

      {/* Address & Avatar */}
      <div className="flex items-center space-x-3 glass-card px-4 py-2">
        <WalletAvatar address={wallet.address} size={32} />
        <div>
          <div className="text-sm text-white/70">Address</div>
          <div className="text-white font-mono text-sm">
            {formatAddress(wallet.address)}
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4 text-white/70 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default WalletButton;
