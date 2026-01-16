import React from 'react';
import { Card } from '../types';
import { YugiohCard } from './YugiohCard';
import { Image } from 'lucide-react';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick }) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <Image className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">No cards yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">Create your first idea card to get started building your library.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div key={card.id} className="w-full">
          <YugiohCard card={card} onClick={() => onCardClick(card)} />
        </div>
      ))}
    </div>
  );
};