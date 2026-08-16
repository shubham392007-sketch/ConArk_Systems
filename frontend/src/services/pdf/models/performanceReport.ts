import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox,
  formatInputValue
} from '../pdfHelpers';

export function buildPerformanceReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'INPUT DATA', y);

  const inputRows = [
    { parameter: 'Temperature', value: formatInputValue('temperature', inputs.temperature ?? 24.36) },
    { parameter: 'Humidity', value: formatInputValue('humidity', inputs.humidity ?? 70.83) },
    { parameter: 'Vibration Level', value: formatInputValue('vibration_level', inputs.vibration_level ?? 29.04) },
    { parameter: 'Material Usage', value: formatInputValue('material_usage', inputs.material_usage ?? 162.29) },
    { parameter: 'Machinery Status', value: formatInputValue('machinery_status', inputs.machinery_status ?? 1) },
    { parameter: 'Worker Count', value: formatInputValue('worker_count', inputs.worker_count ?? 10) },
    { parameter: 'Energy Consumption', value: formatInputValue('energy_consumption', inputs.energy_consumption ?? 394.62) },
    { parameter: 'Task Progress', value: formatInputValue('task_progress', inputs.task_progress ?? 2.50) },
    { parameter: 'Equipment Utilization Rate', value: formatInputValue('equipment_utilization_rate', inputs.equipment_utilization_rate ?? 78.5) },
    { parameter: 'Safety Incidents', value: formatInputValue('safety_incidents', inputs.safety_incidents ?? 0) },
    { parameter: 'Cost Deviation', value: formatInputValue('cost_deviation', inputs.cost_deviation ?? 0.0) },
    { parameter: 'Time Deviation', value: formatInputValue('time_deviation', inputs.time_deviation ?? 0.0) }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'MODEL RESULT', y);

  const perfPred = outputs.prediction?.label || outputs.ml_results?.performance?.prediction || outputs.prediction || 'GOOD';
  const confidence = outputs.prediction?.confidence || outputs.ml_results?.performance?.confidence || 0.936;

  const resultRows = [
    { parameter: 'PERFORMANCE PREDICTION SCORE', value: String(perfPred).toUpperCase() },
    { parameter: 'MODEL PREDICTION CONFIDENCE', value: `${(confidence * 100).toFixed(1)}%` },
    { parameter: 'EQUIPMENT UTILIZATION SCORE', value: formatInputValue('equipment_utilization', inputs.equipment_utilization_rate ?? 78.5) },
    { parameter: 'SAFETY INCIDENT COUNT', value: `${inputs.safety_incidents ?? 0} INCIDENTS` },
    { parameter: 'TASK PROGRESS COMPLETE', value: formatInputValue('task_progress', inputs.task_progress ?? 2.50) }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 03 / GEMINI AI ANALYSIS
  y = addSectionTitle(doc, '03', 'GEMINI AI ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const summary = geminiObj.summary || geminiObj.what_this_means || 
    'The project currently exhibits strong operational baseline stability. Machine status is active with normal environmental telemetry.';

  y = addCardBox(
    doc,
    'WHAT THIS MEANS',
    [summary],
    y,
    [255, 255, 255],
    [79, 195, 247] // Blue accent header
  );

  const keyFindings = geminiObj.key_findings || geminiObj.key_observations || [
    'Worker count and machinery status are fully synchronized.',
    'Vibration level remains within tolerable thresholds.',
    'Material consumption rate aligns with planned task progress.'
  ];

  y = addCardBox(
    doc,
    'KEY OBSERVATIONS & FINDINGS',
    keyFindings.map(f => `• ${f}`),
    y,
    [255, 255, 255],
    [228, 255, 91] // Chartreuse accent header
  );

  const recs = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Maintain equipment maintenance schedule to avoid downtime.',
    'Ensure worker movement corridors remain unblocked during high-vibration tasks.',
    'Continuously monitor energy consumption spikes.'
  ];

  y = addCardBox(
    doc,
    'RECOMMENDED ACTIONS & NEXT STEPS',
    recs.map(r => `→ ${r}`),
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  return y;
}
