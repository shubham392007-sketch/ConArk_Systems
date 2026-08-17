"""
Gemini 2.5 Flash service orchestrator.
Provides structured report generation, SHA-256 caching, exponential backoff retries,
and robust fallback handling so API calls never fail if Gemini is offline or rate limited.
"""

import json
import hashlib
import asyncio
from typing import Dict, Any, Optional
from google.genai import types

from conark.config.settings import settings
from conark.gemini.client import GeminiClient
from conark.gemini.prompts import GEMINI_SYSTEM_PROMPT, format_gemini_input_prompt
from conark.gemini.schemas import GeminiConstructionReport, GeminiReportWrapper
from conark.utils.logging import get_logger

logger = get_logger("gemini_service")


class GeminiService:
    """Service layer for Gemini 2.5 Flash structured report generation."""

    def __init__(self):
        self.client_wrapper = GeminiClient()
        self._cache: Dict[str, GeminiConstructionReport] = {}

    def _compute_hash(self, payload: Dict[str, Any]) -> str:
        """Computes SHA-256 hash of payload for caching."""
        payload_str = json.dumps(payload, sort_keys=True)
        return hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

    def generate_fallback_report(self, ml_payload: Dict[str, Any], reason: str = "AI explanation temporarily unavailable.") -> GeminiReportWrapper:
        """Generates safe deterministic fallback report with deep model-specific breakdowns."""
        inputs = ml_payload.get("inputs", {})
        ml_results = ml_payload.get("ml_results", {})
        
        task_prog = inputs.get("task_progress", 0.42)
        worker_cnt = inputs.get("worker_count", 45)
        equip_util = inputs.get("equipment_utilization_rate", 91.2)
        safety_inc = inputs.get("safety_incidents", 1)
        vib_lvl = inputs.get("vibration_level", 28.4)
        mat_usage = inputs.get("material_usage", 680.0)
        energy = inputs.get("energy_consumption", 340.0)

        perf = ml_results.get("performance", {}).get("prediction", "Good")
        perf_conf = ml_results.get("performance", {}).get("confidence", 0.936) * 100
        
        risk_score = ml_results.get("risk", {}).get("risk_score", 50.0)
        risk_lvl = ml_results.get("risk", {}).get("risk_level", "Moderate")
        
        cost_status = ml_results.get("cost_forecast", {}).get("budget_status", "On Budget")
        cost_dev = ml_results.get("cost_forecast", {}).get("predicted_cost_deviation", 0.0)
        
        time_status = ml_results.get("time_forecast", {}).get("schedule_status", "On Schedule")
        time_dev = ml_results.get("time_forecast", {}).get("predicted_time_deviation_days", 0.0)
        
        opt_rec = ml_results.get("optimization", {}).get("recommendation", "Increase Machinery Efficiency")
        opt_conf = ml_results.get("optimization", {}).get("confidence", 0.882) * 100
        opt_factors = ml_results.get("optimization", {}).get("supporting_factors", [])
        alerts = ml_payload.get("alerts", [])

        crit_alerts = [f"{a.get('type')}: {a.get('title')}" for a in alerts if a.get("priority", 4) <= 2]

        cost_str = f"+${cost_dev:,.2f}" if cost_dev > 0 else f"-${abs(cost_dev):,.2f}"
        time_str = f"+{time_dev:.1f} days" if time_dev > 0 else f"{time_dev:.1f} days"

        # Build thorough multi-sentence explanations
        perf_exp = f"HistGradientBoosting model classifies overall site performance as '{perf}' with {perf_conf:.1f}% confidence. Root cause analysis shows task progress velocity ({task_prog}) and worker headcount ({worker_cnt}) maintain active workflow. Site Impact: Operational rhythm is stable, though high equipment utilization ({equip_util}%) requires preventative monitoring to avoid sudden bottlenecks. Recommended Action: Maintain current workforce allocation while conducting scheduled maintenance checks."
        
        risk_exp = f"LinearRegression model evaluates operational risk at {risk_score:.1f}% ({risk_lvl}). Root cause analysis identifies safety incidents ({safety_inc}) and machinery vibration telemetry ({vib_lvl} mm/s) as primary risk vectors. Site Impact: Elevated vibration levels increase structural fatigue probability and worker safety compliance risk. Recommended Action: Conduct immediate equipment vibration inspection, enforce mandatory safety clearances, and rebalance high-risk worker activities."
        
        cost_exp = f"XGBRegressor model forecasts a cost deviation of {cost_str} ({cost_status}). Root cause analysis indicates material usage ({mat_usage} kg) and energy consumption ({energy} kWh) exceed standard baseline allocation. Site Impact: Unplanned material consumption threatens project budget margin across the current phase. Recommended Action: Audit material dispatch logs, optimize heavy machinery run-times, and review overtime labor costs."
        
        time_exp = f"HistGradientBoosting Regressor forecasts a schedule deviation of {time_str} ({time_status}). Root cause analysis shows task progress velocity ({task_prog}) and equipment utilization ({equip_util}%) dictate timeline variance. Site Impact: A schedule variance of {time_str} impacts downstream trade handovers and site delivery logistics. Recommended Action: Adjust phase milestone targets, prioritize critical path structural tasks, and streamline material loading dock throughput."
        
        opt_exp = f"HistGradientBoosting Classifier recommends operational action '{opt_rec}' ({opt_conf:.1f}% confidence). Root cause analysis combines multi-model risk ({risk_score:.1f}%) and equipment pressure ({equip_util}%). Site Impact: Imbalanced worker-to-equipment ratios create workflow bottlenecks and reduce operational yield. Recommended Action: Execute resource reallocation by shifting workers to lagging structural tasks and optimizing machinery cycle times."

        exec_summary = f"Project performance is classified as {perf} with an operational risk score of {risk_score:.1f}% ({risk_lvl}). Cost forecast indicates a deviation of {cost_str} ({cost_status}) and schedule forecast indicates {time_str} ({time_status}). Recommended optimization action: {opt_rec}."

        fallback = GeminiConstructionReport(
            overall_status=f"Status: {perf} | Risk: {risk_lvl}",
            executive_summary=exec_summary,
            key_findings=[
                f"Performance Classification: {perf} ({perf_conf:.1f}% confidence)",
                f"Operational Risk Score: {risk_score:.1f}% ({risk_lvl})",
                f"Schedule Deviation: {time_str} ({time_status})",
                f"Cost Forecast Deviation: {cost_str} ({cost_status})"
            ],
            critical_alerts=crit_alerts if crit_alerts else ["No critical alerts detected."],
            risk_explanation=risk_exp,
            performance_explanation=perf_exp,
            cost_explanation=cost_exp,
            schedule_explanation=time_exp,
            optimization_explanation=opt_exp,
            recommended_actions=[opt_rec] + ([f"Review alert: {crit_alerts[0]}"] if crit_alerts else ["Review worker allocation before next cycle"]),
            priority=risk_lvl if risk_lvl in ["High", "Critical"] else "Medium",
            confidence_note="Report generated using rules engine."
        )

        return GeminiReportWrapper(
            status="fallback",
            message=reason,
            report=fallback
        )

    async def generate_construction_report(self, intelligence_payload: Dict[str, Any]) -> GeminiReportWrapper:
        """
        Generates structured construction report using Gemini 2.5 Flash.
        Applies request caching, retries, timeout, and safe fallback.
        """
        cache_key = self._compute_hash(intelligence_payload)
        if cache_key in self._cache:
            logger.info("Returning cached Gemini report.")
            return GeminiReportWrapper(
                status="success",
                message="Retrieved from response cache",
                report=self._cache[cache_key]
            )

        if not self.client_wrapper.is_available():
            logger.info("Gemini API key not configured. Returning safe fallback report.")
            return self.generate_fallback_report(intelligence_payload, reason="GEMINI_API_KEY is not configured.")

        prompt = format_gemini_input_prompt(intelligence_payload)
        max_retries = settings.GEMINI_MAX_RETRIES
        timeout = settings.GEMINI_TIMEOUT_SECONDS

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"Calling Gemini 2.5 Flash (Attempt {attempt}/{max_retries})...")
                
                loop = asyncio.get_event_loop()
                def _call_gemini():
                    model_target = intelligence_payload.get("target_model") or "performance"
                    client_wrapper = GeminiClient.for_model(model_target)
                    client = client_wrapper.client
                    response = client.models.generate_content(
                        model=client_wrapper.model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=GEMINI_SYSTEM_PROMPT,
                            response_mime_type="application/json",
                            response_schema=GeminiConstructionReport,
                            temperature=0.2,
                        )
                    )
                    return response

                response = await asyncio.wait_for(loop.run_in_executor(None, _call_gemini), timeout=timeout)
                
                report_data = json.loads(response.text)
                report = GeminiConstructionReport(**report_data)
                
                self._cache[cache_key] = report
                logger.info("Successfully received structured response from Gemini 2.5 Flash.")
                
                return GeminiReportWrapper(
                    status="success",
                    message="Generated via Gemini 2.5 Flash",
                    report=report
                )

            except asyncio.TimeoutError:
                logger.warning(f"Gemini API request timed out after {timeout} seconds (Attempt {attempt}).")
            except Exception as e:
                logger.error(f"Gemini API call failed (Attempt {attempt}): {str(e)}")
            
            if attempt < max_retries:
                await asyncio.sleep(2 ** attempt)

        logger.error("All Gemini API attempts failed. Falling back to deterministic report.")
        return self.generate_fallback_report(intelligence_payload, reason="Gemini API request rate limit reached or timed out.")

    def generate_fallback_space_report(self, space_payload: Dict[str, Any], reason: str = "AI space explanation temporarily unavailable.") -> GeminiReportWrapper:
        """Generates safe deterministic fallback report for space optimization."""
        from conark.gemini.schemas import GeminiSpaceReport, SpacePriorityItem, RecommendedActionItem
        
        opt_status = space_payload.get("status", "OPTIMAL")
        alloc = space_payload.get("allocation") or {}
        metrics = space_payload.get("metrics") or {}
        
        util_pct = metrics.get("space_utilization_percentage", 91.7)
        eff_score = metrics.get("space_efficiency_score", 88.4)
        safety_score = metrics.get("safety_compliance_score", 100.0)
        unused = metrics.get("unused_area_sqm", 100.0)

        fallback_report = GeminiSpaceReport(
            summary=f"Space allocation completed with status '{opt_status}'. Site space utilization is {util_pct:.1f}% with an overall efficiency score of {eff_score:.1f}/100 and safety compliance of {safety_score:.1f}/100. Material Storage ({alloc.get('material_storage_area_sqm', 320.0):.1f} sqm) and Safety Buffer ({alloc.get('safety_buffer_area_sqm', 120.0):.1f} sqm) have been optimized to prevent trade congestion.",
            layout_explanation=f"Allocated {alloc.get('material_storage_area_sqm', 320.0):.1f} sqm for material storage, {alloc.get('equipment_area_sqm', 180.0):.1f} sqm for equipment parking, {alloc.get('worker_movement_area_sqm', 150.0):.1f} sqm for worker circulation, and {alloc.get('safety_buffer_area_sqm', 120.0):.1f} sqm for mandatory safety buffer.",
            key_findings=[
                f"Optimization Status: {opt_status}",
                f"Space Utilization: {util_pct:.1f}% ({unused:.1f} sqm unused)",
                f"Safety Compliance Score: {safety_score:.1f}/100",
                f"Space Efficiency Score: {eff_score:.1f}/100"
            ],
            space_priorities=[
                SpacePriorityItem(zone="Material Storage", priority="HIGH", reason="Essential for continuous operational throughput"),
                SpacePriorityItem(zone="Safety Buffer", priority="CRITICAL", reason="Mandatory safety clearance for worker protection")
            ],
            recommended_actions=[
                RecommendedActionItem(action="Implement designated material staging boundaries", priority="HIGH", reason="Prevents material spillover into circulation zones"),
                RecommendedActionItem(action="Verify site entrance clearance for emergency vehicles", priority="CRITICAL", reason="Ensures unhindered emergency vehicle passage")
            ],
            safety_considerations=[
                f"Safety buffer allocated: {alloc.get('safety_buffer_area_sqm', 120.0):.1f} sqm",
                f"Emergency access corridor allocated: {alloc.get('emergency_access_area_sqm', 110.0):.1f} sqm"
            ],
            optimization_assumptions=[
                "Calculated using deterministic space coefficients and SciPy constrained optimization",
                "Single-floor ground level layout assumption"
            ],
            limitations=[
                "Optimization results provide decision support and must be reviewed by qualified site engineers prior to physical implementation."
            ]
        )

        return GeminiReportWrapper(
            status="fallback",
            message=reason,
            space_report=fallback_report
        )

    async def generate_space_report(self, space_payload: Dict[str, Any]) -> GeminiReportWrapper:
        """Generates structured space intelligence report using Gemini 2.5 Flash."""
        from conark.gemini.prompts import GEMINI_SPACE_SYSTEM_PROMPT, format_gemini_space_prompt
        from conark.gemini.schemas import GeminiSpaceReport

        cache_key = self._compute_hash(space_payload) + "_space"
        if cache_key in self._cache:
            logger.info("Returning cached Gemini space report.")
            return GeminiReportWrapper(
                status="success",
                message="Retrieved from response cache",
                space_report=self._cache[cache_key]
            )

        if not self.client_wrapper.is_available():
            logger.info("Gemini API key not configured. Returning fallback space report.")
            return self.generate_fallback_space_report(space_payload, reason="GEMINI_API_KEY is not configured.")

        prompt = format_gemini_space_prompt(space_payload)
        max_retries = settings.GEMINI_MAX_RETRIES
        timeout = settings.GEMINI_TIMEOUT_SECONDS

        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"Calling Gemini 2.5 Flash for Space Report (Attempt {attempt}/{max_retries})...")
                loop = asyncio.get_event_loop()
                def _call_gemini():
                    client_wrapper = GeminiClient.for_model("space_optimization")
                    client = client_wrapper.client
                    response = client.models.generate_content(
                        model=client_wrapper.model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=GEMINI_SPACE_SYSTEM_PROMPT,
                            response_mime_type="application/json",
                            response_schema=GeminiSpaceReport,
                            temperature=0.2,
                        )
                    )
                    return response

                response = await asyncio.wait_for(loop.run_in_executor(None, _call_gemini), timeout=timeout)
                report_data = json.loads(response.text)
                space_report = GeminiSpaceReport(**report_data)
                
                self._cache[cache_key] = space_report
                logger.info("Successfully received structured space report from Gemini 2.5 Flash.")
                
                return GeminiReportWrapper(
                    status="success",
                    message="Generated via Gemini 2.5 Flash",
                    space_report=space_report
                )
            except Exception as e:
                logger.error(f"Gemini Space API call failed (Attempt {attempt}): {str(e)}")
            
            if attempt < max_retries:
                await asyncio.sleep(2 ** attempt)

        return self.generate_fallback_space_report(space_payload, reason="Gemini API request rate limit reached or timed out.")
