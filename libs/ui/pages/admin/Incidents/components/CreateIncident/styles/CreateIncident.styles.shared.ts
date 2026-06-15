import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ── Main container ───────────────────────────────────────────────────────
  formContainer: {
    minHeight: '100vh',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    background: 'linear-gradient(160deg, #fef2f2 0%, #fafbff 50%, #fef2f2 100%)',
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
});
