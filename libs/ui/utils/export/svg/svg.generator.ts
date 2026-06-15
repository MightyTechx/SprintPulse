// SVG export utilities for chart and table data - styled like PDF

import type { ReportMetadata } from '../types';

// Brand colors matching PDF
const COLORS = {
  primary: '#4f46e5',
  secondary: '#6366f1',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  textDark: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  white: '#ffffff',
  rowAlt: '#f8fafc',
  border: '#e2e8f0',
};

// Generate a table SVG element
function generateTableSvg(
  headers: string[],
  rows: string[][],
  startX: number,
  startY: number,
  colWidths: number[],
  rowHeight: number = 28,
): string {
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  let svg = '';

  // Table header background
  svg += `<rect x="${startX}" y="${startY}" width="${tableWidth}" height="${rowHeight}" fill="${COLORS.primary}" />`;

  // Header text
  let currentX = startX;
  headers.forEach((header, i) => {
    svg += `<text x="${currentX + colWidths[i] / 2}" y="${startY + rowHeight / 2 + 5}"
            font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700"
            fill="${COLORS.white}" text-anchor="middle">${escapeXml(header)}</text>`;
    currentX += colWidths[i];
  });

  // Data rows
  rows.forEach((row, rowIndex) => {
    const y = startY + rowHeight * (rowIndex + 1);
    const fillColor = rowIndex % 2 === 1 ? COLORS.rowAlt : COLORS.white;

    // Row background
    svg += `<rect x="${startX}" y="${y}" width="${tableWidth}" height="${rowHeight}" fill="${fillColor}" />`;

    // Row cells
    currentX = startX;
    row.forEach((cell, colIndex) => {
      const isFirstCol = colIndex === 0;
      const isLastCol = colIndex === row.length - 1;
      const fontWeight = isFirstCol ? '600' : '400';
      const textColor = isLastCol ? COLORS.primary : COLORS.textDark;
      const textAnchor = isFirstCol ? 'start' : 'middle';

      const textX = isFirstCol ? currentX + 8 : currentX + colWidths[colIndex] / 2;

      svg += `<text x="${textX}" y="${y + rowHeight / 2 + 5}"
              font-family="Inter, Arial, sans-serif" font-size="10"
              font-weight="${fontWeight}" fill="${textColor}" text-anchor="${textAnchor}">${escapeXml(cell)}</text>`;
      currentX += colWidths[colIndex];
    });
  });

  // Table border
  const totalHeight = rowHeight * (rows.length + 1);
  svg += `<rect x="${startX}" y="${startY}" width="${tableWidth}" height="${totalHeight}"
          fill="none" stroke="${COLORS.border}" stroke-width="1"/>`;

  return svg;
}

// Escape XML special characters
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate KPI table SVG
function generateKpiTableSvg(
  data: any[],
  startX: number,
  startY: number,
  sprintIds: string[],
): string {
  const headers = ['Key Performance Indicator'];
  sprintIds.forEach((id) => {
    const num = id.replace('s', '').toUpperCase().padStart(2, '0');
    headers.push(`SPR-${num}`);
  });
  headers.push('Total / Avg');

  const colWidths = [200, ...sprintIds.map(() => 50), 70];

  const rows = data.map((row) => {
    const rowData = [];
    rowData.push(row.kpi || row.parameter || row.date || row.sprint || '-');
    sprintIds.forEach((id) => {
      rowData.push(row[id] || '-');
    });
    rowData.push(row.total || row.avg || '-');
    return rowData;
  });

  return generateTableSvg(headers, rows, startX, startY, colWidths, 26);
}

