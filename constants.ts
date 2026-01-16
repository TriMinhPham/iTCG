import { CardType } from './types';
import { Layout, Star, Lightbulb, Box, Grid, TrendingUp, Cpu, Hash } from 'lucide-react';

export const CARD_TYPE_CONFIG: Record<CardType, { label: string; color: string; icon: any; frameColor: string }> = {
  [CardType.UI]: { 
    label: 'UI', 
    color: 'bg-orange-100 text-orange-800 border-orange-200', 
    icon: Layout, 
    frameColor: 'bg-[#C06828]' // Effect Monster (Orange)
  },
  [CardType.FEATURE]: { 
    label: 'Feature', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: Star, 
    frameColor: 'bg-[#C8A440]' // Normal Monster (Yellow)
  },
  [CardType.INSIGHT]: { 
    label: 'Insight', 
    color: 'bg-teal-100 text-teal-800 border-teal-200', 
    icon: Lightbulb, 
    frameColor: 'bg-[#1D9E74]' // Spell (Green)
  },
  [CardType.MODEL]: { 
    label: 'Model', 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Box, 
    frameColor: 'bg-[#A086B7]' // Fusion (Purple)
  },
  [CardType.PATTERN]: { 
    label: 'Pattern', 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Grid, 
    frameColor: 'bg-[#9DB5CC]' // Ritual (Blue)
  },
  [CardType.GROWTH]: { 
    label: 'Growth', 
    color: 'bg-pink-100 text-pink-800 border-pink-200', 
    icon: TrendingUp, 
    frameColor: 'bg-[#BC5A84]' // Trap (Pink)
  },
  [CardType.TECH]: { 
    label: 'Tech', 
    color: 'bg-slate-100 text-slate-800 border-slate-200', 
    icon: Cpu, 
    frameColor: 'bg-[#DEDFE1]' // Synchro (White/Silver)
  },
  [CardType.OTHER]: { 
    label: 'Other', 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: Hash, 
    frameColor: 'bg-[#555555]' // Token (Dark Grey)
  },
};

export const MOCK_INITIAL_CARDS = [
  {
    id: '1',
    title: 'Bi-directional Linking',
    image_url: 'https://picsum.photos/400/300?random=1',
    essence: 'The ability to link notes forward and backward creates a knowledge graph.',
    card_type: CardType.PATTERN,
    created_at: Date.now() - 100000,
    updated_at: Date.now(),
    source_url: 'https://example.com'
  },
  {
    id: '2',
    title: 'Optimistic UI Updates',
    image_url: 'https://picsum.photos/400/300?random=2',
    essence: 'Update the UI immediately before the server responds to make the app feel faster.',
    card_type: CardType.UI,
    created_at: Date.now(),
    updated_at: Date.now(),
  }
];