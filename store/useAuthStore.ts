import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: {
    id: string;
    uid: string;
    username: string;
    display_name: string;
    avatar_id: string;
    public_key: string;
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
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
      partialize: (state) => ({ 
        user: state.user,
        privateKeyBase64: state.privateKeyBase64,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
