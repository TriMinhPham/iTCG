import React from 'react';
import { Card } from '../types';
import { CARD_TYPE_CONFIG } from '../constants';
import { Image as ImageIcon } from 'lucide-react';

interface YugiohCardProps {
  card: Card;
  onClick?: () => void;
  className?: string;
}

export const YugiohCard: React.FC<YugiohCardProps> = ({ card, onClick, className = '' }) => {
  const config = CARD_TYPE_CONFIG[card.card_type];
  const Icon = config.icon;

  return (
    <div 
      onClick={onClick}
      className={`relative aspect-[59/86] rounded-lg p-[8px] ${config.frameColor} shadow-xl select-none flex flex-col ${onClick ? 'cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-2xl' : ''} ${className}`}
    >
      {/* Title Bar */}
      <div className="flex justify-between items-center bg-white/95 border-b-2 border-r-2 border-slate-400/40 px-2 py-0.5 mb-[6px] rounded-[2px] shadow-sm flex-shrink-0 h-[8%]">
        <h3 className="font-serif font-bold text-[10px] sm:text-xs text-slate-900 truncate tracking-tight w-full mr-2" style={{ fontFamily: 'Cinzel, serif' }}>
          {card.title}
        </h3>
        <div className="flex-shrink-0">
          <Icon className="w-3 h-3 text-slate-800" />
        </div>
      </div>

      {/* Image Area */}
      <div className="aspect-square bg-slate-100 border-[4px] border-slate-300/80 shadow-inner relative mb-[6px] mx-[2px] overflow-hidden flex-shrink-0 z-0">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <ImageIcon className="w-10 h-10 opacity-30" />
          </div>
        )}
      </div>

      {/* Description Box */}
      <div className="bg-[#fcf8f2] border-[2px] border-slate-600/20 p-[6px] rounded-[2px] flex-1 flex flex-col relative overflow-hidden">
        <div className="text-[9px] font-bold text-slate-900 mb-1 font-serif flex items-center gap-1 border-b border-black/10 pb-0.5">
           <span>[ {config.label} / Idea ]</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
           <p className="text-[10px] leading-[1.3] text-slate-800 font-medium font-sans">
             {card.essence || "No description provided."}
           </p>
        </div>

        <div className="mt-auto border-t border-black/20 pt-0.5 flex justify-end">
          <span className="text-[8px] font-mono text-slate-500">ID/{card.id.slice(0, 8)}</span>
        </div>
      </div>
    </div>
  );
};