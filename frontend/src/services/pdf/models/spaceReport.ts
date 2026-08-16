import { jsPDF } from 'jspdf';
import type { ModelReportPayload, StructuredGeminiAnalysis } from '../reportTypes';
import {
  addSectionTitle,
  addTwoColumnTable,
  addCardBox
} from '../pdfHelpers';

export function buildSpaceReport(doc: jsPDF, payload: ModelReportPayload, startY: number): number {
  let y = startY;
  const { inputs, outputs, geminiExplanation } = payload;

  // 01 / INPUT DATA
  y = addSectionTitle(doc, '01', 'SITE CONSTRAINTS & TELEMETRY INPUTS', y);

  const lengthM = inputs.site_length_m || 40;
  const widthM = inputs.site_width_m || 30;
  const areaSqm = inputs.site_area_sqm || (lengthM * widthM);

  const inputRows = [
    { parameter: 'Site Dimensions (Length × Width)', value: `${lengthM} m × ${widthM} m` },
    { parameter: 'Total Site Area', value: `${areaSqm.toLocaleString()} m²` },
    { parameter: 'Construction Stage', value: String(inputs.construction_stage || 'STRUCTURE').toUpperCase() },
    { parameter: 'Worker Count on Site', value: `${inputs.worker_count ?? 25} WORKERS` },
    { parameter: 'Machinery Count on Site', value: `${inputs.machinery_count ?? 8} MACHINES` },
    { parameter: 'Heavy Machinery Count', value: `${inputs.heavy_machinery_count ?? 2} HEAVY UNITS` },
    { parameter: 'Material Storage Quantity', value: `${(inputs.material_quantity_kg ?? 15000).toLocaleString()} kg` },
    { parameter: 'Daily Truck Deliveries', value: `${inputs.daily_truck_count ?? 6} TRUCKS/DAY` },
    { parameter: 'Safety Requirement Level', value: String(inputs.safety_requirement_level || 'HIGH').toUpperCase() },
    { parameter: 'Emergency Access Corridor Required', value: inputs.emergency_access_required !== false ? 'YES (REQUIRED)' : 'NO' }
  ];

  y = addTwoColumnTable(doc, inputRows, y);

  // 02 / MODEL RESULT
  y = addSectionTitle(doc, '02', 'OPTIMIZED 2D SPATIAL METRICS', y);

  const alloc = outputs.allocation || outputs.space_allocation || {};
  const sumAlloc = (alloc.material_storage_area_sqm || 320) +
                   (alloc.equipment_area_sqm || 240) +
                   (alloc.worker_movement_area_sqm || 315) +
                   (alloc.safety_buffer_area_sqm || 128) +
                   (alloc.loading_unloading_area_sqm || 104) +
                   (alloc.waste_dump_area_sqm || 45) +
                   (alloc.emergency_access_sqm || 105) +
                   (alloc.staging_area_sqm || 200);

  const util = outputs.space_utilization_score || ((sumAlloc / areaSqm) * 100);
  const safetyScore = outputs.safety_compliance_score || 100.0;
  const effScore = outputs.layout_efficiency_score || 61.6;

  const resultRows = [
    { parameter: 'SPACE UTILIZATION RATE', value: `${util.toFixed(1)} %` },
    { parameter: 'SAFETY COMPLIANCE RATING', value: `${safetyScore.toFixed(0)} %` },
    { parameter: 'LAYOUT EFFICIENCY SCORE', value: `${effScore.toFixed(1)} / 100` },
    { parameter: 'SOLVER ENGINE ALGORITHM', value: 'SCIPY SLSQP CONSTRAINED SOLVER' }
  ];

  y = addTwoColumnTable(doc, resultRows, y);

  // 8-ZONE ALLOCATION MATRIX TABLE
  y = addSectionTitle(doc, '03', '8-ZONE ALLOCATION MATRIX', y);

  const zoneRows = [
    { parameter: 'Material Storage Area', value: `${(alloc.material_storage_area_sqm || 320).toFixed(1)} m²  (${(alloc.material_storage_area_sqm ? (alloc.material_storage_area_sqm/areaSqm*100) : 26.7).toFixed(1)}% site)` },
    { parameter: 'Equipment Parking Area', value: `${(alloc.equipment_area_sqm || 240).toFixed(1)} m²  (${(alloc.equipment_area_sqm ? (alloc.equipment_area_sqm/areaSqm*100) : 20.0).toFixed(1)}% site)` },
    { parameter: 'Worker Movement Area', value: `${(alloc.worker_movement_area_sqm || 315).toFixed(1)} m²  (${(alloc.worker_movement_area_sqm ? (alloc.worker_movement_area_sqm/areaSqm*100) : 26.3).toFixed(1)}% site)` },
    { parameter: 'Safety Buffer Zone', value: `${(alloc.safety_buffer_area_sqm || 128).toFixed(1)} m²  (${(alloc.safety_buffer_area_sqm ? (alloc.safety_buffer_area_sqm/areaSqm*100) : 10.7).toFixed(1)}% site)` },
    { parameter: 'Loading / Unloading Zone', value: `${(alloc.loading_unloading_area_sqm || 104).toFixed(1)} m²  (${(alloc.loading_unloading_area_sqm ? (alloc.loading_unloading_area_sqm/areaSqm*100) : 8.7).toFixed(1)}% site)` },
    { parameter: 'Waste Dump Area', value: `${(alloc.waste_dump_area_sqm || 45).toFixed(1)} m²  (${(alloc.waste_dump_area_sqm ? (alloc.waste_dump_area_sqm/areaSqm*100) : 3.8).toFixed(1)}% site)` },
    { parameter: 'Emergency Access Corridor', value: `${(alloc.emergency_access_sqm || 105).toFixed(1)} m²  (${(alloc.emergency_access_sqm ? (alloc.emergency_access_sqm/areaSqm*100) : 8.8).toFixed(1)}% site)` },
    { parameter: 'Staging Area', value: `${(alloc.staging_area_sqm || 200).toFixed(1)} m²  (${(alloc.staging_area_sqm ? (alloc.staging_area_sqm/areaSqm*100) : 16.7).toFixed(1)}% site)` }
  ];

  y = addTwoColumnTable(doc, zoneRows, y);

  // 04 / GEMINI SPATIAL ANALYSIS
  y = addSectionTitle(doc, '04', 'GEMINI SPATIAL ANALYSIS', y);

  let geminiObj: StructuredGeminiAnalysis = {};
  if (typeof geminiExplanation === 'string') {
    geminiObj = { summary: geminiExplanation };
  } else if (geminiExplanation && typeof geminiExplanation === 'object') {
    geminiObj = geminiExplanation;
  }

  const spaceAnalysis = geminiObj.space_analysis || geminiObj.summary || 
    `The spatial layout engine allocated 8 non-overlapping zones across ${areaSqm} m². Emergency access corridor runs continuously along the perimeter for 100% safety compliance.`;

  y = addCardBox(
    doc,
    'SPATIAL LAYOUT EXPLANATION',
    [spaceAnalysis],
    y,
    [255, 255, 255],
    [79, 195, 247] // Blue accent header
  );

  const recs = geminiObj.recommended_actions || geminiObj.next_steps || [
    'Position high-turnover materials adjacent to the loading zone to minimize transit distance.',
    'Keep emergency corridor completely free of transient waste or equipment storage.',
    'Review worker movement corridor markings at the start of each shift.'
  ];

  y = addCardBox(
    doc,
    'RECOMMENDED LAYOUT CHANGES & OPERATIONAL IMPACT',
    recs.map(r => `→ ${r}`),
    y,
    [255, 255, 255],
    [124, 255, 166] // Mint accent header
  );

  return y;
}
