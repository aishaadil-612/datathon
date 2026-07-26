from governance.rbac import rbac_engine, Role

def test_rbac_unrestricted_permissions():
    assert rbac_engine.check_permission("investigator", "query_router") is True
    assert rbac_engine.check_permission("investigator", "audit_query") is True
    assert rbac_engine.check_permission("investigator", "manage_users") is True

def test_rbac_any_role_permissions():
    assert rbac_engine.check_permission("any_user", "rag_search") is True
    assert rbac_engine.check_permission("anonymous", "system_config") is True
