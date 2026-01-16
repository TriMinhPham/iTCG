import React, { useState, useEffect } from 'react';
import { LibraryScreen } from './screens/LibraryScreen';
import { CreateCardScreen } from './screens/CreateCardScreen';
import { CardDetailScreen } from './screens/CardDetailScreen';
import { Card, ScreenState, CreateCardData } from './types';
import { cardService } from './services/storageService';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ name: 'library' });
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCards = async () => {
    try {
      const data = await cardService.getAll();
      setCards(data);
    } catch (e) {
      setError('Failed to load library');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleCreate = async (data: CreateCardData) => {
    try {
      const newCard = await cardService.create(data);
      setCards(prev => [newCard, ...prev]);
      setScreen({ name: 'library' });
    } catch (e) {
      console.error(e);
      alert(`Failed to save card: ${e instanceof Error ? e.message : 'Unknown error'}. Try using a smaller image.`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cardService.delete(id);
      setCards(prev => prev.filter(c => c.id !== id));
      setScreen({ name: 'library' });
    } catch (e) {
      console.error(e);
      alert('Failed to delete card');
    }
  };

  const renderScreen = () => {
    switch (screen.name) {
      case 'library':
        return (
          <LibraryScreen
            cards={cards}
            onNavigateCreate={() => setScreen({ name: 'create' })}
            onNavigateDetail={(id) => setScreen({ name: 'detail', cardId: id })}
          />
        );
      case 'create':
        return (
          <CreateCardScreen
            onBack={() => setScreen({ name: 'library' })}
            onSave={handleCreate}
          />
        );
      case 'detail':
        const card = cards.find(c => c.id === screen.cardId);
        if (!card) return <div>Card not found</div>;
        return (
          <CardDetailScreen
            card={card}
            onBack={() => setScreen({ name: 'library' })}
            onDelete={handleDelete}
            onEdit={(id) => console.log('Edit', id)}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Top Bar / Branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
           <div 
             className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => setScreen({ name: 'library' })}
           >
             <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
               <span className="text-white font-bold text-xs">ID</span>
             </div>
             <span className="font-bold text-slate-900 tracking-tight">IdeaDeck</span>
           </div>
           
           <div className="text-xs text-slate-400 font-medium">
             v0.1 Beta
           </div>
        </div>
      </header>
      
      <main>
        {renderScreen()}
      </main>

    </div>
  );
}