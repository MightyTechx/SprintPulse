import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      padding: theme.spacing(2),
    },
  },

  // ─── Stat Cards Grid ────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(0.75),
    },
  },

  statCard: {
    borderRadius: 12,
    padding: theme.spacing(1),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      borderRadius: '12px 12px 0 0',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0.875),
      borderRadius: 10,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.75),
      borderRadius: 8,
    },
  },

  statCard0: {
    '&::before': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(79,70,229,0.16), 0 4px 16px rgba(79,70,229,0.08)' },
  },

  statCard1: {
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(245,158,11,0.16), 0 4px 16px rgba(245,158,11,0.08)' },
  },

  statCard2: {
    '&::before': { background: 'linear-gradient(90deg, #10b981, #0d9488)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(16,185,129,0.16), 0 4px 16px rgba(16,185,129,0.08)' },
  },

  statCard3: {
    '&::before': { background: 'linear-gradient(90deg, #ef4444, #dc2626)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(239,68,68,0.16), 0 4px 16px rgba(239,68,68,0.08)' },
  },

  statCard4: {
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #2563eb)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(14,165,233,0.16), 0 4px 16px rgba(14,165,233,0.08)' },
  },

  // ─── Tabs + Search ────────────────────────────────────────────────────────
  tabsBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(1.5),
    border: '1px solid rgba(79,70,229,0.08)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '& .MuiTabs-root': {
      minHeight: 44,
    },
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: 10,
      fontWeight: 600,
      fontSize: '0.82rem',
      color: theme.palette.text.secondary,
      transition: 'all 0.22s ease',
      position: 'relative',
      '&.Mui-selected': {
        color: '#4f46e5',
        background: 'rgba(79,70,229,0.09)',
        boxShadow: '0 2px 10px rgba(79,70,229,0.14)',
      },
      '&:not(:last-of-type)::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '22%',
        height: '56%',
        width: 1,
        background: 'rgba(0,0,0,0.1)',
        borderRadius: 1,
        pointerEvents: 'none',
      },
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      borderRadius: 10,
    },
  },

  tabsSearchField: {
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    width: '240px',
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      borderRadius: 40,
      color: theme.palette.text.primary,
      transition: 'all 0.22s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(79,70,229,0.18)',
        borderRadius: 40,
      },
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid rgba(79,70,229,0.4)',
        },
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(79,70,229,0.1)',
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #4f46e5',
        },
      },
    },
    '& .MuiInputBase-input': {
      padding: '4px 4px 4px 12px',
      fontSize: '0.85rem',
      color: theme.palette.text.primary,
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 1,
      },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: 'rgba(79,70,229,0.6)',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: theme.spacing(1),
      width: '100%',
    },
  },

  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(79,70,229,0.06)',
  },

  actionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    padding: `${theme.spacing(1.5)} ${theme.spacing(0)}`,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
    },
  },
});
