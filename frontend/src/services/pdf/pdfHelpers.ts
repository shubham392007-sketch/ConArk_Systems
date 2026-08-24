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
  const contentWidth = CONARK_PDF_THEME.page.contentWidth; // 180mm
  let y = CONARK_PDF_THEME.page.marginTop + 8;

  // Header Pill
  doc.setFillColor(17, 17, 17);
  doc.rect(marginLeft, y, 38, 5.5, 'F');
  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL AI REPORT', marginLeft + 3, y + 3.8);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(85, 85, 85);
  doc.text(`STATUS: ${metadata.status}`, marginLeft + 44, y + 3.8);

  y += 10;

  // Layout: Left Title Area (104mm width) and Right Metadata Area (68mm width)
  const leftColWidth = 104;
  const metaX = marginLeft + leftColWidth + 6;
  const rightColWidth = contentWidth - leftColWidth - 6;

  // Calculate dynamic title wrapping so it NEVER overflows into metadata
  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  const titleStr = modelName.toUpperCase();
  let titleFontSize = 16;
  if (titleStr.length > 26) titleFontSize = 13.5;
  if (titleStr.length > 40) titleFontSize = 11.5;
  doc.setFontSize(titleFontSize);

  const wrappedTitle = doc.splitTextToSize(titleStr, leftColWidth - 8);
  const titleLinesCount = wrappedTitle.length;
  
  // Calculate dynamic card height to fit both columns cleanly
  const leftHeight = 14 + (titleLinesCount * (titleFontSize * 0.5)) + 16;
  const rightHeight = 44;
  const cardHeight = Math.max(52, leftHeight, rightHeight);

  // Main Cover Card Frame
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.6);
  doc.rect(marginLeft, y, contentWidth, cardHeight, 'DF');

  // Magenta Top Accent Strip
  doc.setFillColor(255, 42, 161);
  doc.rect(marginLeft, y, contentWidth, 2.5, 'F');

  // Left Section: Subtitle & Wrapped Title
  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(85, 85, 85);
  doc.text('CONARK SYSTEMS · MODEL RESULT REPORT', marginLeft + 8, y + 9);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(titleFontSize);
  doc.setTextColor(17, 17, 17);
  doc.text(wrappedTitle, marginLeft + 8, y + 17);

  // Vertical Separator Line between Title and Metadata
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.3);
  doc.line(metaX - 3, y + 6, metaX - 3, y + cardHeight - 8);

  // Right Section: Metadata
  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6);
  doc.setTextColor(85, 85, 85);
  doc.text('REPORT ID', metaX, y + 9);

  doc.setFontSize(7);
  doc.setTextColor(17, 17, 17);
  const reportIdWrapped = doc.splitTextToSize(metadata.report_id, rightColWidth - 4);
  doc.text(reportIdWrapped, metaX, y + 13.5);

  doc.setFontSize(6);
  doc.setTextColor(85, 85, 85);
  doc.text('GENERATED DATE & TIME', metaX, y + 21);

  const { date, time } = formatDateTime(metadata.timestamp);
  doc.setFontSize(7.5);
  doc.setTextColor(17, 17, 17);
  doc.text(`${date} · ${time}`, metaX, y + 25.5);

  doc.setFontSize(6);
  doc.setTextColor(85, 85, 85);
  doc.text('GEMINI AI EXPLANATION', metaX, y + 33);
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61); // Green
  doc.text(metadata.gemini_enabled ? 'ENABLED & CONTEXTUALIZED' : 'FALLBACK MODE', metaX, y + 37.5);

  // Bottom Slogan inside Cover Card
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.line(marginLeft + 8, y + cardHeight - 7, marginLeft + contentWidth - 8, y + cardHeight - 7);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 17, 17);
  doc.text('ML PREDICTS   ·   OPTIMIZATION DECIDES   ·   GEMINI EXPLAINS', marginLeft + 8, y + cardHeight - 2.5);

  y += cardHeight + 6;

  // Executive Summary Card Box (Dynamic Height & Zero Overlap)
  const summaryLeftCol = 65;
  const summaryRightCol = contentWidth - summaryLeftCol - 10;

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(11);
  const predLines = doc.splitTextToSize(primaryPrediction.toUpperCase(), summaryLeftCol - 6);

  doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
  doc.setFontSize(8);
  const recLines = doc.splitTextToSize(keyRecommendation || 'Maintain standard operational parameters and monitor real-time telemetry.', summaryRightCol - 6);

  const summaryContentHeight = Math.max(predLines.length * 5 + 14, recLines.length * 4 + 14);
  const summaryBoxHeight = Math.max(34, summaryContentHeight + 8);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.5);
  doc.rect(marginLeft, y, contentWidth, summaryBoxHeight, 'DF');

  doc.setFillColor(228, 255, 91); // Chartreuse accent header
  doc.rect(marginLeft, y, contentWidth, 6.5, 'F');
  doc.setDrawColor(17, 17, 17);
  doc.line(marginLeft, y + 6.5, marginLeft + contentWidth, y + 6.5);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text('EXECUTIVE SUMMARY', marginLeft + 6, y + 4.8);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6);
  doc.setTextColor(85, 85, 85);
  doc.text('PRIMARY PREDICTION RESULT', marginLeft + 6, y + 11.5);

  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(17, 17, 17);
  doc.text(predLines, marginLeft + 6, y + 17);

  // Vertical divider inside executive summary
  doc.setDrawColor(210, 210, 210);
  doc.line(marginLeft + summaryLeftCol + 2, y + 8, marginLeft + summaryLeftCol + 2, y + summaryBoxHeight - 3);

  doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
  doc.setFontSize(6);
  doc.setTextColor(85, 85, 85);
  doc.text('KEY RECOMMENDATION', marginLeft + summaryLeftCol + 6, y + 11.5);

  doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(17, 17, 17);
  doc.text(recLines, marginLeft + summaryLeftCol + 6, y + 16.5);

  y += summaryBoxHeight + 8;
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
  const col1Width = 90;
  const col2Width = contentWidth - col1Width;

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
    doc.setFont(CONARK_PDF_THEME.fonts.body, 'bold');
    doc.setFontSize(8);
    const paramLines = doc.splitTextToSize(row.parameter, col1Width - 8);

    doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
    doc.setFontSize(8);
    const valLines = doc.splitTextToSize(row.value, col2Width - 8);

    const rowHeight = Math.max(7, Math.max(paramLines.length, valLines.length) * 4.2 + 3);
    y = checkPageBreak(doc, y, rowHeight);

    const bgColor = i % 2 === 0 ? 255 : 246; // Alternating row color
    doc.setFillColor(bgColor, bgColor, i % 2 === 0 ? 255 : 238);
    doc.setDrawColor(220, 220, 220);
    doc.rect(marginLeft, y, contentWidth, rowHeight, 'DF');

    doc.setFont(CONARK_PDF_THEME.fonts.body, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(paramLines, marginLeft + 4, y + 4.6);

    doc.setFont(CONARK_PDF_THEME.fonts.mono, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(valLines, marginLeft + col1Width + 4, y + 4.6);

    y += rowHeight;
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
  const { marginLeft, height, marginBottom } = CONARK_PDF_THEME.page;
  const contentWidth = CONARK_PDF_THEME.page.contentWidth;
  const maxY = height - marginBottom - 12;

  // Process lines and preserve paragraph structure
  const formattedParagraphs: string[][] = [];
  lines.forEach(rawLine => {
    if (!rawLine) return;
    const subParagraphs = rawLine.split(/\r?\n/);
    subParagraphs.forEach(sub => {
      if (!sub.trim()) return;
      const wrapped = doc.splitTextToSize(sub, contentWidth - 14);
      formattedParagraphs.push(wrapped);
    });
  });

  if (formattedParagraphs.length === 0) return y;

  // Check initial space required for title + first paragraph
  y = checkPageBreak(doc, y, 24);

  // Draw Initial Card Box Header
  doc.setFillColor(...bgColorRGB);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.4);

  // Estimate initial card height
  let estimatedHeight = 10;
  formattedParagraphs.forEach(p => {
    estimatedHeight += p.length * 4.8 + 2.5;
  });

  // Draw Card Outer Box Background
  doc.rect(marginLeft, y, contentWidth, Math.min(estimatedHeight, maxY - y), 'DF');

  // Header Strip
  doc.setFillColor(...headerColorRGB);
  doc.rect(marginLeft, y, contentWidth, 7, 'F');

  const textColor = (headerColorRGB[0] < 128 && headerColorRGB[1] < 128) ? 255 : 17;
  doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(textColor, textColor, textColor);
  doc.text(title.toUpperCase(), marginLeft + 5, y + 5);

  let textY = y + 12.5;
  doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);

  formattedParagraphs.forEach((paragraphLines, pIdx) => {
    paragraphLines.forEach(lineText => {
      if (textY + 5 > maxY) {
        // Break Page and Continue Card on Next Page
        doc.addPage();
        drawPageBackground(doc);
        textY = CONARK_PDF_THEME.page.marginTop + 15;

        // Draw Continuation Header Strip
        doc.setFillColor(...headerColorRGB);
        doc.rect(marginLeft, textY - 7, contentWidth, 6, 'F');
        doc.setFont(CONARK_PDF_THEME.fonts.display, 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(textColor, textColor, textColor);
        doc.text(`${title.toUpperCase()} (CONTINUED)`, marginLeft + 5, textY - 2.5);

        textY += 4;
        doc.setFont(CONARK_PDF_THEME.fonts.body, 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 17, 17);
      }

      doc.text(lineText, marginLeft + 5, textY);
      textY += 4.8;
    });

    if (pIdx < formattedParagraphs.length - 1) {
      textY += 2.5; // Paragraph gap
    }
  });

  return textY + 6;
}
