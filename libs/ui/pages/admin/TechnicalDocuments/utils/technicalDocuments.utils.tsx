import * as React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Column } from '@infygen/component';
import { Typography, Chip, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FolderIcon from '@mui/icons-material/Folder';

// ─── Types ──────────────────────────────────────────────────────────────────────────

export type DocType = 'PDF' | 'XLSX' | 'DOCX' | 'DWG' | 'PNG' | 'SVG';

export interface DocumentRow {
  id: number;
  fileName: string;
  folder: string;
  type: DocType;
  size: string;
  modified: string;
}

export interface TypeConfig {
  bg: string;
  color: string;
  border: string;
  icon: React.ReactElement;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

export const FOLDERS = [
  'Operation Manuals',
  'Maintenance Guides',
  'Electrical Schematics',
  'Safety Procedures',
  'Inspection Reports',
  'Certifications',
];

export const DOC_TYPES_LIST: DocType[] = ['PDF', 'XLSX', 'DOCX', 'DWG', 'PNG', 'SVG'];

export const TYPE_CONFIG: Record<DocType, TypeConfig> = {
  PDF: {
    bg: 'rgba(239,68,68,0.1)',
    color: '#dc2626',
    border: 'rgba(239,68,68,0.35)',
    icon: <PictureAsPdfIcon sx={{ fontSize: 14 }} />,
  },
  XLSX: {
    bg: 'rgba(16,185,129,0.1)',
    color: '#059669',
    border: 'rgba(16,185,129,0.35)',
    icon: <TableChartIcon sx={{ fontSize: 14 }} />,
  },
  DOCX: {
    bg: 'rgba(14,165,233,0.1)',
    color: '#0284c7',
    border: 'rgba(14,165,233,0.35)',
    icon: <ArticleIcon sx={{ fontSize: 14 }} />,
  },
  DWG: {
    bg: 'rgba(245,158,11,0.1)',
    color: '#d97706',
    border: 'rgba(245,158,11,0.35)',
    icon: <InsertDriveFileIcon sx={{ fontSize: 14 }} />,
  },
  PNG: {
    bg: 'rgba(124,58,237,0.1)',
    color: '#7c3aed',
    border: 'rgba(124,58,237,0.35)',
    icon: <ImageIcon sx={{ fontSize: 14 }} />,
  },
  SVG: {
    bg: 'rgba(13,148,136,0.1)',
    color: '#0d9488',
    border: 'rgba(13,148,136,0.35)',
    icon: <InsertDriveFileIcon sx={{ fontSize: 14 }} />,
  },
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────

export const DOCUMENTS: DocumentRow[] = [
  {
    id: 1,
    fileName: 'WTG_Operation_Manual_v3.2',
    folder: 'Operation Manuals',
    type: 'PDF',
    size: '4.8 MB',
    modified: '2025-11-12',
  },
  {
    id: 2,
    fileName: 'Turbine_Maintenance_Schedule',
    folder: 'Maintenance Guides',
    type: 'XLSX',
    size: '1.2 MB',
    modified: '2025-10-05',
  },
  {
    id: 3,
    fileName: 'Gearbox_Overhaul_Procedure',
    folder: 'Maintenance Guides',
    type: 'PDF',
    size: '6.1 MB',
    modified: '2025-09-20',
  },
  {
    id: 4,
    fileName: 'Electrical_Single_Line_Diagram',
    folder: 'Electrical Schematics',
    type: 'DWG',
    size: '2.7 MB',
    modified: '2025-08-14',
  },
  {
    id: 5,
    fileName: 'Control_Panel_Wiring_Layout',
    folder: 'Electrical Schematics',
    type: 'DWG',
    size: '3.3 MB',
    modified: '2025-07-30',
  },
  {
    id: 6,
    fileName: 'Emergency_Shutdown_Protocol',
    folder: 'Safety Procedures',
    type: 'PDF',
    size: '0.9 MB',
    modified: '2025-11-01',
  },
  {
    id: 7,
    fileName: 'Hot_Work_Permit_Template',
    folder: 'Safety Procedures',
    type: 'DOCX',
    size: '0.3 MB',
    modified: '2025-10-18',
  },
  {
    id: 8,
    fileName: 'Turbine_Foundation_Inspection',
    folder: 'Inspection Reports',
    type: 'PDF',
    size: '8.2 MB',
    modified: '2025-09-10',
  },
  {
    id: 9,
    fileName: 'Annual_Audit_Report_2024',
    folder: 'Inspection Reports',
    type: 'PDF',
    size: '12.5 MB',
    modified: '2025-06-15',
  },
  {
    id: 10,
    fileName: 'Blade_Repair_Visual_Guide',
    folder: 'Maintenance Guides',
    type: 'PNG',
    size: '5.4 MB',
    modified: '2025-08-25',
  },
  {
    id: 11,
    fileName: 'Grid_Connection_Agreement',
    folder: 'Certifications',
    type: 'PDF',
    size: '1.8 MB',
    modified: '2025-05-20',
  },
  {
    id: 12,
    fileName: 'IEC_Wind_Turbine_Compliance',
    folder: 'Certifications',
    type: 'PDF',
    size: '3.2 MB',
    modified: '2025-04-12',
  },
  {
    id: 13,
    fileName: 'SCADA_User_Guide_v2',
    folder: 'Operation Manuals',
    type: 'PDF',
    size: '3.9 MB',
    modified: '2025-06-03',
  },
  {
    id: 14,
    fileName: 'Converter_Schematic_R4',
    folder: 'Electrical Schematics',
    type: 'SVG',
    size: '0.6 MB',
    modified: '2025-03-19',
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────────

export const getDocumentById = (id: number): DocumentRow | undefined => {
  return DOCUMENTS.find((doc) => doc.id === id);
};

export const getDocumentsByFolder = (folder: string): DocumentRow[] => {
  return DOCUMENTS.filter((doc) => doc.folder === folder);
};

export const getDocumentsByType = (type: DocType): DocumentRow[] => {
  return DOCUMENTS.filter((doc) => doc.type === type);
};

// ─── Style Constants ──────────────────────────────────────────────────────────

export const FOLDER_SX = {
  width: 240,
  flexShrink: 0,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': { borderColor: '#0d9488' },
    '&.Mui-focused fieldset': { borderColor: '#0d9488', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0d9488' },
  '@media (max-width:600px)': {
    width: '100%',
    flexBasis: '100%',
  },
} as const;

export const TYPE_SX = {
  width: 240,
  flexShrink: 0,
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': { borderColor: '#0d9488' },
    '&.Mui-focused fieldset': { borderColor: '#0d9488', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0d9488' },
  '@media (max-width:600px)': {
    width: '100%',
    flexBasis: '100%',
  },
} as const;

export function formatModified(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Columns ─────────────────────────────────────────────────────────────────

export const columns: Column<DocumentRow>[] = [
  {
    id: 'fileName',
    label: 'File Name',
    minWidth: 240,
    sortable: true,
    align: 'center',
    format: (v) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
        <InsertDriveFileIcon sx={{ fontSize: 16, color: '#0d9488', flexShrink: 0 }} />
        <Typography
          sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', textAlign: 'left' }}
        >
          {String(v)}
        </Typography>
      </Box>
    ),
  },
  {
    id: 'folder',
    label: 'Folder',
    minWidth: 180,
    sortable: true,
    align: 'center',
    format: (v) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'center' }}>
        <FolderIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0 }} />
        <Typography sx={{ fontSize: '0.83rem', color: '#475569' }}>{String(v)}</Typography>
      </Box>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    minWidth: 90,
    sortable: true,
    align: 'center',
    format: (v) => {
      const type = v as DocType;
      const cfg = TYPE_CONFIG[type] ?? {
        bg: 'rgba(100,116,139,0.1)',
        color: '#475569',
        border: 'rgba(100,116,139,0.3)',
        icon: <InsertDriveFileIcon sx={{ fontSize: 14 }} />,
      };
      return (
        <Chip
          icon={cfg.icon}
          label={type}
          size='small'
          sx={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            fontWeight: 700,
            fontSize: '0.72rem',
            height: 24,
            '& .MuiChip-icon': { color: cfg.color, marginLeft: '6px' },
          }}
        />
      );
    },
  },
  {
    id: 'size',
    label: 'Size',
    minWidth: 90,
    sortable: true,
    align: 'center',
    format: (v) => (
      <Typography
        sx={{ fontSize: '0.83rem', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}
      >
        {String(v)}
      </Typography>
    ),
  },
  {
    id: 'modified',
    label: 'Modified',
    minWidth: 120,
    sortable: true,
    align: 'center',
    format: (v) => (
      <Typography sx={{ fontSize: '0.83rem', color: '#64748b' }}>
        {formatModified(String(v))}
      </Typography>
    ),
  },
  {
    id: 'id',
    label: 'Download',
    minWidth: 90,
    sortable: false,
    align: 'center',
    format: (_v, row) => (
      <Tooltip title={`Download ${row.fileName}`} placement='left'>
        <IconButton
          size='small'
          sx={{
            color: '#0d9488',
            '&:hover': { background: 'rgba(13,148,136,0.1)' },
          }}
        >
          <DownloadIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    ),
  },
];
