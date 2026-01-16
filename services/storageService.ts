import { Card, CreateCardData } from '../types';
import { MOCK_INITIAL_CARDS } from '../constants';

const DB_NAME = 'ideadeck_db';
const STORE_NAME = 'cards';
const DB_VERSION = 1;

// Robust ID generator that works in all contexts
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback for insecure contexts
    }
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Open (and initialize) the IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

class CardService {
  async getAll(): Promise<Card[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const cards = request.result as Card[];
        if (cards.length === 0) {
          // If DB is empty, seed with mock data so the app isn't empty on first load
          this.seedMockData(db).then(resolve).catch(resolve as any); // Resolve with seeded or empty
        } else {
          // Sort by newest first (created_at desc)
          resolve(cards.sort((a, b) => b.created_at - a.created_at));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  private async seedMockData(db: IDBDatabase): Promise<Card[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      MOCK_INITIAL_CARDS.forEach(card => store.add(card));

      transaction.oncomplete = () => resolve(MOCK_INITIAL_CARDS as Card[]);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async create(data: CreateCardData): Promise<Card> {
    const db = await openDB();
    const newCard: Card = {
      id: generateId(),
      created_at: Date.now(),
      updated_at: Date.now(),
      ...data
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(newCard);

      request.onsuccess = () => resolve(newCard);
      request.onerror = () => reject(request.error);
    });
  }

  async update(id: string, data: Partial<CreateCardData>): Promise<Card> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const card = getRequest.result as Card;
        if (!card) {
          reject(new Error('Card not found'));
          return;
        }
        const updatedCard = { ...card, ...data, updated_at: Date.now() };
        const putRequest = store.put(updatedCard);
        putRequest.onsuccess = () => resolve(updatedCard);
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async delete(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const cardService = new CardService();