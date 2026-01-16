import React, { useState } from 'react';
import { CardType, CreateCardData } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CARD_TYPE_CONFIG } from '../constants';
import { extractCardFromUrl } from '../services/geminiService';
import { ArrowLeft, Link as LinkIcon, Edit3, Image as ImageIcon, Sparkles, Upload } from 'lucide-react';

interface CreateCardScreenProps {
  onBack: () => void;
  onSave: (data: CreateCardData) => Promise<void>;
}

export const CreateCardScreen: React.FC<CreateCardScreenProps> = ({ onBack, onSave }) => {
  const [mode, setMode] = useState<'MANUAL' | 'LINK'>('MANUAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [essence, setEssence] = useState('');
  const [cardType, setCardType] = useState<CardType>(CardType.OTHER);
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkInput, setLinkInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we use FileReader to create a base64 string.
      // In production, this would upload to S3/Storage and return a URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!linkInput) return;
    setIsExtracting(true);
    try {
      // 1. Set source URL immediately
      setSourceUrl(linkInput);
      
      // 2. Call AI
      const extracted = await extractCardFromUrl(linkInput);
      
      // 3. Fill form
      if (extracted.title) setTitle(extracted.title);
      if (extracted.essence) setEssence(extracted.essence);
      if (extracted.card_type) setCardType(extracted.card_type);
      
      // 4. Switch to manual mode for review
      setMode('MANUAL');
    } catch (error) {
      console.error("Extraction failed", error);
      alert("Could not extract data automatically. Please fill details manually.");
      setMode('MANUAL');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title,
        essence,
        card_type: cardType,
        image_url: imageUrl,
        source_url: sourceUrl
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Library
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setMode('MANUAL')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              mode === 'MANUAL' ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <Edit3 className="w-4 h-4 mr-2" />
              Manual Entry
            </div>
          </button>
          <button
            onClick={() => setMode('LINK')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              mode === 'LINK' ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              Auto-fill from Link
            </div>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {mode === 'LINK' ? (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Magic Extraction</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                  Paste a URL and we'll use Gemini AI to extract the title, essence, and category for you.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  autoFocus
                />
                <Button 
                  onClick={handleExtract} 
                  disabled={!linkInput} 
                  isLoading={isExtracting}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600"
                >
                  {isExtracting ? 'Analyzing...' : 'Auto-fill Details'}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                  placeholder="e.g., Optimistic UI Patterns"
                />
              </div>

              {/* Essence */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Essence <span className="text-slate-400 font-normal">(Max 2 sentences)</span></label>
                <textarea
                  rows={3}
                  value={essence}
                  onChange={(e) => setEssence(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                  placeholder="What is the core idea?"
                  maxLength={280}
                />
              </div>

              {/* Grid: Type & Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Card Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(CardType).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCardType(t)}
                        className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          cardType === t 
                            ? `${CARD_TYPE_CONFIG[t].color} ring-1 ring-offset-1 ring-slate-300` 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                         {CARD_TYPE_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                  <div className="space-y-3">
                     {imageUrl ? (
                       <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                         <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                         <button 
                          type="button" 
                          onClick={() => setImageUrl('')}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium"
                         >
                           Remove
                         </button>
                       </div>
                     ) : (
                       <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            id="image-upload"
                            onChange={handleImageUpload}
                          />
                          <label 
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Upload Image</span>
                          </label>
                       </div>
                     )}
                     <div className="text-center">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">OR</span>
                     </div>
                     <input
                        type="url"
                        placeholder="Paste image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                     />
                  </div>
                </div>
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500">
                    <LinkIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-r-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onBack}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>Save Card</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};