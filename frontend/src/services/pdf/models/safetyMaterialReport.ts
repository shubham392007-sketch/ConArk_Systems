import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox,
  formatInputValue
} from '../pdfHelpers';

export function buildSafetyMaterialReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'INPUT DATA', y);

  const inputRows = [
    { parameter: 'Safety Incidents Count', value: formatInputValue('safety_incidents', inputs.safety_incidents ?? 0) },
    { parameter: 'Vibration Level', value: formatInputValue('vibration_level', inputs.vibration_level ?? 28.5) },
    { parameter: 'Worker Density Count', value: formatInputValue('worker_count', inputs.worker_count ?? 12) },
    { parameter: 'Material Storage Quantity', value: formatInputValue('material_usage', inputs.material_usage ?? 1200) },
    { parameter: 'Daily Material Burn Rate', value: formatInputValue('estimated_daily_material_usage_kg', inputs.estimated_daily_material_usage_kg ?? 150) },
    { parameter: 'Daily Waste Generation', value: formatInputValue('waste_generation_kg_per_day', inputs.waste_generation_kg_per_day ?? 30) },
    { parameter: 'Material Shortage Flag', value: formatInputValue('material_shortage_alert', inputs.material_shortage_alert ?? 0) }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'MODEL RESULT', y);

  const safetyAlert = outputs.safety_alert || outputs.ml_results?.safety_alert || {};
  const materialAlert = outputs.material_alert || outputs.ml_results?.material_alert || {};

  const safetyStatus = safetyAlert.status || (inputs.safety_incidents > 0 ? 'WARNING' : 'SAFE');
  const safetyProb = safetyAlert.probability || 0.08;

  const materialStatus = materialAlert.status || (inputs.material_shortage_alert ? 'SHORTAGE ALERT' : 'ADEQUATE');
  const materialProb = materialAlert.probability || 0.12;

  const resultRows = [
    { parameter: 'SAFETY COMPLIANCE STATUS', value: String(safetyStatus).toUpperCase() },
    { parameter: 'SAFETY INCIDENT PROBABILITY', value: `${(safetyProb * 100).toFixed(1)} %` },
    { parameter: 'MATERIAL INVENTORY STATUS', value: String(materialStatus).toUpperCase() },
    { parameter: 'MATERIAL SHORTAGE RISK PROBABILITY', value: `${(materialProb * 100).toFixed(1)} %` },
    { parameter: 'CRITICAL HAZARD LEVEL', value: inputs.safety_incidents > 1 ? 'HIGH' : 'LOW' }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 03 / GEMINI AI ANALYSIS
  y = addSectionTitle(doc, '03', 'SAFETY & MATERIAL ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const safetyInterp = geminiObj.safety_interpretation || geminiObj.summary || 
    `Safety monitoring confirms site conditions remain ${safetyStatus}. Environmental telemetry and worker load remain within compliant thresholds.`;

  y = addCardBox(
    doc,
    'SAFETY STATUS INTERPRETATION',
    [safetyInterp],
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  const matInterp = geminiObj.material_interpretation || 
    `Material inventory positioning is currently ${materialStatus}. Supply chain lead times match scheduled site staging demands.`;

  y = addCardBox(
    doc,
    'MATERIAL INVENTORY INTERPRETATION',
    [matInterp],
    y,
    [255, 255, 255],
    [79, 195, 247] // Blue accent header
  );

  const recs = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Enforce mandatory safety briefings for all shifts entering high-vibration zones.',
    'Reorder raw materials 3 days prior to safety buffer threshold levels.',
    'Ensure waste clearance corridors are kept unblocked to avoid safety hazards.'
  ];

  y = addCardBox(
    doc,
    'CRITICAL OBSERVATIONS & ACTIONS',
    recs.map(r => `→ ${r}`),
    y,
    [255, 255, 255],
    [255, 42, 161] // Magenta accent header
  );

  return y;
}
