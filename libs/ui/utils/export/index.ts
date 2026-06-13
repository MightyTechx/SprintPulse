// Export utilities - Main entry point
// Re-exports all generation functions for easy importing

export * from './types';
export { generatePdfReport, openPdfReport } from './pdf/pdf.generator';
export { generateExcelReport } from './excel/excel.generator';
export { generateSvgExport, exportChartSvg } from './svg/svg.generator';

// Utility to generate filename based on metadata
export function generateFileName(
  prefix: string,
  reportName: string,
  fromDate: string,
  extension: string,
): string {
  const cleanDate = fromDate.replace(/\//g, '-');
  const cleanName = reportName.replace(/\s+/g, '_');
  return `${prefix}_${cleanName}_${cleanDate}.${extension}`;
}
