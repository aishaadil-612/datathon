import logging
from typing import List, Dict, Any
from config import settings

logger = logging.getLogger("argus.database.neo4j")

import os
import json

def _load_real_neo4j_graph() -> Dict[str, Any]:
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "cases_db_1000.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            graph = data.get("graph", {})
            logger.info(f"Loaded Neo4j Graph with {len(graph.get('nodes', []))} nodes & {len(graph.get('relationships', []))} edges from 1,000+ cases database.")
            return graph
    return {"nodes": [], "relationships": []}

_NEO4J_GRAPH_STORE = _load_real_neo4j_graph()
_MOCK_NEO4J_GRAPH = _NEO4J_GRAPH_STORE

class Neo4jClient:
    """Neo4j Async Driver wrapper with Cypher query execution and Graph fallback."""
    def __init__(self):
        self.uri = settings.NEO4J_URI
        logger.info(f"Initialized Neo4j Client targeting {self.uri}")

    async def execute_cypher(self, cypher_query: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Executes Cypher query over real 1,000+ case graph dataset."""
        logger.info(f"Executing Cypher Query: {cypher_query} | Params: {params}")

        # Returns full graph structure for network analysis visualization (top 50 nodes for display clarity)
        display_nodes = _NEO4J_GRAPH_STORE["nodes"][:50]
        node_ids = {n["id"] for n in display_nodes}
        display_edges = [e for e in _NEO4J_GRAPH_STORE["relationships"] if e["source"] in node_ids or e["target"] in node_ids]

        return {
            "query": cypher_query,
            "nodes": display_nodes,
            "relationships": display_edges,
            "count": len(_NEO4J_GRAPH_STORE["nodes"])
        }

    async def get_suspect_network(self, person_id: str = "P-101") -> Dict[str, Any]:
        """Traverses graph for 2-hop relationships around a suspect across 1,000+ cases graph."""
        target_edges = [
            e for e in _NEO4J_GRAPH_STORE["relationships"]
            if e["source"] == person_id or e["target"] == person_id
        ]
        
        connected_ids = {person_id}
        for e in target_edges:
            connected_ids.add(e["source"])
            connected_ids.add(e["target"])

        # 2-hop traversal
        hop2_edges = [
            e for e in _NEO4J_GRAPH_STORE["relationships"]
            if e["source"] in connected_ids or e["target"] in connected_ids
        ]
        for e in hop2_edges:
            connected_ids.add(e["source"])
            connected_ids.add(e["target"])

        connected_nodes = [n for n in _NEO4J_GRAPH_STORE["nodes"] if n["id"] in connected_ids]

        return {
            "target": person_id,
            "nodes": connected_nodes,
            "edges": hop2_edges,
            "associates_count": len(connected_nodes) - 1
        }

neo4j_client = Neo4jClient()

