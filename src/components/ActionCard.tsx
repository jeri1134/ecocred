import React from 'react';
import { SustainableAction } from '../types';
import { Bus, Trash2, TreePine, Users } from 'lucide-react';

interface ActionCardProps {
  action: SustainableAction;
  onPerform: (action: SustainableAction) => void;
  disabled?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onPerform, disabled }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bus':
        return Bus;
      case 'trash':
        return Trash2;
      case 'tree':
        return TreePine;
      case 'users':
        return Users;
      default:
        return Bus;
    }
  };

  const Icon = getIcon(action.icon);

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="glass-card p-3 bg-eco-primary/20">
          <Icon className="w-6 h-6 text-eco-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{action.name}</h3>
          <p className="text-white/70 text-sm mb-4">{action.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-eco-primary font-medium">+{action.xpReward} XP</span>
              {action.cost && (
                <span className="text-white/60 text-sm">{action.cost} ETH</span>
              )}
            </div>
            
            <button
              onClick={() => onPerform(action)}
              disabled={disabled}
              className={`glass-button ${
                disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-eco-primary/30 hover:text-white'
              }`}
            >
              Perform Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
