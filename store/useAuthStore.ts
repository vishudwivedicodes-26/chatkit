import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: {
    id: string;
    uid: string;
    username: string;
    display_name: string;
    avatar_id: string;
  } | null;
  privateKeyBase64: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: any, privateKey: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      privateKeyBase64: null,
      isAuthenticated: false,
      isLoading: true,
      
      login: (user, privateKey) => set({ 
        user, 
        privateKeyBase64: privateKey, 
        isAuthenticated: true,
        isLoading: false
      }),
      
      logout: () => set({ 
        user: null, 
        privateKeyBase64: null, 
        isAuthenticated: false,
        isLoading: false
      }),
      
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'cipher-auth-storage',
      // We purposefully don't persist privateKeyBase64 in localstorage in a real app,
      // but for this implementation we rely on it being encrypted or stored in IndexedDB.
      // Here we will use Zustand persist for standard UI state, but sensitive 
      // keys should ideally be in IndexedDB. For simplicity, we'll configure
      // persist to omit sensitive fields if needed, but the prompt says:
      // "stored locally in the browser (IndexedDB)".
      // For now, let's just keep it in memory/zustand. We'll handle IndexedDB separately.
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
