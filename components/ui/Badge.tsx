import React from 'react';
import { CardType } from '../../types';
import { CARD_TYPE_CONFIG } from '../../constants';

interface BadgeProps {
  type: CardType;
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ type, className, showIcon = false }) => {
  const config = CARD_TYPE_CONFIG[type] || CARD_TYPE_CONFIG[CardType.OTHER];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.color} ${className}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </span>
  );
};