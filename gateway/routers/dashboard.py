from typing import Dict, Any
from core.database.postgres import postgres_client
from core.database.neo4j import neo4j_client
from agents.analytics.tools.hotspot_detector import execute_hotspot_detector
from agents.case_intel.tools.timeline_builder import execute_timeline_builder

async def get_dashboard_summary() -> Dict[str, Any]:
    firs = await postgres_client.execute_query("SELECT * FROM firs")
    graph = await neo4j_client.execute_cypher("MATCH (n) RETURN n")
    hotspots = await execute_hotspot_detector()
    timeline = await execute_timeline_builder("FIR-2026-001")
    audit_logs = await postgres_client.execute_query("SELECT * FROM audit_logs")

    return {
        "status": "active",
        "system_health": "OPTIMAL",
        "metrics": {
            "total_firs": len(firs),
            "active_hotspots": len(hotspots["hotspots"]),
            "graph_nodes": len(graph["nodes"]),
            "graph_relationships": len(graph["relationships"]),
            "total_audit_events": len(audit_logs)
        },
        "hotspots": hotspots["hotspots"],
        "graph_data": {
            "nodes": graph["nodes"],
            "edges": graph["relationships"]
        },
        "case_timeline": timeline["timeline_events"],
        "recent_firs": firs
    }
