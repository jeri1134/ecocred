import React, { useState } from 'react';
import { X, Send, DollarSign } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (to: string, amount: number) => void;
  onWithdraw: (amount: number) => void;
  currentBalance: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  onWithdraw,
  currentBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'transfer' | 'withdraw'>('transfer');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (activeTab === 'transfer' && toAddress && amountNum > 0) {
      onTransfer(toAddress, amountNum);
    } else if (activeTab === 'withdraw' && amountNum > 0) {
      onWithdraw(amountNum);
    }
    
    setToAddress('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Transaction</h2>
          <button
            onClick={onClose}
            className="glass-button p-2 hover:bg-red-500/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 glass-button ${
              activeTab === 'transfer' ? 'bg-eco-primary/30' : ''
            }`}
          >
            <Send className="w-4 h-4 mr-2" />
            Transfer
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 glass-button ${
              activeTab === 'withdraw' ? 'bg-eco-primary/30' : ''
            }`}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Withdraw
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'transfer' && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                To Address
              </label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="glass-input w-full"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.0001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0000"
              max={currentBalance}
              className="glass-input w-full"
              required
            />
            <p className="text-white/60 text-xs mt-1">
              Available: {currentBalance.toFixed(4)} ETH
            </p>
          </div>

          <button
            type="submit"
            className="glass-button w-full bg-eco-primary/30 hover:bg-eco-primary/50"
          >
            {activeTab === 'transfer' ? 'Transfer' : 'Withdraw'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
