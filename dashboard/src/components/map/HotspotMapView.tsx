import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockHotspots } from '../../mock/hotspots';
import { mockFIRs } from '../../mock/fir';

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom incident marker icon generator
const createCustomMarkerIcon = (severity: string, caseId: string) => {
  const color = severity === 'critical' ? '#E53935' : severity === 'high' ? '#F5A623' : '#CCFF00';
  const html = `
    <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0B0C0E; font-weight: 800; border: 2px solid #0B0C0E; box-shadow: 0 0 12px ${color}80; font-size: 10px; font-family: monospace;">
      ${caseId.slice(-3)}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const HotspotMapView: React.FC = () => {
  const {
    mapControls,
    toggleHeatmap,
    toggleForecast,
    setTimeHorizon,
    language,
    setSelectedCaseId,
    setActiveView,
    openExplainability
  } = useDashboardStore();

  const t = translations[language];
  const { showHeatmap, showForecast, timeHorizon } = mapControls;

  const handleZoneClick = (zoneName: string, confidence: number) => {
    openExplainability({
      conclusion: `Spatial model identifies ${zoneName} as a 30-day predicted rising risk zone with ${confidence}% confidence.`,
      confidence: confidence,
      reasoningSteps: [
        "1. Ingested 90-day spatio-temporal incident cluster vectors across East Bengaluru.",
        "2. Evaluated night-time window burglary correlation in ST-DBSCAN model.",
        "3. High density of unmonitored commercial warehouses detected along Outer Ring Road corridor.",
        "4. Flagged for precinct supervisor mobile patrol optimization."
      ],
      evidenceSources: [
        { id: "hz-pred-1", label: zoneName, type: "Predicted Risk Zone" },
        { id: "FIR-2026-0489", label: "FIR-2026-0489", type: "Burglary FIR" }
      ],
      agentAttribution: {
        name: "Analytics Agent",
        type: "ST-DBSCAN + XGBoost Forecast",
        version: "v4.1",
        latencyMs: 580
      }
    });
  };

  return (
    <section id="section-hotspots" className="flex flex-col h-screen overflow-hidden select-none border-b border-[#22242D] pt-2">
      {/* Top Map Control Bar */}
      <div className="bg-[#14151B] text-[#FFFFFF] px-6 py-3 border-b border-[#22242D] flex flex-wrap items-center justify-between gap-4 z-20 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#CCFF00] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>03 — HOTSPOT INTELLIGENCE</span>
          </div>
          <h2 className="font-display text-lg font-bold tracking-tight flex items-center gap-2 text-[#FFFFFF]">
            <MapPin className="w-5 h-5 text-[#CCFF00]" />
            <span>{t.mapTitle}</span>
          </h2>
          <p className="text-xs text-[#9FA4B2] font-mono">{t.mapSubtitle}</p>
        </div>

        {/* Controls: Heatmap, Forecast, Time Slider */}
        <div className="flex items-center gap-3">
          {/* Time Horizon Slider Toggle */}
          <div className="flex items-center gap-1 bg-[#0B0C0E] p-1 rounded-full border border-[#22242D] text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#9FA4B2] ml-2" />
            <span className="text-[#9FA4B2] mr-1 hidden sm:inline">{t.timeSliderLabel}</span>
            <button
              onClick={() => setTimeHorizon('7d')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                timeHorizon === '7d' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
              }`}
            >
              {t.time7d}
            </button>
            <button
              onClick={() => setTimeHorizon('30d')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                timeHorizon === '30d' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
              }`}
            >
              {t.time30d}
            </button>
            <button
              onClick={() => setTimeHorizon('90d')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                timeHorizon === '90d' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2] hover:text-[#FFFFFF]'
              }`}
            >
              {t.time90d}
            </button>
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={toggleHeatmap}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              showHeatmap
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-400 shadow-glow-teal'
                : 'bg-[#0B0C0E] border-[#22242D] text-[#9FA4B2] hover:text-[#FFFFFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.heatmapToggle}</span>
          </button>

          {/* Forecast Layer Toggle */}
          <button
            onClick={toggleForecast}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
              showForecast
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-amber'
                : 'bg-[#0B0C0E] border-[#22242D] text-[#9FA4B2] hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{t.forecastToggle}</span>
          </button>
        </div>
      </div>

      {/* Main Map Body & Side Drilldown Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Leaflet Map Canvas */}
        <div className="flex-1 h-full z-10 bg-[#0B0C0E]">
          <MapContainer
            center={[12.9698, 77.6999]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            {/* Dark Tile Layer (CartoDB Dark Matter) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Confirmed Hotspot Circles */}
            {showHeatmap &&
              mockHotspots
                .filter((h) => h.type === 'confirmed')
                .map((hotspot) => (
                  <Circle
                    key={hotspot.zoneId}
                    center={[hotspot.lat, hotspot.lng]}
                    radius={hotspot.radius}
                    pathOptions={{
                      color: '#E53935',
                      fillColor: '#E53935',
                      fillOpacity: 0.25,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-2 space-y-1 font-sans text-xs">
                        <span className="font-bold text-rose-400 block">{hotspot.name}</span>
                        <p className="text-[#9FA4B2]">District: {hotspot.district}</p>
                        <p className="text-[#9FA4B2] font-mono">Density: {hotspot.density} incidents/km²</p>
                        <p className="font-semibold text-teal-400">Active Cases: {hotspot.activeCasesCount}</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}

            {/* PREDICTED RISING RISK ZONES */}
            {showForecast &&
              mockHotspots
                .filter((h) => h.type === 'predicted' && h.boundaryCoordinates)
                .map((hotspot) => (
                  <React.Fragment key={hotspot.zoneId}>
                    <Polygon
                      positions={hotspot.boundaryCoordinates!}
                      pathOptions={{
                        color: '#F5A623',
                        fillColor: '#FBBF24',
                        fillOpacity: 0.3,
                        dashArray: '8, 8',
                        weight: 3,
                      }}
                      eventHandlers={{
                        click: () => handleZoneClick(hotspot.name, hotspot.confidence),
                      }}
                    >
                      <Popup>
                        <div className="p-2 space-y-2 font-sans">
                          <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>PREDICTED RISING-RISK ZONE</span>
                          </div>
                          <span className="font-bold text-sm text-[#FFFFFF] block">{hotspot.name}</span>
                          <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 text-[11px]">
                            <span className="font-bold text-amber-400">AI Confidence: {hotspot.confidence}%</span>
                            <p className="text-[#9FA4B2] mt-0.5">Predicted 30-day spike in night break-ins.</p>
                          </div>
                          <button
                            onClick={() => handleZoneClick(hotspot.name, hotspot.confidence)}
                            className="w-full py-1.5 bg-amber-500 text-slate-950 text-[11px] font-bold rounded-lg font-mono hover:bg-amber-400"
                          >
                            View Explainability Reasoning →
                          </button>
                        </div>
                      </Popup>
                    </Polygon>
                  </React.Fragment>
                ))}

            {/* Individual FIR Incident Markers */}
            {mockFIRs.map((fir) => (
              <Marker
                key={fir.caseId}
                position={[fir.lat, fir.lng]}
                icon={createCustomMarkerIcon(fir.severity, fir.caseId)}
              >
                <Popup>
                  <div className="p-2 space-y-1.5 font-sans max-w-xs text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-teal-400">{fir.caseId}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        Risk {fir.riskScore}%
                      </span>
                    </div>
                    <span className="font-bold text-[#FFFFFF] block leading-tight">{fir.title}</span>
                    <p className="text-[#9FA4B2] leading-snug">{fir.summary.slice(0, 100)}...</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[#9FA4B2] font-mono text-[11px]">{fir.station}</span>
                      <button
                        onClick={() => {
                          setSelectedCaseId(fir.caseId);
                          setActiveView('search');
                        }}
                        className="text-teal-400 font-bold hover:underline"
                      >
                        Inspect Case →
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-6 left-6 z-20 bg-[#14151B]/95 backdrop-blur-md p-4 rounded-2xl border border-[#22242D] shadow-2xl space-y-2.5 text-xs">
            <span className="font-bold text-[#FFFFFF] block font-mono text-[11px] uppercase tracking-wider">
              CrimeLens Map Legend
            </span>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-[#0B0C0E]" />
              <span className="text-[#FFFFFF] font-medium">{t.mapLegendConfirmed}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded border-2 border-dashed border-amber-400 bg-amber-400/30" />
              <span className="text-[#FFFFFF] font-semibold">{t.mapLegendPredicted}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-teal-400 opacity-80" />
              <span className="text-[#9FA4B2]">{t.mapLegendLow}</span>
            </div>
          </div>
        </div>

        {/* Right Side Drilldown Panel */}
        <div className="w-80 bg-[#14151B] border-l border-[#22242D] h-full overflow-y-auto p-5 space-y-5 shadow-2xl z-20 shrink-0">
          <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
            <h3 className="font-display font-bold text-[#FFFFFF] text-sm">{t.stationDrilldown}</h3>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Bengaluru East
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-[#0B0C0E] p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hoodi ORR Forecast Zone
                </span>
                <span className="font-mono">88% Risk</span>
              </div>
              <p className="text-xs text-[#9FA4B2] leading-snug">
                Predicted surge in night-time warehouse break-ins. Recommending midnight mobile patrol allocation.
              </p>
              <button
                onClick={() => handleZoneClick("Hoodi ORR Corridor", 88)}
                className="mt-2 text-[11px] font-mono text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>View ST-DBSCAN Reasoning</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono font-bold text-[#9FA4B2] uppercase tracking-wider">Active Precinct FIRs</span>
              {mockFIRs.map((fir) => (
                <div
                  key={fir.caseId}
                  onClick={() => {
                    setSelectedCaseId(fir.caseId);
                    setActiveView('search');
                  }}
                  className="p-3.5 rounded-xl border border-[#22242D] bg-[#0B0C0E] hover:border-teal-500/50 hover:bg-[#1B1C24] cursor-pointer transition-all space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span className="text-teal-400">{fir.caseId}</span>
                    <span className="text-[10px] text-[#9FA4B2]">{fir.dateTime.split(' ')[0]}</span>
                  </div>
                  <p className="font-bold text-[#FFFFFF] truncate">{fir.title}</p>
                  <p className="text-[11px] text-[#9FA4B2] line-clamp-2">{fir.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
