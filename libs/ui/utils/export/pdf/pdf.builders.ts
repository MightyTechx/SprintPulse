import type { Content } from 'pdfmake/interfaces';
import { PDF_COLORS, TABLE_STYLES, KPI_COLUMN_WIDTHS, DOWNTIME_COLUMN_WIDTHS } from './pdf.styles';
import type { KpiRow, IncidentRow, ReportMetadata } from '../types';

// Build the PDF header section
export function buildHeader(metadata: ReportMetadata): Content {
  return {
    stack: [
      // Top bar with company info and date
      {
        columns: [
          // Left: Company branding
          {
            stack: [
              {
                text: 'SprintPulse',
                style: 'companyName',
                margin: [0, 0, 0, 2] as [number, number, number, number],
              },
              {
                text: 'Sprint Management Platform',
                style: 'subtitle',
                margin: [0, 0, 0, 0] as [number, number, number, number],
              },
            ],
            width: '*',
          },
          // Right: Report info
          {
            stack: [
              {
                text: metadata.reportName,
                style: 'reportTitle',
                alignment: 'right',
                margin: [0, 0, 0, 2] as [number, number, number, number],
              },
              {
                text: `${metadata.fromDate} - ${metadata.toDate}`,
                style: 'dateRange',
                alignment: 'right',
                margin: [0, 0, 0, 2] as [number, number, number, number],
              },
              {
                text: `Generated: ${metadata.generatedAt}`,
                style: 'generatedAt',
                alignment: 'right',
              },
            ],
            width: 'auto',
          },
        ],
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
      // Divider line
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 2,
            lineColor: PDF_COLORS.primary,
          },
          {
            type: 'line',
            x1: 0,
            y1: 3,
            x2: 515,
            y2: 3,
            lineWidth: 1,
            lineColor: PDF_COLORS.accent,
          },
        ],
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },
      // Sprint filter info
      {
        text: `Sprint: ${metadata.sprint}`,
        style: 'subtitle',
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
    ],
  };
}

// Build KPI Table header row (for dynamic sprints)
function buildKpiHeaderRow(
  sprintIds: string[] = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'],
): Content[] {
  const headerRow: Content[] = [
    { text: 'Key Performance Indicator', style: 'headerCell', ...TABLE_STYLES.header },
  ];

  sprintIds.forEach((id) => {
    const sprintNum = id.replace('s', '').toUpperCase().padStart(2, '0');
    headerRow.push({ text: `SPR-${sprintNum}`, style: 'headerCell', ...TABLE_STYLES.header });
  });

  headerRow.push({ text: 'Total / Avg', style: 'headerCell', ...TABLE_STYLES.header });

  return headerRow;
}

// Format a cell value - handles both string and number inputs
function formatCellValue(value: string | number | undefined | null, isNumeric = false): string {
  if (value === null || value === undefined || value === '-') return '-';
  if (isNumeric) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '-';
    return num.toFixed(0);
  }
  return String(value);
}

// Build KPI Table data rows with dynamic columns
function buildKpiDataRows(
  data: any[],
  sprintIds: string[] = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'],
): Content[][] {
  return data.map((row, index) => {
    const isOdd = index % 2 === 1;
    const fillColor = isOdd ? PDF_COLORS.rowAlt : PDF_COLORS.white;

    const cells: Content[] = [];

    // First column - KPI label (handle different key names)
    const kpiValue = row.kpi || row.parameter || row.date || row.sprint || '-';
    cells.push({ text: String(kpiValue), ...TABLE_STYLES.firstCol, fillColor });

    // Data columns for each sprint
    sprintIds.forEach((id) => {
      const val = row[id];
      cells.push({ text: formatCellValue(val, true), ...TABLE_STYLES.dataCell, fillColor });
    });

    // Total/Avg column (handle different key names)
    const totalValue = row.total || row.avg || '-';
    cells.push({ text: formatCellValue(totalValue, true), ...TABLE_STYLES.totalCol, fillColor });

    return cells;
  });
}

