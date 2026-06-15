// PDF styling constants matching SprintPulse brand

export const PDF_COLORS = {
  // Primary brand colors
  primary: '#4f46e5',
  secondary: '#6366f1',
  accent: '#06b6d4',

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',

  // Text colors
  textDark: '#1e293b',
  textMuted: '#64748b',
  textLight: '#94a3b8',

  // Background colors
  white: '#ffffff',
  rowAlt: '#f8fafc',
  headerBg: '#4f46e5',

  // Border colors
  border: '#e2e8f0',
  borderDark: '#cbd5e1',
};

// Table styling for pdfmake
export const TABLE_STYLES = {
  // Header row styling
  header: {
    fillColor: PDF_COLORS.primary,
    color: PDF_COLORS.white,
    bold: true,
    fontSize: 8,
    alignment: 'center' as const,
    padding: [5, 4, 5, 4],
  },

  // First column (labels) styling
  firstCol: {
    fillColor: PDF_COLORS.white,
    color: PDF_COLORS.textDark,
    bold: true,
    fontSize: 8,
    alignment: 'left' as const,
    padding: [6, 4, 4, 4],
  },

  // Data cell styling (for KPI columns)
  dataCell: {
    fillColor: PDF_COLORS.white,
    color: PDF_COLORS.textDark,
    fontSize: 8,
    alignment: 'center' as const,
    padding: [4, 4, 4, 4],
  },

  // Alternating row styles
  rowEven: {
    fillColor: PDF_COLORS.white,
    color: PDF_COLORS.textDark,
    fontSize: 8,
    alignment: 'center' as const,
    padding: [4, 4, 4, 4],
  },

  rowOdd: {
    fillColor: PDF_COLORS.rowAlt,
    color: PDF_COLORS.textDark,
    fontSize: 8,
    alignment: 'center' as const,
    padding: [4, 4, 4, 4],
  },

  // Total column styling
  totalCol: {
    fillColor: PDF_COLORS.rowAlt,
    color: PDF_COLORS.primary,
    bold: true,
    fontSize: 8,
    alignment: 'center' as const,
    padding: [4, 4, 4, 4],
  },

  // Downtime type color mapping
  downtimeColors: {
    Planned: PDF_COLORS.info,
    Unplanned: PDF_COLORS.warning,
    Grid: PDF_COLORS.secondary,
    Environmental: PDF_COLORS.success,
    'Grid outage': PDF_COLORS.danger,
  } as Record<string, string>,
};

// Header styling for PDF
export const HEADER_STYLES = {
  companyName: {
    fontSize: 24,
    bold: true,
    color: PDF_COLORS.primary,
  },
  reportTitle: {
    fontSize: 14,
    bold: true,
    color: PDF_COLORS.textDark,
  },
  subtitle: {
    fontSize: 10,
    color: PDF_COLORS.textMuted,
  },
  dateRange: {
    fontSize: 10,
    color: PDF_COLORS.textMuted,
  },
  generatedAt: {
    fontSize: 8,
    color: PDF_COLORS.textLight,
  },
};

// Layout constants
export const LAYOUT = {
  pageMargins: [40, 70, 40, 50] as [number, number, number, number],
  headerMargin: 30,
  footerMargin: 30,
};

// Column widths for KPI table
export const KPI_COLUMN_WIDTHS = ['*', 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 55];

// Column widths for Incident (Jira-style) table - fits within landscape page
// S.No | Team | Assignee | Assigned To | Incident# | From | To | Issue | Total Hours | Status
export const DOWNTIME_COLUMN_WIDTHS = [25, 50, 60, 60, 55, 70, 70, '*', 50, 55];
