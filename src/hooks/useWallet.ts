import { useState, useEffect } from "react";
import { WalletInfo } from "../types";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: "",
    balance: 0,
    isConnected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet!");
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });

        // Convert balance from wei to ETH
        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

        const walletInfo = {
          address,
          balance: balanceInEth,
          isConnected: true,
        };

        setWallet(walletInfo);
        localStorage.setItem("wallet", JSON.stringify(walletInfo));
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: "",
      balance: 0,
      isConnected: false,
    });
    localStorage.removeItem("wallet");
  };

  const updateBalance = async () => {
    if (!wallet.isConnected || !window.ethereum) return;

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      });

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
      const updatedWallet = { ...wallet, balance: balanceInEth };
      
      setWallet(updatedWallet);
      localStorage.setItem("wallet", JSON.stringify(updatedWallet));
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      setWallet(walletData);
      // Update balance on load
      if (walletData.isConnected && window.ethereum) {
        updateBalance();
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== wallet.address) {
          // Account changed, reconnect
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [wallet.address]);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    updateBalance,
    isConnecting,
  };
};
