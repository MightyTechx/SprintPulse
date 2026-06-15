import type { Content, TDocumentDefinitions, DynamicContent } from 'pdfmake/interfaces';
import { PDF_COLORS, LAYOUT } from './pdf.styles';
import { buildHeader, buildKpiTable, buildDowntimeTable } from './pdf.builders';
import type { ReportMetadata, KpiRow } from '../types';

// Document styles
const styles: Record<string, any> = {
  companyName: {
    fontSize: 24,
    bold: true,
    color: PDF_COLORS.primary,
  },
  reportTitle: {
    fontSize: 12,
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
  sectionTitle: {
    fontSize: 12,
    bold: true,
    color: PDF_COLORS.primary,
  },
  headerCell: {
    fontSize: 9,
    bold: true,
    color: PDF_COLORS.white,
    alignment: 'center',
  },
  badge: {
    fontSize: 8,
    bold: true,
  },
};

// Page footer callback
const buildFooter: DynamicContent = (currentPage: number, pageCount: number): Content => {
  return {
    columns: [
      {
        text: 'SprintPulse Sprint Management System',
        fontSize: 8,
        color: PDF_COLORS.textLight,
        alignment: 'left',
        margin: [40, 0, 0, 0] as [number, number, number, number],
      },
      {
        text: `Page ${currentPage} of ${pageCount}`,
        fontSize: 8,
        color: PDF_COLORS.textLight,
        alignment: 'right',
        margin: [0, 0, 40, 0] as [number, number, number, number],
      },
    ],
  };
};

// Build document definition
function buildDocDefinition(
  metadata: ReportMetadata,
  kpiData: any[],
  downtimeData: any[],
  sprintIds: string[] = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'],
): TDocumentDefinitions {
  const content: Content[] = [buildHeader(metadata), buildKpiTable(kpiData, sprintIds)];

  // Only add downtime table if we have data
  if (downtimeData && downtimeData.length > 0) {
    content.push(buildDowntimeTable(downtimeData));
  }

  return {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: LAYOUT.pageMargins,
    content,
    styles,
    footer: buildFooter,
    header: {
      text: '',
      margin: [0, 0, 0, 0] as [number, number, number, number],
    },
    info: {
      title: `${metadata.reportName} - ${metadata.sprint}`,
      author: 'SprintPulse',
      subject: 'Sprint Report',
      keywords: 'sprint, velocity, agile, report',
    },
  };
}

// Generate filename
function generateFileName(metadata: ReportMetadata, extension: string): string {
  const cleanReportName =
    metadata.reportName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Report';
  const cleanFromDate = metadata.fromDate.replace(/\//g, '-') || '01-01-2026';
  const cleanToDate = metadata.toDate.replace(/\//g, '-') || '01-01-2026';
  return `SprintPulse_${cleanReportName}_${cleanFromDate}_to_${cleanToDate}.${extension}`;
}

// Generate PDF document
export async function generatePdfReport(
  metadata: ReportMetadata,
  kpiData: any[],
  downtimeData: any[],
  sprintIds?: string[],
): Promise<void> {
  try {
    // Dynamic import of pdfmake and its fonts
    const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
    const pdfFontsModule: any = await import('pdfmake/build/vfs_fonts');

    // Handle both default and named exports
    const pdfMake = pdfMakeModule.default || pdfMakeModule.pdfMake || pdfMakeModule;
    const vfs =
      pdfFontsModule.pdfMake?.vfs ||
      pdfFontsModule.default?.pdfMake?.vfs ||
      pdfFontsModule.default ||
      pdfFontsModule;

    // Initialize pdfmake with fonts
    if (vfs && pdfMake.addVirtualFileSystem) {
      pdfMake.addVirtualFileSystem(vfs);
    }

    // Build document
    const docDefinition = buildDocDefinition(metadata, kpiData, downtimeData, sprintIds);
    const fileName = generateFileName(metadata, 'pdf');

    // Create and download PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.download(fileName);

    console.log('PDF generated successfully:', fileName);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

// Open PDF in new tab
export async function openPdfReport(
  metadata: ReportMetadata,
  kpiData: any[],
  downtimeData: any[],
  sprintIds?: string[],
): Promise<void> {
  try {
    const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
    const pdfFontsModule: any = await import('pdfmake/build/vfs_fonts');

    const pdfMake = pdfMakeModule.default || pdfMakeModule.pdfMake || pdfMakeModule;
    const vfs =
      pdfFontsModule.pdfMake?.vfs ||
      pdfFontsModule.default?.pdfMake?.vfs ||
      pdfFontsModule.default ||
      pdfFontsModule;

    if (vfs && pdfMake.addVirtualFileSystem) {
      pdfMake.addVirtualFileSystem(vfs);
    }

    const docDefinition = buildDocDefinition(metadata, kpiData, downtimeData, sprintIds);
    pdfMake.createPdf(docDefinition).open();
  } catch (error) {
    console.error('PDF open failed:', error);
    throw error;
  }
}
