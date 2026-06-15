import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ── Main container ───────────────────────────────────────────────────────
  formContainer: {
    minHeight: '100vh',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    '& .MuiFormLabel-asterisk': { color: theme.palette.error.main },
    '& .MuiInputLabel-asterisk': { color: theme.palette.error.main },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(1),
    },
  },

  // ── Section card ────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    borderLeft: '4px solid',
    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
    marginBottom: theme.spacing(2.5),
    overflow: 'hidden',
    transition: 'box-shadow 0.25s ease',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },

  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  sectionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  sectionCardTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '0.1px',
  },

  sectionCardBody: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },

  // ── Form grid ───────────────────────────────────────────────────────────
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
  },

  formGridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
  },

  // ── Toggle buttons (Type Selection: Ticket / Incident) ─────────────────
  toggleGroup: {
    display: 'inline-flex',
    borderRadius: '12px',
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },

  toggleButton: {
    padding: `${theme.spacing(1.2)} ${theme.spacing(3)}`,
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    borderRadius: 0,
    border: 'none',
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(79,70,229,0.06)',
      color: theme.palette.primary.main,
    },
    '&.active': {
      background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
    },
  },

  // ── Action buttons bar ────────────────────────────────────────────────
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    justifyContent: 'flex-end',
    flexWrap: 'wrap' as const,
    padding: theme.spacing(2.5, 3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
    '& .MuiButton-root': {
      textTransform: 'none',
      borderRadius: 10,
      padding: theme.spacing(1, 3),
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      '& .MuiButton-root': { width: '100%' },
    },
  },

  // ── Field hint text ───────────────────────────────────────────────────
  fieldHint: {
    fontSize: '0.72rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
});
