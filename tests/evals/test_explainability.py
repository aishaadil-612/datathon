from governance.explainability import explainability_engine

def test_explainability_hotspot_attributions():
    exp = explainability_engine.generate_explanation(
        tool_name="hotspot_detector",
        input_params={"region": "Bengaluru Urban"},
        output_data={}
    )
    assert exp["tool"] == "hotspot_detector"
    assert exp["explainability_method"] == "SHAP_LIME_HYBRID"
    assert "spatial_proximity_meters" in exp["feature_attributions"]
    assert exp["feature_attributions"]["spatial_proximity_meters"] == 0.42

def test_explainability_risk_scorer_attributions():
    exp = explainability_engine.generate_explanation(
        tool_name="risk_scorer",
        input_params={"location_or_suspect": "Central District"},
        output_data={}
    )
    assert "repeat_offense_history" in exp["feature_attributions"]
    assert len(exp["natural_language_rationale"]) > 0