// Generate Incident (Detailed Downtime Log) table SVG
function generateDowntimeTableSvg(data: any[], startX: number, startY: number): string {
  const headers = [
    'S.No',
    'Team',
    'Assignee',
    'Assigned To',
    'Incident #',
    'From Date',
    'To Date',
    'Issue',
    'Total Hours',
    'Status',
  ];
  // S.No | Team | Assignee | Assigned To | Incident# | From | To | Issue(*) | Total Hours | Status
  const numericWidths: number[] = [30, 70, 80, 80, 70, 90, 90, 0, 65, 70];

  const rows = data.map((row) => [
    row.id ?? '-',
    row.team || '-',
    row.assignee || '-',
    row.assignedTo || '-',
    row.incidentNumber || '-',
    row.fromDate || '-',
    row.toDate || '-',
    row.issue || '-',
    row.totalHours || '-',
    row.status || '-',
  ]);

  // Issue column is the variable-width one (marked with 0 in numericWidths)
  const fixedTotal = numericWidths.reduce((a, b) => a + b, 0);
  const availableWidth = 1020 - startX * 2;
  const lastColWidth = Math.max(80, availableWidth - fixedTotal);
  const finalWidths: number[] = numericWidths.map((w) => (w === 0 ? lastColWidth : w));

  return generateTableSvg(headers, rows, startX, startY, finalWidths, 26);
}

// Generate SVG from chart data
export function generateSvgExport(
  metadata: ReportMetadata,
  chartSvgData: string,
  kpiData?: any[],
  downtimeData?: any[],
  sprintIds?: string[],
): void {
  const width = 1100;
  const height = 750;

  // Determine content based on data availability
  const hasKpiData = kpiData && kpiData.length > 0;
  const hasDowntimeData = downtimeData && downtimeData.length > 0;
  const tIds =
    sprintIds && sprintIds.length > 0
      ? sprintIds
      : ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'];

  // Build content based on what's available
  let contentSvg = '';

  if (chartSvgData && chartSvgData !== 'default-chart') {
    // Chart-based content
    contentSvg = chartSvgData;
  } else if (hasKpiData || hasDowntimeData) {
    // Table-based content
    let contentY = 120;

    if (hasKpiData) {
      // Section title
      contentSvg += `<text x="40" y="${contentY}" font-family="Inter, Arial, sans-serif"
                      font-size="13" font-weight="700" fill="${COLORS.primary}">Key Performance Indicators</text>`;
      contentY += 30;

      contentSvg += generateKpiTableSvg(kpiData!, 40, contentY, tIds);
      contentY += 26 * (kpiData!.length + 2) + 40;
    }

    if (hasDowntimeData) {
      contentSvg += `<text x="40" y="${contentY}" font-family="Inter, Arial, sans-serif"
                      font-size="13" font-weight="700" fill="${COLORS.primary}">Detailed Downtime Log</text>`;
      contentY += 30;

      contentSvg += generateDowntimeTableSvg(downtimeData!, 40, contentY);
    }
  } else {
    // Empty state with placeholder chart
    contentSvg = generatePlaceholderChart();
  }

  // Create complete SVG document
  const svgDocument = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap');
      .title { font-family: 'Inter', Arial, sans-serif; font-size: 22px; font-weight: 700; fill: ${COLORS.primary}; }
      .subtitle { font-family: 'Inter', Arial, sans-serif; font-size: 12px; fill: ${COLORS.textMuted}; }
      .date { font-family: 'Inter', Arial, sans-serif; font-size: 10px; fill: ${COLORS.textLight}; }
    </style>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.secondary};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${COLORS.accent};stop-opacity:0.05" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${COLORS.white}" />

  <!-- Header Background -->
  <rect x="0" y="0" width="${width}" height="85" fill="url(#headerGrad)" />

  <!-- Company Name -->
  <text x="40" y="38" class="title">SprintPulse</text>
  <text x="40" y="58" class="subtitle" style="fill: rgba(255,255,255,0.9);">Sprint Management Platform</text>

  <!-- Report Info -->
  <text x="${width - 40}" y="35" text-anchor="end" class="subtitle" style="fill: ${COLORS.white}; font-weight: 600; font-size: 14px;">${escapeXml(metadata.reportName)}</text>
  <text x="${width - 40}" y="55" text-anchor="end" class="date" style="fill: rgba(255,255,255,0.8);">${escapeXml(metadata.fromDate)} - ${escapeXml(metadata.toDate)}</text>
  <text x="${width - 40}" y="72" text-anchor="end" class="date" style="fill: rgba(255,255,255,0.7);">Generated: ${escapeXml(metadata.generatedAt)}</text>

  <!-- Divider Line -->
  <line x1="40" y1="85" x2="${width - 40}" y2="85" stroke="${COLORS.accent}" stroke-width="2" />

  <!-- Content Area -->
  <g transform="translate(0, 95)">
    ${contentSvg}
  </g>

  <!-- Footer Background -->
  <rect x="0" y="${height - 45}" width="${width}" height="45" fill="url(#accentGrad)" />

  <!-- Footer Line -->
  <line x1="40" y1="${height - 45}" x2="${width - 40}" y2="${height - 45}" stroke="${COLORS.border}" stroke-width="1" />

  <!-- Footer Text -->
  <text x="40" y="${height - 18}" class="date">Sprint: ${escapeXml(metadata.sprint)}</text>
  <text x="${width - 40}" y="${height - 18}" text-anchor="end" class="date">SprintPulse Sprint Management System</text>
