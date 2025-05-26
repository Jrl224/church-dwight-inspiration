import { create } from 'zustand';

export interface Product {
  id: string;
  imageUrl: string;
  localPath: string;
  name: string;
  brand: string;
  category: string;
  features: string[];
  sustainabilityScore?: number;
  prompt: string;
  createdAt: Date;
}

interface AppState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  generatedProducts: Product[];
  selectedProduct: Product | null;
  sessionId: string;
  favorites: string[];
  
  setSelectedCategory: (category: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  addGeneratedProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  toggleFavorite: (productId: string) => void;
  setSessionId: (sessionId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedCategory: null,
  selectedBrand: null,
  generatedProducts: [],
  selectedProduct: null,
  sessionId: '',
  favorites: [],
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  addGeneratedProducts: (products) => set((state) => ({ 
    generatedProducts: [...state.generatedProducts, ...products] 
  })),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  toggleFavorite: (productId) => set((state) => ({
    favorites: state.favorites.includes(productId)
      ? state.favorites.filter(id => id !== productId)
      : [...state.favorites, productId]
  })),
  setSessionId: (sessionId) => set({ sessionId })
}));