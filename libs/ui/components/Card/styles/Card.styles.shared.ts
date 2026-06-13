import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  root: {
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
  },
  header: {
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  content: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  footer: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.grey[100],
  },

  // ─── Status Card Variant ─────────────────────────────────────────────────────
  'status-card': {
    borderRadius: 10,
    border: '1px solid',
    borderColor: 'divider',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)',
    },
  },

  // ─── Filter Card Variant ─────────────────────────────────────────────────────
  'filter-card': {
    borderRadius: 16,
    border: '1px solid',
    borderColor: 'primary.light',
    background: '#ffffff',
    boxShadow: '0 4px 16px rgba(99,102,241,0.1)',
    overflow: 'visible',
    transition: 'all 0.25s ease',
    '&:hover': {
      boxShadow: '0 6px 24px rgba(99,102,241,0.15)',
    },
  },

  // ─── KPI Card Variant ────────────────────────────────────────────────────────
  'kpi-card': {
    borderRadius: 14,
    border: '1px solid',
    borderColor: 'divider',
    background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(124,58,237,0.2))',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover': {
      boxShadow: '0 8px 25px -5px rgba(99,102,241,0.15)',
      transform: 'translateY(-4px)',
      borderColor: 'primary.light',
      '&::before': {
        opacity: 1,
      },
    },
  },

  // ─── GetStatus Card Variant (WOW Cards) ──────────────────────────────────────
  'getstatus-card': {
    borderRadius: 16,
    padding: 0,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      transition: 'height 0.25s ease',
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      width: 80,
      height: 80,
      borderRadius: '50%',
      opacity: 0.03,
      transition: 'all 0.35s ease',
      transform: 'translate(50%, 50%)',
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
      '&::before': {
        height: 5,
      },
      '&::after': {
        opacity: 0.06,
        transform: 'translate(25%, 25%)',
      },
    },
  },

  'getstatus-card-inner': {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative' as const,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25),
    },
  },

  'getstatus-card-top': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.75),
    },
  },

  'getstatus-card-content': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  'getstatus-card-icon-wrap': {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      width: 32,
      height: 32,
      borderRadius: 8,
    },
  },

  'getstatus-card-icon': {
    fontSize: '1.1rem !important',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.95rem !important',
    },
  },

  'getstatus-card-value': {
    fontSize: '1.6rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: theme.spacing(0.25),
    letterSpacing: '-0.02em',
    [theme.breakpoints.down('lg')]: { fontSize: '1.4rem' },
    [theme.breakpoints.down('md')]: { fontSize: '1.3rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' },
  },

  'getstatus-card-label': {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.45)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem',
      letterSpacing: '0.04em',
    },
  },

  'getstatus-card-divider': {
    height: 1,
    marginBottom: theme.spacing(0.75),
    opacity: 0.4,
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.5),
    },
  },

  'getstatus-card-footer': {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },

  'getstatus-card-sub-dot': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
    position: 'relative' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      inset: -2,
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite',
    },
    '@keyframes pulse': {
      '0%, 100%': { opacity: 0, transform: 'scale(0.8)' },
      '50%': { opacity: 0.3, transform: 'scale(1.2)' },
    },
  },

  'getstatus-card-sub': {
    fontSize: '0.72rem',
    color: 'rgba(0,0,0,0.5)',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: { fontSize: '0.65rem' },
  },

  // Color variants for getstatus cards
  'getstatus-card-0': {
    '&::before': { background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)' },
    '&::after': { background: '#6366f1' },
    '&:hover': {
      background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
    },
  },
  'getstatus-card-1': {
    '&::before': { background: 'linear-gradient(90deg, #10b981, #059669, #047857)' },
    '&::after': { background: '#10b981' },
    '&:hover': {
      background: 'linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)',
    },
  },
  'getstatus-card-2': {
    '&::before': { background: 'linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)' },
    '&::after': { background: '#ef4444' },
    '&:hover': {
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    },
  },
  'getstatus-card-3': {
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #d97706, #b45309)' },
    '&::after': { background: '#f59e0b' },
    '&:hover': {
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    },
  },
  'getstatus-card-4': {
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #0284c7, #0369a1)' },
    '&::after': { background: '#0ea5e9' },
    '&:hover': {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    },
  },
  'getstatus-card-5': {
    '&::before': { background: 'linear-gradient(90deg, #8b5cf6, #7c3aed, #6d28d9)' },
    '&::after': { background: '#8b5cf6' },
    '&:hover': {
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    },
  },
  'getstatus-card-6': {
    '&::before': { background: 'linear-gradient(90deg, #ec4899, #db2777, #be185d)' },
    '&::after': { background: '#ec4899' },
    '&:hover': {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    },
  },
  'getstatus-card-7': {
    '&::before': { background: 'linear-gradient(90deg, #14b8a6, #0d9488, #0f766e)' },
    '&::after': { background: '#14b8a6' },
    '&:hover': {
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    },
  },
});