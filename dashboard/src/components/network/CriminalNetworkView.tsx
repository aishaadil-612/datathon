import React, { useState, useMemo } from 'react';
import {
  GitFork,
  User,
  FileText,
  Car,
  MapPin,
  Shield,
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { translations } from '../../i18n/translations';
import { mockEntities } from '../../mock/entities';
import { mockRelationships } from '../../mock/relationships';
import { EntityType, GraphRelationship } from '../../types';

export const CriminalNetworkView: React.FC = () => {
  const {
    pathHighlight,
    setPathSource,
    setPathTarget,
    clearPathHighlight,
    language,
    openExplainability
  } = useDashboardStore();

  const t = translations[language];
  const [selectedEntityId, setSelectedEntityId] = useState<string>('p1');
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | 'all'>('all');
  const [minConfidence, setMinConfidence] = useState<number>(50);

  const selectedEntity = useMemo(
    () => mockEntities.find((e) => e.id === selectedEntityId) || mockEntities[0],
    [selectedEntityId]
  );

  const filteredEntities = useMemo(() => {
    if (entityTypeFilter === 'all') return mockEntities;
    return mockEntities.filter((e) => e.type === entityTypeFilter);
  }, [entityTypeFilter]);

  const highlightedPathNodeIds = useMemo(() => {
    const { sourceId, targetId, isHighlightActive } = pathHighlight;
    if (!isHighlightActive || !sourceId || !targetId) return new Set<string>();

    const queue: Array<{ node: string; path: string[] }> = [{ node: sourceId, path: [sourceId] }];
    const visited = new Set<string>([sourceId]);

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      if (node === targetId) {
        return new Set(path);
      }

      const neighborEdges = mockRelationships.filter((r) => r.source === node || r.target === node);
      for (const edge of neighborEdges) {
        const neighbor = edge.source === node ? edge.target : edge.source;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return new Set<string>([sourceId, targetId]);
  }, [pathHighlight]);

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'person': return { bg: 'bg-indigo-500/20 text-indigo-400', border: 'border-indigo-500/40', badge: 'bg-indigo-500/20 text-indigo-300' };
      case 'case': return { bg: 'bg-teal-500/20 text-teal-400', border: 'border-teal-500/40', badge: 'bg-teal-500/20 text-teal-300' };
      case 'vehicle': return { bg: 'bg-amber-500/20 text-amber-400', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' };
      case 'location': return { bg: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300' };
      case 'organization': return { bg: 'bg-purple-500/20 text-purple-400', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300' };
      case 'weapon': return { bg: 'bg-rose-500/20 text-rose-400', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300' };
    }
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'person': return <User className="w-4 h-4" />;
      case 'case': return <FileText className="w-4 h-4" />;
      case 'vehicle': return <Car className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'organization': return <Shield className="w-4 h-4" />;
      case 'weapon': return <Zap className="w-4 h-4" />;
    }
  };

  const handleExplainLink = (rel: GraphRelationship) => {
    openExplainability({
      conclusion: rel.description || `Inferred link between ${rel.source} and ${rel.target} with ${rel.confidence}% confidence.`,
      confidence: rel.confidence,
      reasoningSteps: [
        "1. Queried Neo4j transactional graph database for edge relationship property.",
        "2. Cross-referenced ANPR snapshot timestamp and cell tower dump.",
        "3. Evaluated edge weight: Evidenced = " + (rel.evidenced ? "True (Direct Evidence)" : "False (Inferred MO)"),
        "4. Output confidence score verified by Case Intelligence Agent."
      ],
      evidenceSources: [
        { id: rel.source, label: rel.source, type: "Graph Entity" },
        { id: rel.target, label: rel.target, type: "Graph Entity" }
      ],
      agentAttribution: {
        name: "Case Intelligence Agent",
        type: "NL2Cypher + Neo4j Graph Traversal",
        version: "v3.2",
        latencyMs: 310
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden select-none">
      {/* Top Header & Filter Bar */}
      <div className="bg-[#14151B] text-[#FFFFFF] px-6 py-3 border-b border-[#22242D] flex flex-wrap items-center justify-between gap-4 z-20 shadow-md">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight flex items-center gap-2 text-[#FFFFFF]">
            <GitFork className="w-5 h-5 text-teal-400" />
            <span>{t.networkTitle}</span>
          </h2>
          <p className="text-xs text-[#9FA4B2] font-mono">{t.networkSubtitle}</p>
        </div>

        {/* Filters: Entity Type & Confidence Slider */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0B0C0E] p-1 rounded-full border border-[#22242D] text-xs font-mono">
            <span className="text-[#9FA4B2] px-2">Type:</span>
            <button
              onClick={() => setEntityTypeFilter('all')}
              className={`px-2.5 py-1 rounded-full transition-colors ${entityTypeFilter === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2]'}`}
            >
              All
            </button>
            <button
              onClick={() => setEntityTypeFilter('person')}
              className={`px-2.5 py-1 rounded-full transition-colors ${entityTypeFilter === 'person' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2]'}`}
            >
              {t.filterEntityPerson}
            </button>
            <button
              onClick={() => setEntityTypeFilter('case')}
              className={`px-2.5 py-1 rounded-full transition-colors ${entityTypeFilter === 'case' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2]'}`}
            >
              {t.filterEntityCase}
            </button>
            <button
              onClick={() => setEntityTypeFilter('vehicle')}
              className={`px-2.5 py-1 rounded-full transition-colors ${entityTypeFilter === 'vehicle' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-[#9FA4B2]'}`}
            >
              {t.filterEntityVehicle}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9FA4B2] bg-[#0B0C0E] px-3.5 py-1.5 rounded-full border border-[#22242D]">
            <span>Min Confidence:</span>
            <input
              type="range"
              min="50"
              max="95"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-20 accent-teal-400 cursor-pointer"
            />
            <span className="font-bold text-teal-400 w-8">{minConfidence}%</span>
          </div>
        </div>
      </div>

      {/* Main Graph Workbench & Controls */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas / Graph Display Workspace */}
        <div className="flex-1 bg-[#0B0C0E] p-6 relative flex flex-col justify-between overflow-hidden">
          {/* Path Highlight Control Box */}
          <div className="absolute top-4 left-4 z-20 bg-[#14151B]/95 backdrop-blur-md border border-[#22242D] p-4 rounded-[20px] shadow-2xl text-xs space-y-3 w-80">
            <div className="flex items-center justify-between border-b border-[#22242D] pb-2">
              <span className="font-display font-bold text-[#FFFFFF] flex items-center gap-1.5 font-mono">
                <GitFork className="w-4 h-4 text-teal-400" />
                {t.pathHighlightTitle}
              </span>
              {pathHighlight.isHighlightActive && (
                <button
                  onClick={clearPathHighlight}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.clearPath}</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-[#9FA4B2] font-mono block mb-1">Source Entity</label>
                <select
                  value={pathHighlight.sourceId || ''}
                  onChange={(e) => setPathSource(e.target.value || null)}
                  className="w-full bg-[#0B0C0E] border border-[#22242D] text-[#FFFFFF] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="">{t.selectSource}</option>
                  {mockEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.label} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9FA4B2] font-mono block mb-1">Target Entity</label>
                <select
                  value={pathHighlight.targetId || ''}
                  onChange={(e) => setPathTarget(e.target.value || null)}
                  className="w-full bg-[#0B0C0E] border border-[#22242D] text-[#FFFFFF] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="">{t.selectTarget}</option>
                  {mockEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.label} ({e.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {pathHighlight.isHighlightActive && (
              <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl text-teal-300 text-[11px] font-mono space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-teal-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Shortest Path Highlighted</span>
                </div>
                <p className="text-[10px] text-[#9FA4B2]">
                  {highlightedPathNodeIds.size} connected nodes highlighted in chain.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Graph Node Grid / Canvas Representation */}
          <div className="flex-1 relative flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full z-10">
              {filteredEntities.map((entity) => {
                const colors = getNodeColor(entity.type);
                const isSelected = selectedEntityId === entity.id;
                const isHighlightedInPath =
                  pathHighlight.isHighlightActive && highlightedPathNodeIds.has(entity.id);
                const isDimmed =
                  pathHighlight.isHighlightActive && !highlightedPathNodeIds.has(entity.id);

                return (
                  <div
                    key={entity.id}
                    onClick={() => setSelectedEntityId(entity.id)}
                    className={`p-4 rounded-[20px] border transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#14151B] border-teal-400 shadow-glow-teal scale-105 z-20'
                        : isHighlightedInPath
                        ? 'bg-[#14151B] border-amber-400 shadow-glow-amber scale-105 z-20'
                        : isDimmed
                        ? 'bg-[#14151B]/30 border-[#22242D] opacity-30 hover:opacity-100'
                        : 'bg-[#14151B] border-[#22242D] hover:border-teal-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${colors.bg} shadow-md`}>
                        {getEntityIcon(entity.type)}
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {entity.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 space-y-0.5">
                      <h4 className="font-display font-bold text-[#FFFFFF] text-sm">{entity.label}</h4>
                      {entity.sublabel && (
                        <p className="text-[11px] text-[#9FA4B2] truncate font-mono">{entity.sublabel}</p>
                      )}
                    </div>

                    {isHighlightedInPath && (
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                        PATH NODE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graph Edge Type Legend */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#9FA4B2] border-t border-[#22242D] pt-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-teal-400 inline-block" />
                <span>{t.solidEdgeLabel} (Direct)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 border-b border-dashed border-amber-400 inline-block" />
                <span>{t.dashedEdgeLabel} (MO Inferred)</span>
              </div>
            </div>
            <span>Neo4j Graph Database Connected</span>
          </div>
        </div>

        {/* Right Entity Details Side Panel */}
        <div className="w-80 bg-[#14151B] border-l border-[#22242D] h-full overflow-y-auto p-5 space-y-5 shadow-2xl z-20 shrink-0">
          <div className="flex items-center justify-between border-b border-[#22242D] pb-3">
            <h3 className="font-display font-bold text-[#FFFFFF] text-sm">{t.nodeDetails}</h3>
            <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              ID: {selectedEntity.id}
            </span>
          </div>

          {/* Entity Profile Header */}
          <div className="p-4 rounded-[20px] bg-[#0B0C0E] border border-[#22242D] text-[#FFFFFF] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 uppercase font-bold">
                {selectedEntity.type}
              </span>
              {selectedEntity.riskLevel && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedEntity.riskLevel.toUpperCase()} RISK
                </span>
              )}
            </div>
            <h4 className="text-base font-display font-bold">{selectedEntity.label}</h4>
            {selectedEntity.sublabel && (
              <p className="text-xs text-[#9FA4B2] font-mono">{selectedEntity.sublabel}</p>
            )}
          </div>

          {/* Entity Key Attributes */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#9FA4B2] uppercase tracking-wider">Key Attributes</span>
            <div className="bg-[#0B0C0E] p-3.5 rounded-xl border border-[#22242D] space-y-2 text-xs">
              {Object.entries(selectedEntity.attributes).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between border-b border-[#22242D]/60 pb-1">
                  <span className="text-[#9FA4B2] font-mono capitalize">{key}:</span>
                  <span className="font-semibold text-[#FFFFFF]">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Graph Relationships List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold text-[#9FA4B2] uppercase tracking-wider">
              Connected Graph Links
            </span>
            <div className="space-y-2.5">
              {mockRelationships
                .filter((r) => r.source === selectedEntity.id || r.target === selectedEntity.id)
                .map((rel) => (
                  <div
                    key={rel.id}
                    className="p-3.5 rounded-xl border border-[#22242D] bg-[#0B0C0E] hover:border-teal-500/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-teal-400 capitalize">{rel.type.replace('_', ' ')}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rel.evidenced ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {rel.confidence}% ({rel.evidenced ? 'Direct' : 'MO Pattern'})
                      </span>
                    </div>

                    <p className="text-[11px] text-[#9FA4B2] leading-snug">{rel.description}</p>

                    <button
                      onClick={() => handleExplainLink(rel)}
                      className="w-full text-left text-[11px] font-mono font-semibold text-teal-400 hover:underline flex items-center justify-between pt-1 border-t border-[#22242D]"
                    >
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t.whyConnected}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
