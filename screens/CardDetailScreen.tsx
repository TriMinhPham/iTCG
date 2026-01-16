import React, { useState } from 'react';
import { Card } from '../types';
import { YugiohCard } from '../components/YugiohCard';
import { Button } from '../components/ui/Button';
import { ExternalLink, Calendar, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface CardDetailScreenProps {
  card: Card;
  onBack: () => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void; // Placeholder
}

export const CardDetailScreen: React.FC<CardDetailScreenProps> = ({ card, onBack, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this card? This cannot be undone.')) {
      setIsDeleting(true);
      await onDelete(card.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Nav */}
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
        {/* Left Column: The Card Artifact */}
        <div className="flex justify-center md:justify-end">
          <div 
            className="w-full max-w-[320px] md:max-w-[350px] cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setImageModalOpen(true)}
          >
             <YugiohCard card={card} className="shadow-2xl" />
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="space-y-8 py-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2 font-serif tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
              {card.title}
            </h1>
            <div className="flex items-center text-slate-400 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Created on {new Date(card.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="prose prose-slate prose-lg">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Full Essence</h3>
             <p className="text-slate-700 leading-relaxed">
               {card.essence || "No description provided."}
             </p>
          </div>

          <div className="flex flex-col gap-4">
             {card.source_url && (
              <a 
                href={card.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Source Link
              </a>
            )}
            
            <div className="pt-6 border-t border-slate-200 w-full flex gap-3">
               <Button 
                variant="danger" 
                onClick={handleDelete} 
                isLoading={isDeleting}
                icon={<Trash2 className="w-4 h-4" />}
               >
                 Destroy Card
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal (Zoom) */}
      {isImageModalOpen && card.image_url && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setImageModalOpen(false)}
        >
          <img 
            src={card.image_url} 
            alt={card.title}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};