// Calculate column widths based on number of sprints - fits within page width
// Landscape A4 with margins [40, 70, 40, 50] = 842 - 80 = 762 usable width
function calculateKpiColumnWidths(numSprints: number): (string | number)[] {
  // Base on 10 sprints to match existing design, scale down for fewer sprints
  const totalUsableWidth = 640; // Leave some margin for padding

  // Fixed widths for label and total columns
  const labelWidth = 130;
  const totalWidth = 55;

  // Remaining width for sprint data columns
  const remainingWidth = totalUsableWidth - labelWidth - totalWidth;
  const dataWidth = Math.floor(remainingWidth / numSprints);

  const widths: (string | number)[] = [labelWidth];
  for (let i = 0; i < numSprints; i++) {
    widths.push(dataWidth);
  }
  widths.push(totalWidth);

  return widths;
}

// Build KPI Table section
export function buildKpiTable(data: any[], sprintIds?: string[]): Content {
  const tIds = sprintIds || ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'];
  const headerRow = buildKpiHeaderRow(tIds);
  const dataRows = buildKpiDataRows(data, tIds);
  const columnWidths = calculateKpiColumnWidths(tIds.length);

  return {
    stack: [
      // Section title
      {
        text: 'Key Performance Indicators',
        style: 'sectionTitle',
        margin: [0, 10, 0, 10] as [number, number, number, number],
      },
      // Table
      {
        table: {
          headerRows: 1,
          widths: columnWidths,
          body: [headerRow, ...dataRows],
        },
        layout: 'lightHorizontalLines',
      },
    ],
  };
}

// Build Incident (Detailed Downtime Log) Table header row
function buildDowntimeHeaderRow(): Content[] {
  return [
    { text: 'S.No', ...TABLE_STYLES.header },
    { text: 'Team', ...TABLE_STYLES.header },
    { text: 'Assignee', ...TABLE_STYLES.header },
    { text: 'Assigned To', ...TABLE_STYLES.header },
    { text: 'Incident #', ...TABLE_STYLES.header },
    { text: 'From Date', ...TABLE_STYLES.header },
    { text: 'To Date', ...TABLE_STYLES.header },
    { text: 'Issue', ...TABLE_STYLES.header },
    { text: 'Total Hours', ...TABLE_STYLES.header },
    { text: 'Status', ...TABLE_STYLES.header },
  ];
}

// Get color for incident status (Jira-style status chip)
function getIncidentStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    Open: PDF_COLORS.textMuted,
    'In Progress': PDF_COLORS.info,
    'In Review': PDF_COLORS.secondary,
    Blocked: PDF_COLORS.danger,
    Testing: PDF_COLORS.warning,
    Done: PDF_COLORS.success,
  };
  return colorMap[status] || PDF_COLORS.textMuted;
}

// Build Incident Table data rows
function buildDowntimeDataRows(data: any[]): Content[][] {
  return data.map((row, index) => {
    const isOdd = index % 2 === 1;
    const baseFillColor = isOdd ? PDF_COLORS.rowAlt : PDF_COLORS.white;
    const statusColor = getIncidentStatusColor(row.status);
    const textCell = (value: any, alignment: 'left' | 'center' | 'right' = 'center') => ({
      text: value || '-',
      fontSize: 8,
      color: PDF_COLORS.textDark,
      fillColor: baseFillColor,
      alignment,
      padding: [4, 4, 4, 4] as [number, number, number, number],
    });

    return [
      { text: row.id ?? '-', ...TABLE_STYLES.firstCol, fillColor: baseFillColor, bold: true, color: PDF_COLORS.primary },
      textCell(row.team),
      textCell(row.assignee),
      textCell(row.assignedTo),
      textCell(row.incidentNumber),
      textCell(row.fromDate),
      textCell(row.toDate),
      textCell(row.issue, 'left'),
      textCell(row.totalHours),
      {
        text: row.status || '-',
        fontSize: 8,
        color: statusColor,
        bold: true,
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
    ];
  });
}

// Build Downtime Table section
export function buildDowntimeTable(data: any[]): Content {
  const headerRow = buildDowntimeHeaderRow();
  const dataRows = buildDowntimeDataRows(data);

  return {
    stack: [
      // Section title
      {
        text: 'Detailed Downtime Log',
        style: 'sectionTitle',
        margin: [0, 25, 0, 10] as [number, number, number, number],
      },
      // Table
      {
        table: {
          headerRows: 1,
          widths: DOWNTIME_COLUMN_WIDTHS,
          body: [headerRow, ...dataRows],
        },
        layout: 'lightHorizontalLines',
      },
    ],
  };
}
