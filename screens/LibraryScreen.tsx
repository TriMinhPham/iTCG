import React, { useState, useMemo } from 'react';
import { Card, CardType } from '../types';
import { CardGrid } from '../components/CardGrid';
import { Button } from '../components/ui/Button';
import { Plus, Search, Filter, X } from 'lucide-react';
import { CARD_TYPE_CONFIG } from '../constants';

interface LibraryScreenProps {
  cards: Card[];
  onNavigateCreate: () => void;
  onNavigateDetail: (id: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ 
  cards, 
  onNavigateCreate, 
  onNavigateDetail 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CardType | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCards = useMemo(() => {
    return cards
      .filter(card => {
        const matchesSearch = 
          card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (card.essence || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'ALL' || card.card_type === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.created_at - a.created_at);
  }, [cards, searchQuery, selectedType]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Library</h1>
          <p className="text-slate-500">
            {cards.length} {cards.length === 1 ? 'idea' : 'ideas'} collected
          </p>
        </div>
        <Button onClick={onNavigateCreate} icon={<Plus className="w-4 h-4" />}>
          New Card
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-4 z-20">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 sm:text-sm shadow-sm"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
           {/* Mobile-friendly horizontal scroll for filters if needed */}
           <Button 
            variant="secondary" 
            className="whitespace-nowrap"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
           >
             {selectedType === 'ALL' ? 'Filter' : `Type: ${CARD_TYPE_CONFIG[selectedType].label}`}
           </Button>
        </div>
      </div>

      {/* Filter Bar (Conditional) */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter by Type</span>
             <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
               <X className="w-4 h-4" />
             </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === 'ALL' 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {Object.values(CardType).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {CARD_TYPE_CONFIG[type].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <CardGrid cards={filteredCards} onCardClick={(c) => onNavigateDetail(c.id)} />
    </div>
  );
};