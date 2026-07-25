import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar
    appTitle: "CrimeLens",
    appSubtitle: "AI Crime Intelligence Command Center",
    searchPlaceholder: "Search cases, suspects, vehicles, FIRs, locations...",
    liveBadge: "LIVE COMMAND",
    roleInvestigator: "Investigator",
    roleSupervisor: "Supervisor",
    roleAdmin: "Admin",
    roleLabel: "Role View:",
    langToggle: "ಕನ್ನಡ",

    // Sidebar Nav
    navOverview: "Command Overview",
    navMap: "Hotspot & Forecast Map",
    navNetwork: "Criminal Network Graph",
    navTimelines: "Case Timelines",
    navSearch: "Case Records & Search",
    navAudit: "Audit & Governance Log",
    navCopilot: "AI Investigation Workspace",

    // Overview KPIs & Widgets
    kpiActiveCases: "Active Cases",
    kpiHighRiskAreas: "High-Risk Zones",
    kpiOpenAlerts: "Open Alerts",
    kpiResolvedCases: "Resolved This Month",
    kpiAvgInvTime: "Avg Investigation Time",
    recentInsights: "Real-time AI Intelligence Feed",
    alertTickerTitle: "ALERT TICKER",
    viewReasoning: "View Reasoning",
    miniMapTitle: "Bengaluru Hotspot Distribution",
    miniGraphTitle: "Active Robbery Ring Graph",

    // Map View
    mapTitle: "Geospatial Intelligence & 30-Day Risk Forecast",
    mapSubtitle: "Density analysis & AI predictive spatio-temporal crime forecasting",
    mapLegendConfirmed: "Confirmed Hotspot Cluster",
    mapLegendPredicted: "Predicted Rising Risk Zone (30 Days)",
    mapLegendLow: "Low Activity Area",
    heatmapToggle: "Heatmap Overlay",
    forecastToggle: "30-Day Predictive Forecast Layer",
    timeSliderLabel: "Time Horizon:",
    time7d: "Last 7 Days",
    time30d: "Last 30 Days",
    time90d: "Last 90 Days",
    stationDrilldown: "Station / Zone Intelligence",

    // Network View
    networkTitle: "Criminal Entity Network Graph",
    networkSubtitle: "Interactive Multi-Entity Graph & Shortest Path Discovery",
    pathHighlightTitle: "Shortest Path Finder",
    selectSource: "Select Source Node...",
    selectTarget: "Select Target Node...",
    clearPath: "Clear Path",
    nodeDetails: "Entity Intelligence Profile",
    whyConnected: "Link Evidence & Reasoning",
    filterEntityPerson: "Persons",
    filterEntityCase: "Cases",
    filterEntityVehicle: "Vehicles",
    filterEntityLocation: "Locations",
    filterEntityOrg: "Organizations",
    filterEntityWeapon: "Weapons",
    solidEdgeLabel: "Direct Evidence",
    dashedEdgeLabel: "Inferred MO Pattern",

    // Timeline View
    timelineTitle: "Case Timelines & Temporal Correlation",
    timelineSubtitle: "Multi-case event sequencing and cross-case temporal overlap detection",
    compareCases: "Cross-Case Overlay Comparison",
    selectOverlayCase: "Add Case to Compare...",
    eventSource: "Source Record:",

    // Search View
    searchTitle: "Case Search & Records Repository",
    searchSubtitle: "Faceted exploration across FIRs, modus operandi, and risk profiles",
    filterCrimeType: "Crime Type",
    filterDistrict: "District",
    filterStatus: "Case Status",
    filterSeverity: "Severity Level",
    riskBadge: "Risk Score",

    // Audit View
    auditTitle: "Compliance & Governance Audit Trail",
    auditSubtitle: "Append-only, tamper-evident ledger of AI tool invocations and user queries",
    auditLockTag: "APPEND-ONLY COMPLIANCE LEDGER",
    colTimestamp: "Timestamp",
    colUser: "Officer / User",
    colRole: "Role",
    colQuery: "Query / Action",
    colTool: "Agent / Tool Invoked",
    colConfidence: "Confidence",
    colTouched: "Data Touched",
    investigatorNotice: "Showing personal activity log (Investigator View). Supervisors can access system-wide audit logs.",

    // AI Workspace
    copilotTitle: "AI Investigation Workspace",
    copilotSubtitle: "Secondary conversational assistant & data narrating engine",
    askAssistant: "Ask AI Copilot...",
    suggestedQueries: "Suggested Investigator Queries:",
    sourcesTitle: "Referenced Evidence & Case Records:",
    jumpToNetwork: "Open In Network Graph",
    jumpToMap: "Open In Map View",

    // Explainability Panel
    expTitle: "Governance & Explainability Trail",
    expConclusion: "AI Derived Conclusion",
    expConfidence: "Analytical Confidence Score",
    expReasoning: "Step-by-Step Reasoning Trail",
    expSources: "Underlying Data Sources & Records",
    expAgent: "Agent & Tool Attribution",

    // Common & Footer
    syntheticWatermark: "SYNTHETIC DEMO DATA — FOR OPERATIONAL DEMONSTRATION PURPOSES ONLY",
    close: "Close",
    loading: "Analyzing Intelligence Data...",
    noResults: "No matching records found.",
  },
  kn: {
    // Top Bar
    appTitle: "ಕ್ರೈಮ್‌ಲೆನ್ಸ್",
    appSubtitle: "ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ",
    searchPlaceholder: "ಪ್ರಕರಣಗಳು, ಶಂಕಿತರು, ವಾಹನಗಳು, ಎಫ್‌ಐಆರ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
    liveBadge: "ಲೈವ್ ಕಮಾಂಡ್",
    roleInvestigator: "ತನಿಖಾಧಿಕಾರಿ",
    roleSupervisor: "ಮೇಲ್ವಿಚಾರಕ",
    roleAdmin: "ಅಡ್ಮಿನ್",
    roleLabel: "ಪಾತ್ರ ನೋಟ:",
    langToggle: "English",

    // Sidebar Nav
    navOverview: "ಕಮಾಂಡ್ ಅವಲೋಕನ",
    navMap: "ಹಾಟ್‌ಸ್ಪಾಟ್ ಮತ್ತು ಮುನ್ಸೂಚನೆ ನಕ್ಷೆ",
    navNetwork: "ಅಪರಾಧ ಜಾಲದ ಗ್ರಾಫ್",
    navTimelines: "ಪ್ರಕರಣದ ಕಾಲಕ್ರಮಗಳು",
    navSearch: "ಪ್ರಕರಣದ ದಾಖಲೆಗಳು ಮತ್ತು ಹುಡುಕಾಟ",
    navAudit: "ಆಡಿಟ್ ಮತ್ತು ಆಡಳಿತ ಲಾಗ್",
    navCopilot: "ಎಐ ತನಿಖಾ ಸ್ಥಳ",

    // Overview KPIs & Widgets
    kpiActiveCases: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
    kpiHighRiskAreas: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ವಲಯಗಳು",
    kpiOpenAlerts: "ತೆರೆದ ಎಚ್ಚರಿಕೆಗಳು",
    kpiResolvedCases: "ಈ ತಿಂಗಳು ಪರಿಹರಿಸಲಾಗಿದೆ",
    kpiAvgInvTime: "ಸರಾಸರಿ ತನಿಖಾ ಸಮಯ",
    recentInsights: "ನೈಜ-ಸಮಯದ ಎಐ ಇಂಟೆಲಿಜೆನ್ಸ್ ಫೀಡ್",
    alertTickerTitle: "ಎಚ್ಚರಿಕೆ ಪಟ್ಟಿ",
    viewReasoning: "ಕಾರಣವನ್ನು ವೀಕ್ಷಿಸಿ",
    miniMapTitle: "ಬೆಂಗಳೂರು ಹಾಟ್‌ಸ್ಪಾಟ್ ಹಂಚಿಕೆ",
    miniGraphTitle: "ಸಕ್ರಿಯ ದರೋಡೆ ಜಾಲ",

    // Map View
    mapTitle: "ಭೌಗೋಳಿಕ ಗುಪ್ತಚರ ಮತ್ತು 30-ದಿನಗಳ ಅಪಾಯದ ಮುನ್ಸೂಚನೆ",
    mapSubtitle: "ಸಾಂದ್ರತೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಎಐ ಮುನ್ಸೂಚಕ ಅಪರಾಧ ಅಂದಾಜು",
    mapLegendConfirmed: "ದೃಢೀಕರಿಸಿದ ಹಾಟ್‌ಸ್ಪಾಟ್",
    mapLegendPredicted: "ಮುನ್ಸೂಚಿಸಿದ ಉದಯೋನ್ಮುಖ ಅಪಾಯದ ವಲಯ",
    mapLegendLow: "ಕಡಿಮೆ ಚಟುವಟಿಕೆಯ ಪ್ರದೇಶ",
    heatmapToggle: "ಹೀಟ್‌ಮ್ಯಾಪ್ ಓವರ್‌ಲೇ",
    forecastToggle: "30-ದಿನಗಳ ಮುನ್ಸೂಚನೆ ಪದರ",
    timeSliderLabel: "ಸಮಯದ ವ್ಯಾಪ್ತಿ:",
    time7d: "ಕೊನೆಯ 7 ದಿನಗಳು",
    time30d: "ಕೊನೆಯ 30 ದಿನಗಳು",
    time90d: "ಕೊನೆಯ 90 ದಿನಗಳು",
    stationDrilldown: "ಠಾಣೆ / ವಲಯ ಗುಪ್ತಚರ",

    // Network View
    networkTitle: "ಅಪರಾಧ ಘಟಕ ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್",
    networkSubtitle: "ಇಂಟರಾಕ್ಟಿವ್ ಮಲ್ಟಿ-ಎಂಟಿಟಿ ಗ್ರಾಫ್ ಮತ್ತು ಕನಿಷ್ಠ ಹಾದಿಯ ಶೋಧನೆ",
    pathHighlightTitle: "ಕನಿಷ್ಠ ಹಾದಿ ಶೋಧಕ",
    selectSource: "ಮೂಲ ನೋಡ್ ಆಯ್ಕೆಮಾಡಿ...",
    selectTarget: "ಗುರಿ ನೋಡ್ ಆಯ್ಕೆಮಾಡಿ...",
    clearPath: "ಹಾದಿಯನ್ನು ತೆರವುಗೊಳಿಸಿ",
    nodeDetails: "ಘಟಕ ಗುಪ್ತಚರ ವಿವರ",
    whyConnected: "ಲಿಂಕ್ ಸಾಕ್ಷಿ ಮತ್ತು ತರ್ಕ",
    filterEntityPerson: "ವ್ಯಕ್ತಿಗಳು",
    filterEntityCase: "ಪ್ರಕರಣಗಳು",
    filterEntityVehicle: "ವಾಹನಗಳು",
    filterEntityLocation: "ಸ್ಥಳಗಳು",
    filterEntityOrg: "ಸಂಸ್ಥೆಗಳು",
    filterEntityWeapon: "ಆಯುಧಗಳು",
    solidEdgeLabel: "ನೇರ ಸಾಕ್ಷ್ಯ",
    dashedEdgeLabel: "ಅನುಮಾನಾಸ್ಪದ ಎಂಒ ಮಾದರಿ",

    // Timeline View
    timelineTitle: "ಪ್ರಕರಣದ ಕಾಲಕ್ರಮಗಳು ಮತ್ತು ಸಮಯದ ಸಂಬಂಧ",
    timelineSubtitle: "ಬಹು-ಪ್ರಕರಣ ಘಟನೆಗಳ ಅನುಕ್ರಮ ಮತ್ತು ಸಮಯದ ಅತಿಕ್ರಮಣ ಪತ್ತೆ",
    compareCases: "ಪ್ರಕರಣಗಳ ಹೋಲಿಕೆ",
    selectOverlayCase: "ಹೋಲಿಸಲು ಪ್ರಕರಣ ಸೇರಿಸಿ...",
    eventSource: "ಮೂಲ ದಾಖಲೆ:",

    // Search View
    searchTitle: "ಪ್ರಕರಣ ಶೋಧನೆ ಮತ್ತು ದಾಖಲೆಗಳ ಉಗ್ರಾಣ",
    searchSubtitle: "ಎಫ್‌ಐಆರ್‌ಗಳು, ಅಪರಾಧ ಶೈಲಿ ಮತ್ತು ಅಪಾಯದ ಪ್ರೊಫೈಲ್‌ಗಳ ಹುಡುಕಾಟ",
    filterCrimeType: "ಅಪರಾಧದ ಪ್ರಕಾರ",
    filterDistrict: "ಜಿಲ್ಲೆ",
    filterStatus: "ಪ್ರಕರಣದ ಸ್ಥಿತಿ",
    filterSeverity: "ಗಂಭೀರತೆಯ ಮಟ್ಟ",
    riskBadge: "ಅಪಾಯದ ಅಂಕ",

    // Audit View
    auditTitle: "ಅನುಸರಣೆ ಮತ್ತು ಆಡಳಿತ ಆಡಿಟ್ ಲಾಗ್",
    auditSubtitle: "ಎಐ ಉಪಕರಣಗಳ ಬಳಕೆ ಮತ್ತು ಬಳಕೆದಾರರ ವಿನಂತಿಗಳ ಸುರಕ್ಷಿತ ಲಾಗ್",
    auditLockTag: "ಬದಲಾಯಿಸಲಾಗದ ಆಡಿಟ್ ಲೆಡ್ಜರ್",
    colTimestamp: "ಸಮಯ ಮುದ್ರೆ",
    colUser: "ಅಧಿಕಾರಿ / ಬಳಕೆದಾರ",
    colRole: "ಪಾತ್ರ",
    colQuery: "ಪ್ರಶ್ನೆ / ಕ್ರಿಯೆ",
    colTool: "ಸಾಧನ / ಏಜೆಂಟ್",
    colConfidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
    colTouched: "ಬಳಸಿದ ಡೇಟಾ",
    investigatorNotice: "ವೈಯಕ್ತಿಕ ಚಟುವಟಿಕೆ ಲಾಗ್ ತೋರಿಸಲಾಗುತ್ತಿದೆ (ತನಿಖಾಧಿಕಾರಿ ನೋಟ).",

    // AI Workspace
    copilotTitle: "ಎಐ ತನಿಖಾ ಸ್ಥಳ",
    copilotSubtitle: "ಸಹಾಯಕರಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಎಐ ಎಂಜಿನ್",
    askAssistant: "ಎಐ ಕೊಪೈಲಟ್ ಅನ್ನು ಕೇಳಿ...",
    suggestedQueries: "ಸೂಚಿಸಲಾದ ತನಿಖಾ ಪ್ರಶ್ನೆಗಳು:",
    sourcesTitle: "ಉಲ್ಲೇಖಿಸಿದ ಸಾಕ್ಷಿ ಮತ್ತು ಪ್ರಕರಣಗಳು:",
    jumpToNetwork: "ನೆಟ್‌ವರ್ಕ್ ಗ್ರಾಫ್‌ನಲ್ಲಿ ನೋಡಿ",
    jumpToMap: "ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ",

    // Explainability Panel
    expTitle: "ಆಡಳಿತ ಮತ್ತು ವಿವರಣಾತ್ಮಕ ಹಾದಿ",
    expConclusion: "ಎಐ ನೀಡಿದ ತೀರ್ಮಾನ",
    expConfidence: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವಿಶ್ವಾಸಾರ್ಹತೆ ಅಂಕ",
    expReasoning: "ಹಂತ-ಹಂತದ ತರ್ಕದ ಹಾದಿ",
    expSources: "ಮೂಲ ಡೇಟಾ ಮತ್ತು ದಾಖಲೆಗಳು",
    expAgent: "ಏಜೆಂಟ್ ಮತ್ತು ಉಪಕರಣದ ಕೊಡುಗೆ",

    // Common & Footer
    syntheticWatermark: "ಸಿಂಥೆಟಿಕ್ ಡೆಮೊ ಡೇಟಾ — ಕಾರ್ಯಾಚರಣೆಯ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ",
    close: "ಮುಚ್ಚಿ",
    loading: "ಡೇಟಾ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    noResults: "ಯಾವುದೇ ಸೂಕ್ತ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
  }
};
