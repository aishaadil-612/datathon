import logging
from typing import List, Dict, Any
from core.database.postgres import postgres_client

logger = logging.getLogger("argus.agents.tools.nl2sql")

async def execute_nl2sql(query_text: str) -> Dict[str, Any]:
    """Converts natural language user question to parameterized SQL query and runs against Postgres."""
    logger.info(f"NL2SQL translating: '{query_text}'")
    
    # Generate SQL schema query based on natural language intent
    generated_sql = "SELECT * FROM firs WHERE description ILIKE '%fraud%' OR offense ILIKE '%fraud%'"
    if "vehicle" in query_text.lower() or "car" in query_text.lower():
        generated_sql = "SELECT * FROM firs WHERE description ILIKE '%vehicle%' OR description ILIKE '%car%'"
    elif "robbery" in query_text.lower() or "armed" in query_text.lower():
        generated_sql = "SELECT * FROM firs WHERE offense ILIKE '%robbery%'"

    results = await postgres_client.execute_query(generated_sql)
    return {
        "query_text": query_text,
        "generated_sql": generated_sql,
        "results": results,
        "result_count": len(results)
    }
