from governance.rbac import rbac_engine, Role

def test_rbac_investigator_permissions():
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "query_router") is True
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "case_intel") is True
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "analytics") is True
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "mo_feature_vector") is True
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "audit_query") is False
    assert rbac_engine.check_permission(Role.INVESTIGATOR, "manage_users") is False

def test_rbac_supervisor_permissions():
    assert rbac_engine.check_permission(Role.SUPERVISOR, "query_router") is True
    assert rbac_engine.check_permission(Role.SUPERVISOR, "case_intel") is True
    assert rbac_engine.check_permission(Role.SUPERVISOR, "analytics") is True
    assert rbac_engine.check_permission(Role.SUPERVISOR, "audit_query") is True
    assert rbac_engine.check_permission(Role.SUPERVISOR, "manage_users") is False

def test_rbac_admin_permissions():
    assert rbac_engine.check_permission(Role.ADMIN, "query_router") is True
    assert rbac_engine.check_permission(Role.ADMIN, "audit_query") is True
    assert rbac_engine.check_permission(Role.ADMIN, "manage_users") is True
    assert rbac_engine.check_permission(Role.ADMIN, "system_config") is True
