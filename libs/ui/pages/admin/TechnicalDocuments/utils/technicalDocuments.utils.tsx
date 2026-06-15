import * as React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { Box, Column } from '@sprintpulse/component';
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

export const FOLDERS = ['Insurance', 'B2B'];

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
    fileName: 'Marine_Cargo_Policy_2026',
    folder: 'Insurance',
    type: 'PDF',
    size: '2.4 MB',
    modified: '2026-04-18',
  },
  {
    id: 2,
    fileName: 'Asset_All_Risk_Schedule',
    folder: 'Insurance',
    type: 'XLSX',
    size: '0.9 MB',
    modified: '2026-03-05',
  },
  {
    id: 3,
    fileName: 'Liability_Insurance_Certificate',
    folder: 'Insurance',
    type: 'PDF',
    size: '1.1 MB',
    modified: '2026-02-22',
  },
  {
    id: 4,
    fileName: 'Broker_Slip_Q1_2026',
    folder: 'Insurance',
    type: 'DOCX',
    size: '0.4 MB',
    modified: '2026-01-30',
  },
  {
    id: 5,
    fileName: 'Fire_Insurance_Policy',
    folder: 'Insurance',
    type: 'PDF',
    size: '1.7 MB',
    modified: '2025-12-11',
  },
  {
    id: 6,
    fileName: 'Claim_Settlement_Report_FY25',
    folder: 'Insurance',
    type: 'PDF',
    size: '3.2 MB',
    modified: '2025-11-04',
  },
  {
    id: 7,
    fileName: 'Insurance_Renewal_Tracker',
    folder: 'Insurance',
    type: 'XLSX',
    size: '0.6 MB',
    modified: '2025-09-18',
  },
  {
    id: 8,
    fileName: 'Master_Service_Agreement_Acme',
    folder: 'B2B',
    type: 'PDF',
    size: '2.1 MB',
    modified: '2026-06-02',
  },
  {
    id: 9,
    fileName: 'SOW_Phase2_Delivery',
    folder: 'B2B',
    type: 'DOCX',
    size: '0.5 MB',
    modified: '2026-05-15',
  },
  {
    id: 10,
    fileName: 'Mutual_NDA_Template_v2',
    folder: 'B2B',
    type: 'DOCX',
    size: '0.3 MB',
    modified: '2026-04-09',
  },
  {
    id: 11,
    fileName: 'Vendor_Onboarding_Form',
    folder: 'B2B',
    type: 'PDF',
    size: '0.8 MB',
    modified: '2026-02-28',
  },
  {
    id: 12,
    fileName: 'Annual_Contract_Addendum',
    folder: 'B2B',
    type: 'PDF',
    size: '1.3 MB',
    modified: '2025-12-19',
  },
  {
    id: 13,
    fileName: 'Rate_Card_2026',
    folder: 'B2B',
    type: 'XLSX',
    size: '0.7 MB',
    modified: '2025-10-22',
  },
  {
    id: 14,
    fileName: 'Partnership_MoU',
    folder: 'B2B',
    type: 'PDF',
    size: '1.5 MB',
    modified: '2025-08-14',
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
    label: 'Category',
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
