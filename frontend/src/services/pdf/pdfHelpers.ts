import { jsPDF } from 'jspdf';
import { CONARK_PDF_THEME } from './pdfTheme';
import type { ReportMetadata } from './reportTypes';

export function generateReportId(): string {
  const dateStr = new Date().toISOString().split('T')[0];
  const randHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `CONARK-RPT-${dateStr}-${randHex}`;
}

export function formatDateTime(isoOrDateStr?: string): { date: string; time: string } {
  const d = isoOrDateStr ? new Date(isoOrDateStr) : new Date();
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  return { date, time };
}

export function createPdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: CONARK_PDF_THEME.page.orientation,
    unit: 'mm',
    format: CONARK_PDF_THEME.page.format
  });
  drawPageBackground(doc);
  return doc;
}

export function drawPageBackground(doc: jsPDF): void {
  const { width, height } = CONARK_PDF_THEME.page;
  doc.setFillColor(237, 236, 231); // #EDECE7
  doc.rect(0, 0, width, height, 'F');
}

export function checkPageBreak(doc: jsPDF, currentY: number, neededHeight: number): number {
  const maxY = CONARK_PDF_THEME.page.height - CONARK_PDF_THEME.page.marginBottom - 10;
  if (currentY + neededHeight > maxY) {
    doc.addPage();
    drawPageBackground(doc);
    return CONARK_PDF_THEME.page.marginTop + 15;
  }
  return currentY;
}

