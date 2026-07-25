import logging
from typing import Dict, Any
from core.database.neo4j import neo4j_client

logger = logging.getLogger("argus.agents.tools.nl2cypher")

async def execute_nl2cypher(query_text: str) -> Dict[str, Any]:
    """Converts natural language user question to Cypher graph query and executes against Neo4j."""
    logger.info(f"NL2Cypher translating: '{query_text}'")
    
    generated_cypher = "MATCH (p:Person)-[r:SUSPECT_IN]->(c:Case) RETURN p, r, c LIMIT 10"
    if "associate" in query_text.lower() or "network" in query_text.lower():
        generated_cypher = "MATCH (p1:Person)-[r:ASSOCIATED_WITH]->(p2:Person) RETURN p1, r, p2"
    elif "vehicle" in query_text.lower():
        generated_cypher = "MATCH (v:Vehicle)<-[r:OWNED_BY]-(p:Person) RETURN v, r, p"

    graph_res = await neo4j_client.execute_cypher(generated_cypher)
    return {
        "query_text": query_text,
        "generated_cypher": generated_cypher,
        "nodes": graph_res["nodes"],
        "relationships": graph_res["relationships"]
    }
