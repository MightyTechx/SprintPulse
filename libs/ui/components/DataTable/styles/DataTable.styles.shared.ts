import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  toolbarSelected: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    backgroundColor: theme.palette.action.selected,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  title: {
    flex: '1 1 100%',
  },
  searchField: {
    marginRight: theme.spacing(2),
    minWidth: 200,
  },
  tableContainer: {
    maxHeight: 'calc(100vh - 300px)',
  },
  tableCell: {
    minWidth: 'inherit',
    backgroundColor: '#1e429f',
    color: '#ffffff',
    padding: '10px 6px',
    fontWeight: 600,
    fontSize: '0.72rem',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
    justifyContent: 'center',
    '& .MuiTableSortLabel-root': {
      color: '#ffffff',
      fontSize: '0.72rem',
      fontWeight: 600,
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    '& .MuiTableSortLabel-root:hover': {
      color: '#e0e7ff',
    },
    '& .MuiTableSortLabel-root.Mui-active': {
      color: '#ffffff',
    },
    '& .MuiTableSortLabel-icon': {
      color: '#ffffff !important',
    },
    '& .MuiTableCell-root': {
      textAlign: 'center',
    },
  },
  clickableRow: {
    cursor: 'pointer',
    transition: 'background 0.25s ease, border-left 0.25s ease',
    '& .MuiTableCell-root': {
      textAlign: 'center',
    },
  },
  defaultRow: {
    cursor: 'default',
    transition: 'background 0.25s ease',
    '& .MuiTableCell-root': {
      textAlign: 'center',
    },
  },
  highlightedRow: {
    cursor: 'pointer',
    background:
      'linear-gradient(90deg, rgba(30,66,159,0.14) 0%, rgba(59,91,219,0.07) 50%, transparent 100%) !important',
    borderLeft: '4px solid #1e429f',
    boxShadow: 'inset 5px 0 10px rgba(30,66,159,0.12)',
    '& .MuiTableCell-root': {
      textAlign: 'center',
      fontWeight: 600,
    },
  },
  emptyCell: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    textAlign: 'center',
  },
});