// Export utility types for PDF, Excel, and SVG generation

export interface ReportMetadata {
  reportName: string;
  turbine: string;
  fromDate: string;
  toDate: string;
  generatedAt: string;
}

export interface KpiRow {
  id: number | string;
  kpi: string;
  t01: string | number;
  t02: string | number;
  t03: string | number;
  t04: string | number;
  t05: string | number;
  t06: string | number;
  t07: string | number;
  t08: string | number;
  t09: string | number;
  t10: string | number;
  total: string | number;
}

export interface DowntimeRow {
  id: number | string;
  turbineNo: string;
  from: string;
  to: string;
  duration: string;
  downtimeType: string;
  faultStatus: string;
  remarks: string;
}

export type DocType = 'PDF' | 'Excel (XLSX)' | 'SVG';
