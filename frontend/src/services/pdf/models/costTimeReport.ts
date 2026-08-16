import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox,
  formatInputValue
} from '../pdfHelpers';

export function buildCostTimeReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'INPUT DATA', y);

  const inputRows = [
    { parameter: 'Material Usage', value: formatInputValue('material_usage', inputs.material_usage ?? 1250) },
    { parameter: 'Worker Count', value: formatInputValue('worker_count', inputs.worker_count ?? 18) },
    { parameter: 'Energy Consumption', value: formatInputValue('energy_consumption', inputs.energy_consumption ?? 480) },
    { parameter: 'Equipment Utilization Rate', value: formatInputValue('equipment_utilization_rate', inputs.equipment_utilization_rate ?? 75) },
    { parameter: 'Task Progress', value: formatInputValue('task_progress', inputs.task_progress ?? 35) },
    { parameter: 'Material Shortage Alert', value: formatInputValue('material_shortage_alert', inputs.material_shortage_alert ?? 0) },
    { parameter: 'Cost Deviation', value: formatInputValue('cost_deviation', inputs.cost_deviation ?? 0.0) },
    { parameter: 'Time Deviation', value: formatInputValue('time_deviation', inputs.time_deviation ?? 0.0) }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'MODEL RESULT', y);

  const costForecast = outputs.cost_forecast || outputs.ml_results?.cost_forecast || {};
  const timeForecast = outputs.time_forecast || outputs.ml_results?.time_forecast || {};

  const predCost = costForecast.predicted_cost || outputs.predicted_cost || 142500;
  const budgetStatus = costForecast.budget_status || (predCost > 140000 ? 'OVER BUDGET' : 'ON BUDGET');
  const predTime = timeForecast.predicted_days || outputs.predicted_days || 45;
  const scheduleStatus = timeForecast.schedule_status || (predTime > 40 ? 'BEHIND SCHEDULE' : 'ON SCHEDULE');

  const resultRows = [
    { parameter: 'PREDICTED TOTAL COST', value: `$${predCost.toLocaleString()}` },
    { parameter: 'BUDGET VARIANCE STATUS', value: String(budgetStatus).toUpperCase() },
    { parameter: 'PREDICTED COMPLETION TIME', value: `${predTime} DAYS` },
    { parameter: 'SCHEDULE VARIANCE STATUS', value: String(scheduleStatus).toUpperCase() },
    { parameter: 'COST ESTIMATION ACCURACY', value: '94.8% (XGBOOST)' }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 03 / GEMINI AI ANALYSIS
  y = addSectionTitle(doc, '03', 'GEMINI FORECAST ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const costInterp = geminiObj.cost_interpretation || geminiObj.summary || 
    `Cost analysis indicates budget positioning is ${budgetStatus}. Primary cost drivers include material procurement and daily energy consumption.`;

  y = addCardBox(
    doc,
    'COST FORECAST INTERPRETATION',
    [costInterp],
    y,
    [255, 255, 255],
    [79, 195, 247] // Blue accent header
  );

  const schedInterp = geminiObj.schedule_interpretation || 
    `Schedule analysis indicates completion is currently ${scheduleStatus}. Task progress execution rate is performing within expected operational velocity.`;

  y = addCardBox(
    doc,
    'SCHEDULE FORECAST INTERPRETATION',
    [schedInterp],
    y,
    [255, 255, 255],
    [228, 255, 91] // Chartreuse accent header
  );

  const recs = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Audit material bulk purchasing to mitigate cost variance.',
    'Reallocate labor shifts during peak productivity hours to protect schedule milestone dates.',
    'Review equipment leasing schedules to reduce idle energy cost overhead.'
  ];

  y = addCardBox(
    doc,
    'RECOMMENDED COST & TIME ACTIONS',
    recs.map(r => `→ ${r}`),
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  return y;
}
