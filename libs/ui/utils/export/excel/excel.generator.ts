import * as XLSX from 'xlsx';
import type { ReportMetadata, KpiRow, DowntimeRow } from '../types';

// Define brand colors for Excel
const EXCEL_COLORS = {
  headerBg: '4F46E5',
  headerText: 'FFFFFF',
  rowAlt: 'F8FAFC',
  primary: '4F46E5',
  success: '10B981',
  warning: 'F59E0B',
  danger: 'EF4444',
  info: '3B82F6',
  textDark: '1E293B',
  textMuted: '64748B',
  border: 'E2E8F0',
};

// Build KPI worksheet data with dynamic columns
function buildKpiWorksheetData(
  data: any[],
  turbineIds: string[] = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'],
): any[] {
  const headers = ['Key Performance Indicator'];

  turbineIds.forEach((id) => {
    const turbineNum = id.replace('t', '').toUpperCase().padStart(2, '0');
    headers.push(`T-${turbineNum}`);
  });

  headers.push('Total / Avg');

  const rows = data.map((row) => {
    const rowData: any[] = [];

    // First column - KPI label (handle different key names)
    const kpiValue = row.kpi || row.parameter || row.date || row.turbine || '-';
    rowData.push(kpiValue);

    // Data columns for each turbine
    turbineIds.forEach((id) => {
      rowData.push(row[id] || '-');
    });

    // Total/Avg column
    const totalValue = row.total || row.avg || '-';
    rowData.push(totalValue);

    return rowData;
  });

  return [headers, ...rows];
}

// Build Downtime worksheet data
function buildDowntimeWorksheetData(data: DowntimeRow[]): any[] {
  const headers = ['Turbine', 'From', 'To', 'Duration', 'Downtime Type', 'Fault Status', 'Remarks'];

  const rows = data.map((row) => [
    row.turbineNo,
    row.from,
    row.to,
    row.duration,
    row.downtimeType,
    row.faultStatus,
    row.remarks,
  ]);

  return [headers, ...rows];
}

// Apply header styling to worksheet
function applyHeaderStyling(ws: XLSX.WorkSheet, headerRange: string): void {
  if (ws[headerRange]) {
    ws[headerRange].s = {
      fill: { fgColor: { rgb: EXCEL_COLORS.headerBg } },
      font: { bold: true, color: { rgb: EXCEL_COLORS.headerText } },
      alignment: { horizontal: 'center' },
    };
  }
}

// Apply alternating row colors
function applyRowColors(
  ws: XLSX.WorkSheet,
  dataStartRow: number,
  numRows: number,
  numCols: number,
  startCol: number,
): void {
  for (let i = 0; i < numRows; i++) {
    const rowIndex = dataStartRow + i;
    if (!ws['!rows']) ws['!rows'] = [];
    ws['!rows'][rowIndex] = { hidden: false, hpt: 18 };

    if (i % 2 === 1) {
      for (let j = 0; j < numCols; j++) {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: startCol + j });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            fill: {
              fgColor: { rgb: EXCEL_COLORS.rowAlt },
            },
          };
        }
      }
    }
  }
}

// Auto-fit column widths
function autoFitColumns(ws: XLSX.WorkSheet, data: any[][], minWidth = 8, maxWidth = 35): void {
  if (!ws['!cols']) ws['!cols'] = [];

  const colCount = data[0]?.length || 0;

  for (let col = 0; col < colCount; col++) {
    let maxLen = minWidth;
    for (let row = 0; row < data.length; row++) {
      const cellValue = data[row]?.[col];
      if (cellValue) {
        const cellLen = String(cellValue).length;
        maxLen = Math.max(maxLen, cellLen);
      }
    }
    ws['!cols'][col] = {
      wch: Math.min(maxLen + 2, maxWidth),
    };
  }
}

// Build dynamic worksheet from data
function buildWorksheetFromData(
  data: any[],
  sheetName: string,
  turbineIds: string[] = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'],
): { ws: XLSX.WorkSheet; dataArray: any[] } {
  const dataArray = buildKpiWorksheetData(data, turbineIds);
  const ws = XLSX.utils.aoa_to_sheet(dataArray);

  const headerRef = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: 0, c: dataArray[0].length - 1 },
  });

  applyHeaderStyling(ws, headerRef);
  ws['!rows'] = [{ hpt: 22 }];

  if (data.length > 0) {
    applyRowColors(ws, 1, data.length, dataArray[0].length, 0);

    // Style first column (KPI labels)
    for (let row = 1; row <= data.length; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
      if (ws[cellRef]) {
        ws[cellRef].s = { font: { bold: true }, alignment: { horizontal: 'left' } };
      }
    }

    // Style last column (total/avg)
    const lastCol = dataArray[0].length - 1;
    for (let row = 1; row <= data.length; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: lastCol });
      if (ws[cellRef]) {
        ws[cellRef].s = {
          font: { bold: true, color: { rgb: EXCEL_COLORS.primary } },
          alignment: { horizontal: 'center' },
        };
      }
    }
  }

  autoFitColumns(ws, dataArray);
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  return { ws, dataArray };
}

// Generate Excel report
export function generateExcelReport(
  metadata: ReportMetadata,
  kpiData: any[],
  downtimeData: any[] = [],
  turbineIds: string[] = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'],
): void {
  const wb = XLSX.utils.book_new();

  // ========================
  // Sheet 1: Report Data (Dynamic based on report type)
  // ========================
  const { ws: kpiWs, dataArray: kpiDataArray } = buildWorksheetFromData(
    kpiData,
    'Report Data',
    turbineIds,
  );
  XLSX.utils.book_append_sheet(wb, kpiWs, metadata.reportName || 'Report Data');

  // ========================
  // Sheet 2: Downtime Log (if data exists)
  // ========================
  if (downtimeData && downtimeData.length > 0) {
    const dtDataArray = buildDowntimeWorksheetData(downtimeData);
    const dtWs = XLSX.utils.aoa_to_sheet(dtDataArray);

    const dtHeaderRef = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 0, c: dtDataArray[0].length - 1 },
    });

    applyHeaderStyling(dtWs, dtHeaderRef);
    dtWs['!rows'] = [{ hpt: 22 }];
    applyRowColors(dtWs, 1, downtimeData.length, dtDataArray[0].length, 0);

    for (let row = 1; row <= downtimeData.length; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: 0 });
      if (dtWs[cellRef]) {
        dtWs[cellRef].s = { font: { bold: true }, alignment: { horizontal: 'left' } };
      }
    }

    autoFitColumns(dtWs, dtDataArray);
    dtWs['!freeze'] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(wb, dtWs, 'Downtime Log');
  }

  // ========================
  // Sheet 3: Report Info
  // ========================
  const infoData = [
    ['SprintPulse Wind Energy Report'],
    [],
    ['Report Name:', metadata.reportName],
    ['Turbine:', metadata.turbine],
    ['Date Range:', `${metadata.fromDate} - ${metadata.toDate}`],
    ['Generated:', metadata.generatedAt],
  ];

  const infoWs = XLSX.utils.aoa_to_sheet(infoData);
  infoWs['A1'].s = { font: { bold: true, size: 14, color: { rgb: EXCEL_COLORS.primary } } };
  infoWs['!cols'] = [{ wch: 20 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, infoWs, 'Report Info');

  // Generate filename
  const cleanReportName = metadata.reportName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const cleanFromDate = metadata.fromDate.replace(/\//g, '-');
  const cleanToDate = metadata.toDate.replace(/\//g, '-');
  const fileName = `SprintPulse_${cleanReportName}_${cleanFromDate}_to_${cleanToDate}.xlsx`;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
