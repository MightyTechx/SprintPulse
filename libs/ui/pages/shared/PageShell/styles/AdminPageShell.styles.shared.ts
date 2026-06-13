import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

// Dialog-specific styles are in Configuration.styles.shared.ts
// This file re-exports them for the dialog's own useStyles hook.
export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.5) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  // ── Page header (gradient overridden per-page via sx) ────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 350,
      height: 350,
      borderRadius: '50%',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -80,
      left: '22%',
      width: 280,
      height: 280,
      borderRadius: '50%',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(2.5, 2), borderRadius: 12 },
  },

  headerOrb3: {
    position: 'absolute',
    bottom: '10%',
    right: '28%',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(251,191,36,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  pageHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: theme.spacing(1),
    },
  },

  title: {
    fontWeight: 800,
    color: '#fff',
    fontSize: '2rem',
    letterSpacing: '-0.028em',
    lineHeight: 1.18,
    textShadow: '0 2px 18px rgba(0,0,0,0.28)',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: { fontSize: '1.4rem' },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative',
    zIndex: 1,
  },

  // ── Stat cards ───────────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: { gap: theme.spacing(1.25) },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(1) },
  },

  statCard: {
    borderRadius: 16,
    padding: theme.spacing(1.5),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      borderRadius: '16px 16px 0 0',
    },
    '&:hover': { transform: 'translateY(-4px)' },
    [theme.breakpoints.down('md')]: { padding: theme.spacing(1.25), borderRadius: 14 },
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1), borderRadius: 12 },
  },

  // CustomerManagement variants (teal theme)
  statCard0: {
    '&::before': { background: 'linear-gradient(90deg, #0f766e, #14b8a6)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(15,118,110,0.16), 0 4px 16px rgba(15,118,110,0.08)' },
  },
  statCard1: {
    '&::before': { background: 'linear-gradient(90deg, #15803d, #16a34a)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(22,163,74,0.16), 0 4px 16px rgba(22,163,74,0.08)' },
  },
  statCard2: {
    '&::before': { background: 'linear-gradient(90deg, #b91c1c, #dc2626)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(185,28,28,0.16), 0 4px 16px rgba(185,28,28,0.08)' },
  },
  statCard3: {
    '&::before': { background: 'linear-gradient(90deg, #b45309, #d97706)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(180,83,9,0.16), 0 4px 16px rgba(180,83,9,0.08)' },
  },
  // CustomerApprovals extra variants (blue theme)
  statCard4: {
    '&::before': { background: 'linear-gradient(90deg, #7c3aed, #a855f7)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(124,58,237,0.16), 0 4px 16px rgba(124,58,237,0.08)' },
  },
  statCard5: {
    '&::before': { background: 'linear-gradient(90deg, #0f766e, #0ea5e9)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(15,118,110,0.16), 0 4px 16px rgba(15,118,110,0.08)' },
  },
  statCard6: {
    '&::before': { background: 'linear-gradient(90deg, #4338ca, #6366f1)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(99,102,241,0.16), 0 4px 16px rgba(99,102,241,0.08)' },
  },
  statCard7: {
    '&::before': { background: 'linear-gradient(90deg, #c2410c, #ea580c)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(234,88,12,0.16), 0 4px 16px rgba(234,88,12,0.08)' },
  },

  statCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(0.25),
    [theme.breakpoints.down('md')]: { marginBottom: theme.spacing(0.75) },
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(0.5), marginTop: 0 },
  },

  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.3s ease',
    [theme.breakpoints.down('md')]: { width: 34, height: 34, borderRadius: 8 },
    [theme.breakpoints.down('sm')]: { width: 30, height: 30, borderRadius: 8 },
  },

  statIcon: {
    fontSize: '1.2rem !important',
    [theme.breakpoints.down('md')]: { fontSize: '1.05rem !important' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.95rem !important' },
  },

  statValue: {
    fontSize: '1.8rem',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: theme.spacing(0.3),
    [theme.breakpoints.down('lg')]: { fontSize: '1.6rem' },
    [theme.breakpoints.down('md')]: { fontSize: '1.5rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '1.35rem', marginBottom: theme.spacing(0.2) },
  },

  statLabel: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'rgba(0,0,0,0.38)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.58rem', letterSpacing: '0.05em' },
  },

  statDivider: {
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(0.5) },
  },

  statSubDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 5, height: 5 },
  },

  statSub: {
    fontSize: '0.75rem',
    color: 'rgba(0,0,0,0.48)',
    fontWeight: 500,
    [theme.breakpoints.down('md')]: { fontSize: '0.68rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.6rem' },
  },

  // ── Tabs + search ─────────────────────────────────────────────────────────────
  tabsBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(1.5),
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '& .MuiTabs-root': { minHeight: 44 },
    '& .MuiTabs-scrollButtons.Mui-disabled': { opacity: 0, width: 0 },
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: 10,
      fontWeight: 600,
      fontSize: '0.82rem',
      color: theme.palette.text.secondary,
      transition: 'all 0.22s ease',
      position: 'relative',
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
    '& .MuiTabs-indicator': { display: 'none' },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      borderRadius: 10,
    },
  },

  searchField: {
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
    },
    '& .MuiInputBase-input': {
      padding: '4px 4px 4px 12px',
      fontSize: '0.85rem',
      color: theme.palette.text.primary,
      '&::placeholder': { color: theme.palette.text.secondary, opacity: 1 },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { fontSize: '1.1rem' },
    [theme.breakpoints.down('sm')]: { marginLeft: 0, marginTop: theme.spacing(1), width: '100%' },
  },

  // ── Table ────────────────────────────────────────────────────────────────────
  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
  },

  emptyState: {
    textAlign: 'center' as const,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    border: '2px dashed',
    borderRadius: 16,
    marginTop: theme.spacing(2),
    background: 'rgba(255,255,255,0.7)',
  },

  emptyIcon: {
    fontSize: '48px !important',
    marginBottom: '8px !important',
  },
});
