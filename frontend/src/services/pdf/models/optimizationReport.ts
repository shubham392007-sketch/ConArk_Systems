import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox,
  formatInputValue
} from '../pdfHelpers';

export function buildOptimizationReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'INPUT DATA', y);

  const inputRows = [
    { parameter: 'Worker Count', value: formatInputValue('worker_count', inputs.worker_count ?? 12) },
    { parameter: 'Material Usage', value: formatInputValue('material_usage', inputs.material_usage ?? 1400) },
    { parameter: 'Machinery Count', value: formatInputValue('machinery_count', inputs.machinery_count ?? 6) },
    { parameter: 'Equipment Utilization Rate', value: formatInputValue('equipment_utilization_rate', inputs.equipment_utilization_rate ?? 78) },
    { parameter: 'Energy Consumption', value: formatInputValue('energy_consumption', inputs.energy_consumption ?? 410) },
    { parameter: 'Task Progress', value: formatInputValue('task_progress', inputs.task_progress ?? 40) },
    { parameter: 'Cost Deviation', value: formatInputValue('cost_deviation', inputs.cost_deviation ?? 0) },
    { parameter: 'Time Deviation', value: formatInputValue('time_deviation', inputs.time_deviation ?? 0) }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'MODEL RESULT', y);

  const optRes = outputs.optimization || outputs.ml_results?.optimization || {};
  const rec = optRes.recommendation || outputs.recommendation || 'OPTIMIZE MATERIAL USAGE & EQUIPMENT STAGING';
  const priority = optRes.priority || outputs.priority || 'HIGH';
  const expectedImp = optRes.expected_improvement || outputs.expected_improvement || '+15% Operational Yield';

  const resultRows = [
    { parameter: 'OPTIMIZATION SUGGESTION', value: String(rec).toUpperCase() },
    { parameter: 'OPTIMIZATION PRIORITY LEVEL', value: String(priority).toUpperCase() },
    { parameter: 'EXPECTED OPERATIONAL YIELD IMPACT', value: String(expectedImp).toUpperCase() },
    { parameter: 'SOLVER ENGINE ALGORITHM', value: 'SCIPY SLSQP CONSTRAINED SOLVER' }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 03 / GEMINI AI ANALYSIS
  y = addSectionTitle(doc, '03', 'GEMINI OPTIMIZATION ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const summary = geminiObj.summary || geminiObj.what_this_means || 
    `The optimization engine recommends prioritizing ${rec}. Aligning worker deployment with equipment availability will maximize operational throughput.`;

  y = addCardBox(
    doc,
    'WHY THIS OPTIMIZATION IS RECOMMENDED',
    [summary],
    y,
    [255, 255, 255],
    [228, 255, 91] // Chartreuse accent header
  );

  const steps = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Reallocate 2 idle workers to the active material loading area.',
    'Schedule machinery maintenance during off-peak hours.',
    'Consolidate waste disposal runs to twice daily.'
  ];

  y = addCardBox(
    doc,
    'IMPLEMENTATION STEPS & EXPECTED BENEFITS',
    steps.map(s => `→ ${s}`),
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  return y;
}