</svg>`;

  // Create blob and download
  const blob = new Blob([svgDocument], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SprintPulse_${metadata.reportName.replace(/\s+/g, '_')}_${metadata.fromDate.replace(/\//g, '-')}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate placeholder chart for empty state
function generatePlaceholderChart(): string {
  const chartX = 80;
  const chartY = 50;
  const chartW = 900;
  const chartH = 300;

  let svg = `
    <!-- Chart background -->
    <rect x="${chartX}" y="${chartY}" width="${chartW}" height="${chartH}"
          fill="${COLORS.rowAlt}" rx="8" stroke="${COLORS.border}" stroke-width="1"/>

    <!-- Grid lines -->
  `;

  // Horizontal grid lines
  for (let i = 0; i <= 5; i++) {
    const y = chartY + (chartH * i) / 5;
    svg += `<line x1="${chartX + 40}" y1="${y}" x2="${chartX + chartW - 20}" y2="${y}"
            stroke="${COLORS.border}" stroke-width="1" stroke-dasharray="4"/>`;
  }

  // Vertical grid lines
  for (let i = 0; i <= 7; i++) {
    const x = chartX + 40 + ((chartW - 60) * i) / 7;
    svg += `<line x1="${x}" y1="${chartY + 20}" x2="${x}" y2="${chartY + chartH - 20}"
            stroke="${COLORS.border}" stroke-width="1" stroke-dasharray="4"/>`;
  }

  // Sample line chart
  const linePoints = [
    [chartX + 80, chartY + 200],
    [chartX + 200, chartY + 150],
    [chartX + 320, chartY + 180],
    [chartX + 440, chartY + 100],
    [chartX + 560, chartY + 120],
    [chartX + 680, chartY + 80],
    [chartX + 800, chartY + 130],
  ];

  const linePath = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  svg += `<path d="${linePath}" fill="none" stroke="${COLORS.primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

  // Data points
  linePoints.forEach((p) => {
    svg += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${COLORS.primary}" stroke="${COLORS.white}" stroke-width="2"/>`;
  });

  // Axis labels placeholder
  svg += `
    <text x="${chartX + chartW / 2}" y="${chartY + chartH + 25}"
          font-family="Inter, Arial, sans-serif" font-size="11" fill="${COLORS.textMuted}" text-anchor="middle">Date Range</text>
    <text x="${chartX - 10}" y="${chartY + chartH / 2}"
          font-family="Inter, Arial, sans-serif" font-size="11" fill="${COLORS.textMuted}"
          text-anchor="end" transform="rotate(-90, ${chartX - 10}, ${chartY + chartH / 2})">Generation (kWh)</text>
  `;

  return svg;
}

// Export SVG from ApexCharts
export async function exportChartSvg(chartRef: any): Promise<string> {
  try {
    const uri = await chartRef.chart.dataURI();
    return uri;
  } catch (error) {
    console.error('Error exporting chart SVG:', error);
    return '';
  }
}
