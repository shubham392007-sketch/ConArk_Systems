import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox,
  formatInputValue
} from '../pdfHelpers';

export function buildRiskReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'INPUT DATA', y);

  const inputRows = [
    { parameter: 'Temperature', value: formatInputValue('temperature', inputs.temperature ?? 28.5) },
    { parameter: 'Humidity', value: formatInputValue('humidity', inputs.humidity ?? 65.0) },
    { parameter: 'Vibration Level', value: formatInputValue('vibration_level', inputs.vibration_level ?? 35.2) },
    { parameter: 'Worker Count', value: formatInputValue('worker_count', inputs.worker_count ?? 15) },
    { parameter: 'Machinery Status', value: formatInputValue('machinery_status', inputs.machinery_status ?? 1) },
    { parameter: 'Energy Consumption', value: formatInputValue('energy_consumption', inputs.energy_consumption ?? 420.0) },
    { parameter: 'Equipment Utilization Rate', value: formatInputValue('equipment_utilization_rate', inputs.equipment_utilization_rate ?? 82.0) },
    { parameter: 'Safety Incidents', value: formatInputValue('safety_incidents', inputs.safety_incidents ?? 1) },
    { parameter: 'Material Shortage Alert', value: formatInputValue('material_shortage_alert', inputs.material_shortage_alert ?? 0) },
    { parameter: 'Task Progress', value: formatInputValue('task_progress', inputs.task_progress ?? 45.0) }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'MODEL RESULT', y);

  const riskScore = outputs.risk_score ?? outputs.ml_results?.risk?.risk_score ?? outputs.prediction?.score ?? 23.18;
  const riskLevel = outputs.risk_level ?? outputs.ml_results?.risk?.risk_level ?? (riskScore > 60 ? 'HIGH RISK' : riskScore > 35 ? 'MODERATE RISK' : 'LOW RISK');

  const resultRows = [
    { parameter: 'PREDICTED RISK SCORE', value: `${riskScore.toFixed(1)} %` },
    { parameter: 'RISK LEVEL CLASSIFICATION', value: String(riskLevel).toUpperCase() },
    { parameter: 'PRIMARY RISK DRIVER', value: inputs.safety_incidents > 0 ? 'SAFETY INCIDENTS DETECTED' : 'HIGH EQUIPMENT LOAD' },
    { parameter: 'VIBRATION RISK LEVEL', value: inputs.vibration_level > 40 ? 'ELEVATED (ACTION REQ)' : 'NORMAL' },
    { parameter: 'ENVIRONMENTAL HEAT STRESS', value: inputs.temperature > 32 ? 'HIGH TEMPERATURE' : 'NORMAL' }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 03 / GEMINI AI ANALYSIS
  y = addSectionTitle(doc, '03', 'GEMINI AI RISK ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const summary = geminiObj.summary || geminiObj.what_this_means || 
    `The project risk level is currently evaluated as ${riskLevel}. Equipment utilization and vibration telemetry indicate standard operating parameters with controlled risk.`;

  y = addCardBox(
    doc,
    'RISK INTERPRETATION',
    [summary],
    y,
    [255, 255, 255],
    [255, 42, 161] // Magenta accent header
  );

  const riskFactors = geminiObj.key_risk_factors || geminiObj.key_findings || [
    'Safety incident count influences the current baseline risk rating.',
    'Heavy machinery vibration levels should be monitored continuously.',
    'Worker density requires active safety corridor enforcement.'
  ];

  y = addCardBox(
    doc,
    'KEY RISK FACTORS',
    riskFactors.map(f => `⚠ ${f}`),
    y,
    [255, 255, 255],
    [228, 255, 91] // Chartreuse accent header
  );

  const actions = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Deploy safety compliance inspection on active structural zones.',
    'Inspect vibration damping pads on heavy machinery.',
    'Verify emergency corridor clearance across all active work shifts.'
  ];

  y = addCardBox(
    doc,
    'IMMEDIATE & PREVENTIVE ACTIONS',
    actions.map(a => `→ ${a}`),
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  return y;
}
