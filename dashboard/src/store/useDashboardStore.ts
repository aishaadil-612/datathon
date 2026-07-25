import { create } from 'zustand';
import { Role, Language, ViewType, ExplainabilityData } from '../types';

interface DashboardState {
  activeView: ViewType;
  role: Role;
  language: Language;
  globalSearchQuery: string;
  
  // Explainability drawer
  explainabilityDrawer: {
    isOpen: boolean;
    data: ExplainabilityData | null;
  };

  // Selections
  selectedCaseId: string | null;
  selectedNodeId: string | null;

  // Path highlight on Network view
  pathHighlight: {
    sourceId: string | null;
    targetId: string | null;
    isHighlightActive: boolean;
  };

  // Map controls
  mapControls: {
    showHeatmap: boolean;
    showForecast: boolean;
    timeHorizon: '7d' | '30d' | '90d';
    selectedDistrict: string | null;
  };

  // AI Workspace Widget state
  workspaceWidget: {
    isOpen: boolean;
    isMinimized: boolean;
  };

  // Alerts
  alertCount: number;

  // Actions
  setActiveView: (view: ViewType) => void;
  setRole: (role: Role) => void;
  setLanguage: (lang: Language) => void;
  setGlobalSearchQuery: (query: string) => void;
  
  openExplainability: (data: ExplainabilityData) => void;
  closeExplainability: () => void;

  setSelectedCaseId: (caseId: string | null) => void;
  setSelectedNodeId: (nodeId: string | null) => void;

  setPathSource: (sourceId: string | null) => void;
  setPathTarget: (targetId: string | null) => void;
  clearPathHighlight: () => void;

  toggleHeatmap: () => void;
  toggleForecast: () => void;
  setTimeHorizon: (horizon: '7d' | '30d' | '90d') => void;
  setSelectedDistrict: (district: string | null) => void;

  toggleWorkspaceWidget: () => void;
  setWorkspaceWidgetOpen: (open: boolean) => void;
  clearAlerts: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeView: 'overview',
  role: 'investigator',
  language: 'en',
  globalSearchQuery: '',

  explainabilityDrawer: {
    isOpen: false,
    data: null,
  },

  selectedCaseId: 'FIR-2026-0489',
  selectedNodeId: 'p1',

  pathHighlight: {
    sourceId: 'p1',
    targetId: 'c4',
    isHighlightActive: true,
  },

  mapControls: {
    showHeatmap: true,
    showForecast: true,
    timeHorizon: '30d',
    selectedDistrict: null,
  },

  workspaceWidget: {
    isOpen: true,
    isMinimized: false,
  },

  alertCount: 3,

  setActiveView: (view) => set({ activeView: view }),
  setRole: (role) => set({ role }),
  setLanguage: (lang) => set({ language: lang }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  openExplainability: (data) => set({ explainabilityDrawer: { isOpen: true, data } }),
  closeExplainability: () => set((state) => ({ explainabilityDrawer: { ...state.explainabilityDrawer, isOpen: false } })),

  setSelectedCaseId: (caseId) => set({ selectedCaseId: caseId }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  setPathSource: (sourceId) => set((state) => ({
    pathHighlight: { ...state.pathHighlight, sourceId, isHighlightActive: !!(sourceId && state.pathHighlight.targetId) }
  })),
  setPathTarget: (targetId) => set((state) => ({
    pathHighlight: { ...state.pathHighlight, targetId, isHighlightActive: !!(state.pathHighlight.sourceId && targetId) }
  })),
  clearPathHighlight: () => set({
    pathHighlight: { sourceId: null, targetId: null, isHighlightActive: false }
  }),

  toggleHeatmap: () => set((state) => ({
    mapControls: { ...state.mapControls, showHeatmap: !state.mapControls.showHeatmap }
  })),
  toggleForecast: () => set((state) => ({
    mapControls: { ...state.mapControls, showForecast: !state.mapControls.showForecast }
  })),
  setTimeHorizon: (timeHorizon) => set((state) => ({
    mapControls: { ...state.mapControls, timeHorizon }
  })),
  setSelectedDistrict: (selectedDistrict) => set((state) => ({
    mapControls: { ...state.mapControls, selectedDistrict }
  })),

  toggleWorkspaceWidget: () => set((state) => ({
    workspaceWidget: { ...state.workspaceWidget, isMinimized: !state.workspaceWidget.isMinimized }
  })),
  setWorkspaceWidgetOpen: (isOpen) => set((state) => ({
    workspaceWidget: { ...state.workspaceWidget, isOpen }
  })),
  clearAlerts: () => set({ alertCount: 0 })
}));
