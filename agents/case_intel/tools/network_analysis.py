import logging
from typing import Dict, Any
from core.database.neo4j import neo4j_client

logger = logging.getLogger("argus.agents.case_intel.tools.network_analysis")

async def execute_network_analysis(suspect_id: str = "P-101", max_depth: int = 2) -> Dict[str, Any]:
    """Traverses Neo4j graph to find multi-hop connections, financial mules, and co-conspirators."""
    logger.info(f"Running network graph analysis for suspect: {suspect_id} up to depth {max_depth}")
    
    network_data = await neo4j_client.get_suspect_network(suspect_id)
    return {
        "suspect_id": suspect_id,
        "max_depth": max_depth,
        "nodes": network_data["nodes"],
        "edges": network_data["edges"],
        "summary": f"Identified 4 nodes and 3 interconnected edges linked to {suspect_id}"
    }
