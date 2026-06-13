import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #fdf4f6 0%, #fafbff 50%, #fdf4f6 100%)',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25), pb: 10 },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  header: {
    background: 'linear-gradient(135deg, #7c2433 0%, #9b2c46 50%, #b33955 100%)',
    borderRadius: '14px 14px 0 0',
    padding: theme.spacing(2, 2.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    boxShadow: '0 4px 16px rgba(124, 36, 51, 0.3)',
  },

  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.25)',
    },
  },

  headerContent: {
    flex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },

  permitLabel: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
  },

  permitId: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },

  permitSummary: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 400,
  },

  tabs: {
    display: 'flex',
    gap: theme.spacing(3),
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },

  tab: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'none' as const,
    padding: theme.spacing(0.5, 1),
    minHeight: 'auto',
    '&.Mui-selected': {
      color: '#ffffff',
    },
  },

  tabIndicator: {
    backgroundColor: '#ffffff',
    height: 2,
    borderRadius: 1,
  },

  contentSection: {
    background: '#ffffff',
    borderRadius: '0 0 14px 14px',
    border: '1px solid #e8eaf0',
    borderTop: 'none',
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },

  sectionTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
    borderBottom: '2px solid #7c2433',
    display: 'inline-block',
  },

  fieldRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1.5, 3),
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderBottom: '1px solid #f1f5f9',
    '&:last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gap: theme.spacing(0.75, 0),
    },
  },

  fieldLabel: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
  },

  fieldValue: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },

  fieldValueLink: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#2563eb',
    cursor: 'pointer',
    '&:hover': {
      color: '#4f46e5',
      textDecoration: 'underline',
    },
  },

  ppeChip: {
    fontSize: '0.7rem',
    fontWeight: 500,
    height: 22,
    background: 'rgba(124, 36, 51, 0.08)',
    border: '1px solid rgba(124, 36, 51, 0.2)',
    color: '#7c2433',
  },

  yesNoChip: {
    fontSize: '0.72rem',
    fontWeight: 600,
    height: 22,
    borderRadius: '4px',
  },

  yesChip: {
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#059669',
  },

  noChip: {
    background: 'rgba(100, 116, 139, 0.12)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    color: '#64748b',
  },

  naChip: {
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#d97706',
  },

  actionsButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'none' as const,
    borderRadius: '10px',
    padding: theme.spacing(1.25, 2),
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
    },
  },

  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#ffffff',
    borderTop: '1px solid #e8eaf0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: theme.spacing(1, 0),
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
    zIndex: 100,
  },

  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.25),
    cursor: 'pointer',
    padding: theme.spacing(0.5, 1),
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04)',
    },
  },

  navItemActive: {
    color: '#2563eb',
  },

  navLabel: {
    fontSize: '0.65rem',
    fontWeight: 500,
    color: '#64748b',
  },

  navLabelActive: {
    color: '#2563eb',
    fontWeight: 600,
  },

  closeButton: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.25)',
    },
  },
});
