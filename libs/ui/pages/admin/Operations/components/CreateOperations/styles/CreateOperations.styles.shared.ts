import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ── Main container ────────────────────────────────────────────────────────
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

  // ── Hero header (no page header, own hero) ─────────────────────────────────
  heroHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2.5),
    padding: theme.spacing(3.5, 4),
    borderRadius: 20,
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #1e3a6b 0%, #2d4a8a 50%, #1e3a6b 100%)',
    boxShadow: '0 8px 32px rgba(30,58,107,0.35)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: -60,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: -40,
      left: 100,
      width: 140,
      height: 140,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2),
      borderRadius: 14,
      gap: theme.spacing(1.5),
    },
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative' as const,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      width: 46,
      height: 46,
      borderRadius: 12,
    },
  },

  heroTitle: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.5rem',
    letterSpacing: '-0.3px',
    position: 'relative' as const,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: { fontSize: '1.15rem' },
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.82rem',
    marginTop: theme.spacing(0.5),
    position: 'relative' as const,
    zIndex: 1,
  },

  heroMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    flexWrap: 'wrap' as const,
    position: 'relative' as const,
    zIndex: 1,
  },

  // ── Section card ──────────────────────────────────────────────────────────
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

  // ── Form grid ─────────────────────────────────────────────────────────────
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

  // ── Toggle buttons ───────────────────────────────────────────────────────
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

  // ── Chip styles ───────────────────────────────────────────────────────────
  chipSelected: {
    background: 'rgba(79,70,229,0.1)',
    color: '#4f46e5',
    fontWeight: 600,
  },

  // ── Action buttons bar ───────────────────────────────────────────────────
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

  // ── Checklist items ──────────────────────────────────────────────────────
  checklistRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    borderRadius: 12,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1.5),
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 2px 8px rgba(79,70,229,0.08)',
    },
  },

  checklistLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    fontSize: '0.88rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  checklistIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(79,70,229,0.08)',
  },

  // ── Info chip ────────────────────────────────────────────────────────────
  infoChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: '0.72rem',
    fontWeight: 600,
  },
});
