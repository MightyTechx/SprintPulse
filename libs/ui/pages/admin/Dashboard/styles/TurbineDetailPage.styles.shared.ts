import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getTurbineDetailBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  // ─── Hero Header ─────────────────────────────────────────────────────────────
  heroHeader: {
    marginBottom: theme.spacing(2.5),
    background: '#ffffff',
    borderRadius: 14,
    padding: theme.spacing(2, 3),
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: theme.spacing(2),
    border: '1px solid #e8eaf0',
    borderLeft: '4px solid #4f46e5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(99,102,241,0.07)',
    position: 'relative' as const,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'stretch' as const,
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
      borderLeft: '3px solid #4f46e5',
      paddingRight: theme.spacing(4),
    },
  },

  heroLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.75),
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row' as const,
      justifyContent: 'flex-start',
      gap: theme.spacing(1),
    },
  },

  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { fontSize: 24, color: '#fff' },
    [theme.breakpoints.down('sm')]: {
      width: 42,
      height: 42,
      borderRadius: '10px',
      '& svg': { fontSize: 20 },
    },
  },

  heroTitleText: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#1e293b',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },

  heroSubtitle: {
    fontSize: '0.72rem',
    color: '#64748b',
    fontWeight: 500,
    marginTop: '2px',
  },

  heroCenter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  heroCenterTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#4f46e5',
    letterSpacing: '0.2em',
    lineHeight: 1,
  },

  heroCenterBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    background: 'rgba(16,185,129,0.07)',
    border: '1px solid rgba(16,185,129,0.22)',
    borderRadius: '20px',
    paddingLeft: theme.spacing(1.1),
    paddingRight: theme.spacing(1.1),
    paddingTop: '3px',
    paddingBottom: '3px',
  },

  heroCenterDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#10b981',
    flexShrink: 0,
    animation: 'livePulse 2s ease-in-out infinite',
  },

  heroCenterLive: {
    fontSize: '0.58rem',
    fontWeight: 700,
    color: '#10b981',
    letterSpacing: '0.12em',
    lineHeight: 1,
  },

  heroRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  statusChip: {
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
  },

  // ─── Stats Row (Metric Cards - Dashboard Style) ─────────────────────────────
  statsRowContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-start',
    },
  },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: theme.spacing(1.5),
    width: '100%',
    maxWidth: 1400,
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: 'repeat(7, 1fr)',
      maxWidth: '100%',
    },
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      maxWidth: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.25),
    borderRadius: 10,
    border: '1px solid #e8eaf0',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.75, 1),
      gap: theme.spacing(0.75),
      borderRadius: 8,
    },
  },

  statCardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { fontSize: '14px !important' },
    [theme.breakpoints.down('sm')]: {
      width: 28,
      height: 28,
      borderRadius: 5,
      '& svg': { fontSize: '12px !important' },
    },
  },

  statCardValue: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums' as const,
    [theme.breakpoints.only('sm')]: {
      fontSize: '11px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },

  statCardLabel: {
    fontSize: '9px',
    fontWeight: 500,
    color: '#64748b',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '8px',
    },
  },

  // ─── Section Card ────────────────────────────────────────────────────────────
  sectionCard: {
    borderRadius: 14,
    border: '1px solid #e8eaf0',
    background: '#ffffff',
    overflow: 'hidden',
    marginBottom: theme.spacing(2.5),
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(99,102,241,0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
  },

  sectionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 2.5),
    borderBottom: '1px solid #e8eaf0',
    background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(124,58,237,0.03) 100%)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5, 2),
      gap: theme.spacing(1.5),
    },
  },

  sectionCardIcon: {
    width: 44,
    height: 44,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { fontSize: 22, color: '#fff' },
    [theme.breakpoints.down('sm')]: {
      width: 38,
      height: 38,
      borderRadius: '10px',
      '& svg': { fontSize: 18 },
    },
  },

  sectionCardTitle: {
    fontWeight: 800,
    fontSize: '1rem',
    color: 'text.primary',
    letterSpacing: '-0.01em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
  },

  sectionCardSubtitle: {
    fontSize: '0.72rem',
    color: 'text.secondary',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
    },
  },

  sectionCardContent: {
    padding: theme.spacing(2, 2.5),
    [theme.breakpoints.down('sm')]: {
      padding: '4px',
    },
  },

  // ─── Grid Layouts for Sections ───────────────────────────────────────────────
  sectionGrid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  sectionGrid5: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  sectionGrid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  sectionGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  // ─── Mini Param ──────────────────────────────────────────────────────────────
  miniParam: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 1.25),
    borderRadius: 10,
    border: '1px solid #e8eaf0',
    background: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.75),
      gap: theme.spacing(0.75),
      borderRadius: 8,
    },
  },

  miniParamIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { fontSize: '14px !important' },
    [theme.breakpoints.down('sm')]: {
      width: 28,
      height: 28,
      borderRadius: 5,
      '& svg': { fontSize: '12px !important' },
    },
  },

  miniParamValue: {
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums' as const,
    [theme.breakpoints.only('sm')]: {
      fontSize: '11px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },

  miniParamLabel: {
    fontSize: '9px',
    fontWeight: 500,
    color: 'text.secondary',
    lineHeight: 1.2,
    [theme.breakpoints.only('sm')]: {
      fontSize: '8px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '7px',
    },
  },

  miniParamUnit: {
    fontSize: '8px',
    color: 'text.disabled',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '7px',
    },
  },

  miniParamAlertDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },

  // ─── Legend ──────────────────────────────────────────────────────────────────
  legendRow: {
    display: 'flex',
    gap: theme.spacing(3),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    borderTop: '1px solid',
    borderColor: 'divider',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2),
    },
  },

  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },

  legendText: {
    fontSize: '0.72rem',
    color: 'text.secondary',
    textTransform: 'capitalize' as const,
    fontWeight: 500,
  },
});
