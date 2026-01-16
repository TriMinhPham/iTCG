export enum CardType {
  UI = 'ui',
  FEATURE = 'feature',
  INSIGHT = 'insight',
  MODEL = 'model',
  PATTERN = 'pattern',
  GROWTH = 'growth',
  TECH = 'tech',
  OTHER = 'other'
}

export interface Card {
  id: string;
  title: string;
  image_url?: string;
  essence?: string;
  card_type: CardType;
  source_url?: string;
  created_at: number;
  updated_at: number;
}

export type ScreenState = 
  | { name: 'library' }
  | { name: 'create' }
  | { name: 'detail'; cardId: string };

export interface CreateCardData {
  title: string;
  image_url: string;
  essence: string;
  card_type: CardType;
  source_url: string;
}