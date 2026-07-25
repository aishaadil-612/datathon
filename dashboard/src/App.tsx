import React from 'react';
import { useRouterStore } from './store/useRouterStore';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { AskIrisSection } from './components/landing/AskIrisSection';
import { OverviewView } from './components/overview/OverviewView';
import { HotspotMapView } from './components/map/HotspotMapView';
import { InsideIrisSection } from './components/landing/InsideIrisSection';
import { CriminalNetworkView } from './components/network/CriminalNetworkView';
import { CaseTimelinesView } from './components/timelines/CaseTimelinesView';
import { CaseSearchRecordsView } from './components/search/CaseSearchRecordsView';
import { AuditGovernanceView } from './components/audit/AuditGovernanceView';
import { CitizenFirPortal } from './components/fir/CitizenFirPortal';
import { ExplainabilityPanel } from './components/common/ExplainabilityPanel';
import { SyntheticWatermark } from './components/common/SyntheticWatermark';

export const App: React.FC = () => {
  const { activeView, isFirPath } = useRouterStore();

  // If user navigates directly to /fir in browser address bar (e.g. http://localhost:3000/fir)
  const isDirectFirUrl = typeof window !== 'undefined' && window.location.pathname === '/fir';

  if (isFirPath || isDirectFirUrl) {
    return <CitizenFirPortal />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'iris':
        return <AskIrisSection />;
      case 'overview':
        return <OverviewView />;
      case 'hotspots':
        return <HotspotMapView />;
      case 'inside-iris':
        return <InsideIrisSection />;
      case 'network':
        return <CriminalNetworkView />;
      case 'timelines':
        return <CaseTimelinesView />;
      case 'search':
        return <CaseSearchRecordsView />;
      case 'audit':
        return <AuditGovernanceView />;
      default:
        return <AskIrisSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex flex-col font-sans select-none overflow-x-hidden text-[#FFFFFF]">
      {/* Persistent Top Bar */}
      <TopBar />

      {/* Main Layout Container with Left Navigation Sidebar Rail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Rail */}
        <Sidebar />

        {/* Main Active View Content Panel */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Shared Explainability Drawer */}
      <ExplainabilityPanel />

      {/* Synthetic Demo Watermark */}
      <SyntheticWatermark />
    </div>
  );
};

export default App;
