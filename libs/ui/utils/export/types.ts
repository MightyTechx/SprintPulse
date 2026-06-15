// Export utility types for PDF, Excel, and SVG generation

export interface ReportMetadata {
  reportName: string;
  sprint: string;
  fromDate: string;
  toDate: string;
  generatedAt: string;
}

export interface KpiRow {
  id: number | string;
  kpi: string;
  s01: string | number;
  s02: string | number;
  s03: string | number;
  s04: string | number;
  s05: string | number;
  s06: string | number;
  s07: string | number;
  s08: string | number;
  s09: string | number;
  s10: string | number;
  total: string | number;
}

export interface IncidentRow {
  id: number | string;
  team: string;
  assignee: string;
  assignedTo: string;
  incidentNumber: string;
  fromDate: string;
  toDate: string;
  issue: string;
  totalHours: string;
  status: string;
}

export type DocType = 'PDF' | 'Excel (XLSX)' | 'SVG';
