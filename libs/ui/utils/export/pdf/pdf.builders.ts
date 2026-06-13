import type { Content } from 'pdfmake/interfaces';
import { PDF_COLORS, TABLE_STYLES, KPI_COLUMN_WIDTHS, DOWNTIME_COLUMN_WIDTHS } from './pdf.styles';
import type { KpiRow, DowntimeRow, ReportMetadata } from '../types';

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
                text: 'Wind Energy Management',
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
      // Turbine filter info
      {
        text: `Turbine: ${metadata.turbine}`,
        style: 'subtitle',
        margin: [0, 0, 0, 15] as [number, number, number, number],
      },
    ],
  };
}

// Build KPI Table header row (for dynamic turbines)
function buildKpiHeaderRow(
  turbineIds: string[] = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'],
): Content[] {
  const headerRow: Content[] = [
    { text: 'Key Performance Indicator', style: 'headerCell', ...TABLE_STYLES.header },
  ];

  turbineIds.forEach((id) => {
    const turbineNum = id.replace('t', '').toUpperCase().padStart(2, '0');
    headerRow.push({ text: `T-${turbineNum}`, style: 'headerCell', ...TABLE_STYLES.header });
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
  turbineIds: string[] = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'],
): Content[][] {
  return data.map((row, index) => {
    const isOdd = index % 2 === 1;
    const fillColor = isOdd ? PDF_COLORS.rowAlt : PDF_COLORS.white;

    const cells: Content[] = [];

    // First column - KPI label (handle different key names)
    const kpiValue = row.kpi || row.parameter || row.date || row.turbine || '-';
    cells.push({ text: String(kpiValue), ...TABLE_STYLES.firstCol, fillColor });

    // Data columns for each turbine
    turbineIds.forEach((id) => {
      const val = row[id];
      cells.push({ text: formatCellValue(val, true), ...TABLE_STYLES.dataCell, fillColor });
    });

    // Total/Avg column (handle different key names)
    const totalValue = row.total || row.avg || '-';
    cells.push({ text: formatCellValue(totalValue, true), ...TABLE_STYLES.totalCol, fillColor });

    return cells;
  });
}

// Calculate column widths based on number of turbines - fits within page width
// Landscape A4 with margins [40, 70, 40, 50] = 842 - 80 = 762 usable width
function calculateKpiColumnWidths(numTurbines: number): (string | number)[] {
  // Base on 10 turbines to match existing design, scale down for fewer turbines
  const totalUsableWidth = 640; // Leave some margin for padding

  // Fixed widths for label and total columns
  const labelWidth = 130;
  const totalWidth = 55;

  // Remaining width for turbine data columns
  const remainingWidth = totalUsableWidth - labelWidth - totalWidth;
  const dataWidth = Math.floor(remainingWidth / numTurbines);

  const widths: (string | number)[] = [labelWidth];
  for (let i = 0; i < numTurbines; i++) {
    widths.push(dataWidth);
  }
  widths.push(totalWidth);

  return widths;
}

// Build KPI Table section
export function buildKpiTable(data: any[], turbineIds?: string[]): Content {
  const tIds = turbineIds || ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'];
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

// Build Downtime Table header row
function buildDowntimeHeaderRow(): Content[] {
  return [
    { text: 'Turbine', ...TABLE_STYLES.header },
    { text: 'From', ...TABLE_STYLES.header },
    { text: 'To', ...TABLE_STYLES.header },
    { text: 'Duration', ...TABLE_STYLES.header },
    { text: 'Downtime Type', ...TABLE_STYLES.header },
    { text: 'Fault Status', ...TABLE_STYLES.header },
    { text: 'Remarks', ...TABLE_STYLES.header },
  ];
}

// Get color for downtime type
function getDowntimeTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    Scheduled: PDF_COLORS.success,
    Unscheduled: PDF_COLORS.danger,
    'Force Majeure': PDF_COLORS.warning,
    'Grid Fault': PDF_COLORS.info,
    'Communication Loss': PDF_COLORS.secondary,
  };
  return colorMap[type] || PDF_COLORS.textMuted;
}

// Get color for fault status
function getFaultStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    Active: PDF_COLORS.danger,
    Cleared: PDF_COLORS.success,
    Acknowledged: PDF_COLORS.warning,
  };
  return colorMap[status] || PDF_COLORS.textMuted;
}

// Build Downtime Table data rows
function buildDowntimeDataRows(data: any[]): Content[][] {
  return data.map((row, index) => {
    const isOdd = index % 2 === 1;
    const baseFillColor = isOdd ? PDF_COLORS.rowAlt : PDF_COLORS.white;
    const typeColor = getDowntimeTypeColor(row.downtimeType);
    const statusColor = getFaultStatusColor(row.faultStatus);

    return [
      { text: row.turbineNo || '-', ...TABLE_STYLES.firstCol, fillColor: baseFillColor },
      {
        text: row.from || '-',
        fontSize: 8,
        color: PDF_COLORS.textDark,
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
      {
        text: row.to || '-',
        fontSize: 8,
        color: PDF_COLORS.textDark,
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
      {
        text: row.duration || '-',
        fontSize: 8,
        color: PDF_COLORS.textDark,
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
      {
        text: row.downtimeType || '-',
        fontSize: 8,
        color: typeColor,
        bold: true,
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
      {
        text: row.faultStatus || '-',
        fontSize: 8,
        color: statusColor,
        bold: row.faultStatus === 'Active',
        fillColor: baseFillColor,
        alignment: 'center' as const,
        padding: [4, 4, 4, 4] as [number, number, number, number],
      },
      {
        text: row.remarks || '-',
        fontSize: 8,
        color: PDF_COLORS.textMuted,
        fillColor: baseFillColor,
        alignment: 'left' as const,
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