export function drawHeaderFooter(
  doc: jsPDF,
  modelName: string,
  metadata: ReportMetadata,
  currentPage: number,
  totalPages: number
): void {
  const { width, height, marginLeft, marginRight, marginTop } = CONARK_PDF_THEME.page;
  const contentRight = width - marginRight;

  // Top Header Line
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, marginTop, contentRight, marginTop);

  // Top Header Branding Text
  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text('CONARK SYSTEMS', marginLeft, marginTop - 3);

  doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text('AI-POWERED CONSTRUCTION INTELLIGENCE', marginLeft + 35, marginTop - 3);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(17, 17, 17);
  doc.text(`${modelName.toUpperCase()} REPORT`, contentRight, marginTop - 3, { align: 'right' });

  // Bottom Footer Line
  const footerY = height - 12;
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.4);
  doc.line(marginLeft, footerY, contentRight, footerY);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(17, 17, 17);
  doc.text('CONARK SYSTEMS', marginLeft, footerY + 5);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text(`ID: ${metadata.report_id}`, marginLeft + 35, footerY + 5);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setTextColor(17, 17, 17);
  const pageStr = `PAGE ${String(currentPage).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
  doc.text(pageStr, contentRight, footerY + 5, { align: 'right' });
}

export function addCoverSection(
  doc: jsPDF,
  modelName: string,
  metadata: ReportMetadata,
  primaryPrediction: string,
  keyRecommendation: string
): number {
  const { marginLeft } = CONARK_PDF_THEME.page;
  const contentWidth = CONARK_PDF_THEME.page.contentWidth;
  let y = CONARK_PDF_THEME.page.marginTop + 10;

  // Header Pill
  doc.setFillColor(17, 17, 17);
  doc.rect(marginLeft, y, 42, 6, 'F');
  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL AI REPORT', marginLeft + 3, y + 4.2);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text(`STATUS: ${metadata.status}`, marginLeft + 48, y + 4.2);

  y += 14;

  // Main Cover Title Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.6);
  doc.rect(marginLeft, y, contentWidth, 54, 'DF');

  // Small Magenta Accent Strip on top edge
  doc.setFillColor(255, 42, 161); // #FF2AA1
  doc.rect(marginLeft, y, contentWidth, 2.5, 'F');

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(85, 85, 85);
  doc.text('CONARK SYSTEMS · MODEL RESULT REPORT', marginLeft + 8, y + 10);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 17, 17);
  doc.text(modelName.toUpperCase(), marginLeft + 8, y + 22);

  // Metadata block on right side of title box
  const metaX = marginLeft + contentWidth - 65;
  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(85, 85, 85);
  doc.text('REPORT ID', metaX, y + 10);

  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text(metadata.report_id, metaX, y + 15);

  doc.setFontSize(6.5);
  doc.setTextColor(85, 85, 85);
  doc.text('GENERATED DATE & TIME', metaX, y + 23);

  const { date, time } = formatDateTime(metadata.timestamp);
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text(`${date} · ${time}`, metaX, y + 28);

  doc.setFontSize(6.5);
  doc.setTextColor(85, 85, 85);
  doc.text('GEMINI AI EXPLANATION', metaX, y + 36);
  doc.setFontSize(8);
  doc.setTextColor(21, 128, 61); // Green
  doc.text(metadata.gemini_enabled ? 'ENABLED & CONTEXTUALIZED' : 'FALLBACK MODE', metaX, y + 41);

  // Bottom Slogan inside Cover Card
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.line(marginLeft + 8, y + 45, marginLeft + contentWidth - 8, y + 45);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(17, 17, 17);
  doc.text('ML PREDICTS   ·   OPTIMIZATION DECIDES   ·   GEMINI EXPLAINS', marginLeft + 8, y + 50);

  y += 62;

  // Executive Summary Card Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.5);
  doc.rect(marginLeft, y, contentWidth, 38, 'DF');

  doc.setFillColor(228, 255, 91); // Chartreuse accent header
  doc.rect(marginLeft, y, contentWidth, 8, 'F');
  doc.setDrawColor(17, 17, 17);
  doc.line(marginLeft, y + 8, marginLeft + contentWidth, y + 8);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(17, 17, 17);
  doc.text('EXECUTIVE SUMMARY', marginLeft + 6, y + 5.8);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text('PRIMARY PREDICTION RESULT', marginLeft + 6, y + 14);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text(primaryPrediction.toUpperCase(), marginLeft + 6, y + 21);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(85, 85, 85);
  doc.text('KEY RECOMMENDATION', marginLeft + 85, y + 14);

  doc.setFont(CONARK_PDF_THEME.fonts.body, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  const recLines = doc.splitTextToSize(keyRecommendation || 'Maintain current operational parameters and monitor telemetry.', contentWidth - 92);
  doc.text(recLines, marginLeft + 85, y + 19);

  y += 46;
  return y;
}

export function addSectionTitle(doc: jsPDF, numberStr: string, titleStr: string, currentY: number): number {
  let y = checkPageBreak(doc, currentY, 18);
  const { marginLeft } = CONARK_PDF_THEME.page;
  const contentWidth = CONARK_PDF_THEME.page.contentWidth;

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 42, 161); // Magenta
  doc.text(numberStr, marginLeft, y);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 17, 17);
  doc.text(titleStr.toUpperCase(), marginLeft + 12, y);

  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.4);
  doc.line(marginLeft, y + 2.5, marginLeft + contentWidth, y + 2.5);

  return y + 9;
}

export function formatInputValue(key: string, val: any): string {
  if (val === null || val === undefined) return 'N/A';
  if (typeof val === 'boolean') return val ? 'YES' : 'NO';
  if (typeof val === 'number') {
    if (key.includes('temperature')) return `${val.toFixed(1)} °C`;
    if (key.includes('humidity')) return `${val.toFixed(1)} %`;
    if (key.includes('vibration')) return `${val.toFixed(1)} Hz`;
    if (key.includes('kg') || key.includes('material')) return `${val.toLocaleString()} kg`;
    if (key.includes('kwh') || key.includes('energy')) return `${val.toLocaleString()} kWh`;
    if (key.includes('progress')) return `${(val <= 1 ? val * 100 : val).toFixed(1)} %`;
    if (key.includes('cost') && !key.includes('deviation')) return `$${val.toLocaleString()}`;
    if (key.includes('sqm') || key.includes('area')) return `${val.toLocaleString()} m²`;
    if (key.includes('efficiency') || key.includes('utilization')) return `${val.toFixed(1)} %`;
    if (Number.isInteger(val)) return `${val}`;
    return `${val.toFixed(2)}`;
  }
  
  // Binary / Enum string transformations
  if (key === 'machinery_status') {
    if (val === 1 || val === '1' || val === 'ACTIVE') return 'ACTIVE (1)';
    if (val === 0 || val === '0' || val === 'IDLE') return 'IDLE (0)';
  }
  return String(val).toUpperCase();
}

export function addTwoColumnTable(
  doc: jsPDF,
  rows: { parameter: string; value: string }[],
  startY: number
): number {
  let y = startY;
  const { marginLeft } = CONARK_PDF_THEME.page;
  const contentWidth = CONARK_PDF_THEME.page.contentWidth;
  const col1Width = 95;

  // Table Header
  y = checkPageBreak(doc, y, 12);
  doc.setFillColor(17, 17, 17);
  doc.rect(marginLeft, y, contentWidth, 6.5, 'F');

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PARAMETER', marginLeft + 4, y + 4.5);
  doc.text('VALUE', marginLeft + col1Width + 4, y + 4.5);

  y += 6.5;

  rows.forEach((row, i) => {
    y = checkPageBreak(doc, y, 7.5);
    const bgColor = i % 2 === 0 ? 255 : 245; // Alternating row color
    doc.setFillColor(bgColor, bgColor, i % 2 === 0 ? 255 : 238);
    doc.setDrawColor(220, 220, 220);
    doc.rect(marginLeft, y, contentWidth, 7, 'DF');

    doc.setFont(CONARK_PDF_THEME.fonts.body, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(row.parameter, marginLeft + 4, y + 4.8);

    doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(row.value, marginLeft + col1Width + 4, y + 4.8);

    y += 7;
  });

  return y + 6;
}

export function addCardBox(
  doc: jsPDF,
  title: string,
  lines: string[],
  startY: number,
  bgColorRGB: [number, number, number] = [255, 255, 255],
  headerColorRGB: [number, number, number] = [17, 17, 17]
): number {
  let y = startY;
  const { marginLeft } = CONARK_PDF_THEME.page;
  const contentWidth = CONARK_PDF_THEME.page.contentWidth;

  const paddedTextLines: string[] = [];
  lines.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 12);
    paddedTextLines.push(...wrapped);
  });

  const bodyHeight = paddedTextLines.length * 4.8 + 8;
  const cardTotalHeight = 8 + bodyHeight;

  y = checkPageBreak(doc, y, cardTotalHeight + 4);

  // Card Outer Box
  doc.setFillColor(...bgColorRGB);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.4);
  doc.rect(marginLeft, y, contentWidth, cardTotalHeight, 'DF');

  // Header Strip
  doc.setFillColor(...headerColorRGB);
  doc.rect(marginLeft, y, contentWidth, 7, 'F');

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(headerColorRGB[0] === 17 ? 255 : 17, headerColorRGB[0] === 17 ? 255 : 17, headerColorRGB[0] === 17 ? 255 : 17);
  doc.text(title.toUpperCase(), marginLeft + 5, y + 5);

  let textY = y + 12;
  doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);

  paddedTextLines.forEach(t => {
    doc.text(t, marginLeft + 5, textY);
    textY += 4.8;
  });

  return y + cardTotalHeight + 6;
}
