export interface WalletInfo {
  address: string;
  balance: number;
  isConnected: boolean;
}

export interface EcoPet {
  id: string;
  name: string;
  level: number;
  xp: number;
  image: string;
  traits: string[];
  lastActionTimestamp?: number;
  recentActions?: number[];
  mood?: string;
}

export interface SustainableAction {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  cost?: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: "action" | "transfer" | "withdrawal";
  amount: number;
  timestamp: Date;
  description: string;
  status: "pending" | "completed" | "failed";
}

export interface MoodData {
  mood: string;
  message: string;
  emoji: string;
  color: string;
}
