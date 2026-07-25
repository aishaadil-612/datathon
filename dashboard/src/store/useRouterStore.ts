import { create } from 'zustand';

export type AppView = 
  | 'iris' 
  | 'overview' 
  | 'hotspots' 
  | 'inside-iris' 
  | 'network' 
  | 'timelines' 
  | 'search' 
  | 'audit';

interface RouterState {
  activeView: AppView;
  isFirPath: boolean;
  setActiveView: (view: AppView) => void;
}

export const useRouterStore = create<RouterState>((set) => ({
  activeView: 'iris',
  isFirPath: typeof window !== 'undefined' && window.location.pathname === '/fir',
  setActiveView: (activeView) => set({ activeView }),
}));
