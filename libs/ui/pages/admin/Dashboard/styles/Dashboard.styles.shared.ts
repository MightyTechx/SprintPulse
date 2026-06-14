import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25), pb: 8 },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

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
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'stretch' as const,
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
      borderLeft: '3px solid #4f46e5',
    },
  },

  heroLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.75),
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      order: 0,
      flexDirection: 'row' as const,
      justifyContent: 'center',
      gap: theme.spacing(1),
    },
  },

  heroAvatar: {
    width: 46,
    height: 46,
    fontSize: '1rem',
    fontWeight: 700,
    flexShrink: 0,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    boxShadow: '0 2px 8px rgba(79,70,229,0.35)',
    [theme.breakpoints.down('sm')]: { width: 36, height: 36, fontSize: '0.8rem' },
  },

  heroGreeting: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: '#94a3b8',
    letterSpacing: '0.02em',
    lineHeight: 1,
    marginBottom: theme.spacing(0.4),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      marginBottom: theme.spacing(0.2),
    },
  },

  heroTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: { fontSize: '0.9rem' },
  },

  heroCenter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing(0.6),
    [theme.breakpoints.down('sm')]: {
      order: 2,
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(0.5),
      paddingTop: theme.spacing(1),
      borderTop: '1px solid #e8eaf0',
      marginTop: theme.spacing(0.5),
    },
  },

  /* ── Mobile only center (hidden - use heroCenter instead) ── */
  heroCenterMobile: { display: 'none' },
  heroCenterMobileTitle: {},
  heroCenterMobileBadge: {},
  heroCenterMobileDot: {},
  heroCenterMobileLive: {},

  heroCenterTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#4f46e5',
    letterSpacing: '0.2em',
    lineHeight: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
      letterSpacing: '0.15em',
    },
  },

  heroCenterBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    background: 'rgba(16,185,129,0.07)',
    border: '1px solid rgba(16,185,129,0.22)',
    borderRadius: '20px',
    paddingLeft: theme.spacing(1.1),
    paddingRight: theme.spacing(1.1),
    paddingTop: '3px',
    paddingBottom: '3px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(0.8),
      paddingRight: theme.spacing(0.8),
      paddingTop: '2px',
      paddingBottom: '2px',
    },
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
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.5rem',
      letterSpacing: '0.08em',
    },
  },

  heroCenterSub: {
    fontSize: '0.63rem',
    fontWeight: 500,
    color: '#64748b',
    lineHeight: 1,
  },

  heroCenterFacilities: {
    fontSize: '0.58rem',
    fontWeight: 400,
    color: '#94a3b8',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    marginTop: theme.spacing(0.15),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.5rem',
      whiteSpace: 'normal' as const,
      textAlign: 'center',
    },
  },

  heroRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      order: 1,
      justifyContent: 'center',
      paddingTop: theme.spacing(1),
      borderTop: '1px solid #e8eaf0',
      marginTop: theme.spacing(0.5),
    },
  },

  heroClockWidget: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: theme.spacing(0.35),
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
    },
  },

  heroClockRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(0.6),
  },

  heroClockHM: {
    fontFamily: 'Orbitron, monospace',
    fontSize: '1.55rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '0.03em',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '1.2rem' },
  },

  heroClockSec: {
    fontFamily: 'Orbitron, monospace',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#94a3b8',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums' as const,
    paddingBottom: '2px',
  },

  heroClockDate: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: '#475569',
    letterSpacing: '0.01em',
    textAlign: 'right' as const,
    [theme.breakpoints.down('sm')]: { textAlign: 'left' as const },
  },

  heroClockTz: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
    paddingTop: '3px',
    paddingBottom: '3px',
    marginTop: theme.spacing(0.25),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.9),
      paddingRight: theme.spacing(0.9),
      paddingTop: '2px',
      paddingBottom: '2px',
      marginTop: theme.spacing(0.5),
    },
  },

  heroClockTzDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#10b981',
    flexShrink: 0,
    animation: 'livePulse 2s ease-in-out infinite',
  },

  heroClockTzText: {
    fontSize: '0.63rem',
    fontWeight: 500,
    color: '#64748b',
    whiteSpace: 'nowrap' as const,
  },

  // Stats Row
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  // Stats Row Incentive - for Incentive Report table header
  statsRowIncentive: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2.5),
    background: 'linear-gradient(135deg, rgba(74,222,128,0.04) 0%, rgba(16,185,129,0.02) 100%)',
    borderBottom: '1px solid rgba(16,185,129,0.1)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1),
    },
  },

  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.25, 1.5),
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
      padding: theme.spacing(1, 1.25),
      gap: theme.spacing(1),
      borderRadius: 8,
    },
  },

  statCardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  statCardValue: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#1e293b',
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums' as const,
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
    },
  },

  statCardLabel: {
    fontSize: '0.65rem',
    fontWeight: 500,
    color: '#64748b',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem',
    },
  },

  // Table
  tablePaper: {
    borderRadius: 14,
    border: '1px solid #e8eaf0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(99,102,241,0.06)',
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    p: theme.spacing(2, 2.5),
    borderBottom: '1px solid #e8eaf0',
    background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(124,58,237,0.03) 100%)',
  },

  tableTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  tableTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1e293b',
  },

  tableStatsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },

  tableStatText: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: '#64748b',
  },

  // ─── Toolbar / View Toggle ───────────────────────────────────────────────────
  tableToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    background: '#fff',
    borderRadius: 14,
    border: '1px solid #e8eaf0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    flexWrap: 'wrap' as const,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
      padding: theme.spacing(1, 1.25),
      width: '100%',
    },
  },

  viewToggleGroup: {
    display: 'flex',
    gap: theme.spacing(1),
    flexShrink: 0,
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(0.75),
    },
  },

  chartDatePicker: {
    width: 165,
    flexShrink: 0,
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.82rem',
      borderRadius: '8px',
      '& fieldset': { borderColor: 'rgba(13,148,136,0.3)' },
      '&:hover fieldset': { borderColor: '#0d9488' },
      '&.Mui-focused fieldset': { borderColor: '#0d9488', borderWidth: '2px' },
    },
    '& .MuiInputBase-input': { padding: '4px 8px', fontSize: '0.82rem' },
  },

  toolbarSearch: {
    marginLeft: 'auto',
    width: 220,
    flexShrink: 0,
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      borderRadius: 40,
      transition: 'all 0.22s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(79,70,229,0.18)',
        borderRadius: 40,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid rgba(79,70,229,0.4)' },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(79,70,229,0.1)',
        '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4f46e5' },
      },
    },
    '& .MuiInputBase-input': {
      padding: '4px 4px 4px 12px',
      '&::placeholder': { color: '#94a3b8', opacity: 1 },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: 'rgba(79,70,229,0.5)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      marginTop: theme.spacing(0.75),
    },
  },

  // ─── Chart Card ──────────────────────────────────────────────────────────────
  chartCard: {
    borderRadius: 18,
    border: '1px solid rgba(249,115,22,0.15)',
    background: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 30px -5px rgba(249,115,22,0.12)',
    overflow: 'hidden',
    position: 'relative' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'linear-gradient(90deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
    },
  },

  chartCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2.5, 3),
    borderBottom: '1px solid rgba(249,115,22,0.08)',
    background:
      'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,250,245,1) 50%, rgba(255,245,240,1) 100%)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 1.5,
      p: theme.spacing(2, 2.5),
    },
  },

  chartCardBody: {
    padding: theme.spacing(2.5, 3, 3),
    background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,250,245,0.5) 100%)',
    borderTop: '1px solid rgba(249,115,22,0.05)',
  },

  // ─── Analytics Filter Panel ──────────────────────────────────────────────────
  filterPanel: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(2),
    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,252,248,1) 100%)',
    borderRadius: 16,
    p: theme.spacing(2, 2.5),
    mb: 2.5,
    border: '1px solid rgba(249,115,22,0.12)',
    borderLeft: '4px solid #f97316',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03), 0 8px 20px -4px rgba(249,115,22,0.08)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.15), transparent)',
    },
  },

  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mr: 1,
  },

  filterLabelBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    pr: 1.5,
    borderRight: '1px solid rgba(249,115,22,0.12)',
  },

  filterLabelIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
  },

  filterLabelText: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#c2410c',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  },

  filterDivider: {
    borderColor: 'rgba(249,115,22,0.15)',
    mx: 0.5,
    my: 0,
    height: 32,
  },

  filterChip: {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(236,72,153,0.08))',
    color: '#c2410c',
    fontWeight: 600,
    fontSize: '0.72rem',
    border: '1px solid rgba(249,115,22,0.2)',
    height: 26,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },

  filterFieldsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(2),
    flex: 1,
    alignItems: 'center',
  },

  filterAutocomplete: {
    width: 240,
  },

  filterRangeChip: {
    ml: 'auto',
  },

  // ─── Form Controls in Filter Panel ───────────────────────────────────────────
  formControl: {
    width: 160,
    '& .MuiOutlinedInput-root': {
      height: '38px',
      fontSize: '0.82rem',
      borderRadius: 10,
      background: '#ffffff',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(249,115,22,0.08)',
      '& fieldset': {
        borderColor: 'rgba(249,115,22,0.15)',
        borderWidth: '1px',
        transition: 'all 0.2s ease',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(249,115,22,0.35)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#f97316',
        borderWidth: '2px',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 4px rgba(249,115,22,0.1)',
        background: '#ffffff',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.8rem',
      fontWeight: 500,
      color: '#64748b',
      '&.Mui-focused': {
        color: '#c2410c',
        fontWeight: 600,
      },
    },
    '& .MuiSelect-select': {
      py: '8px',
    },
  },

  menuItemBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },

  menuItemText: {
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#475569',
  },

  // ─── Autocomplete Dropdown ───────────────────────────────────────────────────
  autocompleteOption: {
    py: '8px !important',
    px: '12px !important',
    display: 'flex !important',
    alignItems: 'center !important',
    gap: '8px !important',
    borderRadius: 6,
    mx: '4px !important',
    '&:hover': {
      background:
        'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(236,72,153,0.04)) !important',
    },
    '&.Mui-selected': {
      background:
        'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(236,72,153,0.06)) !important',
      '&:hover': {
        background:
          'linear-gradient(135deg, rgba(249,115,22,0.16), rgba(236,72,153,0.08)) !important',
      },
    },
  },

  autocompleteSelectAllText: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#f97316',
    letterSpacing: '0.02em',
  },

  autocompleteOptionText: {
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#475569',
  },

  autocompleteTags: {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(236,72,153,0.1))',
    border: '1px solid rgba(249,115,22,0.25)',
    color: '#c2410c',
    fontWeight: 600,
    fontSize: '0.72rem',
    height: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    '& .MuiChip-label': {
      px: 1.25,
    },
    '& .MuiChip-deleteIcon': {
      color: '#c2410c',
      '&:hover': {
        color: '#ea580c',
      },
    },
  },

  // ─── KPI Card ────────────────────────────────────────────────────────────────
  kpiCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    mb: 3,
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },

  kpiCard: {
    borderRadius: 14,
    border: '1px solid rgba(249,115,22,0.12)',
    p: 2,
    background: 'linear-gradient(145deg, #ffffff 0%, rgba(255,252,248,1) 100%)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      background: 'linear-gradient(90deg, rgba(249,115,22,0.3), rgba(236,72,153,0.2))',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover': {
      boxShadow: '0 8px 25px -5px rgba(249,115,22,0.18), 0 4px 10px -2px rgba(0,0,0,0.04)',
      transform: 'translateY(-4px)',
      borderColor: 'rgba(249,115,22,0.25)',
      '&::before': {
        opacity: 1,
      },
    },
  },

  kpiCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1.25,
  },

  kpiCardLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },

  kpiCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(236,72,153,0.06))',
    border: '1px solid rgba(249,115,22,0.12)',
  },

  kpiCardValue: {
    fontSize: '1.2rem',
    fontWeight: 800,
    lineHeight: 1.1,
    mb: 0.5,
    fontVariantNumeric: 'tabular-nums' as const,
    letterSpacing: '-0.02em',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.4rem',
    },
  },

  kpiCardSub: {
    fontSize: '0.68rem',
    color: '#94a3b8',
    fontWeight: 500,
  },

  // ─── Chart Card Header Elements ─────────────────────────────────────────────
  chartHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },

  chartHeaderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
    flexShrink: 0,
  },

  chartHeaderTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '-0.01em',
  },

  chartHeaderSubtitle: {
    fontSize: '0.75rem',
    color: '#64748b',
    mt: 0.3,
    fontWeight: 500,
  },

  chartHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  chartTypeChip: {
    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(236,72,153,0.08))',
    border: '1px solid rgba(249,115,22,0.22)',
    color: '#c2410c',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 28,
    px: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    '& .MuiChip-icon': {
      color: '#f97316',
      ml: 0.5,
    },
  },

  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(236,72,153,0.05))',
    borderRadius: 8,
    px: 1.5,
    py: 0.625,
    border: '1px solid rgba(249,115,22,0.18)',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    boxShadow: '0 0 8px rgba(16,185,129,0.5)',
    animation: 'livePulse 2s ease-in-out infinite',
  },

  liveText: {
    fontSize: '0.68rem',
    color: '#059669',
    fontWeight: 700,
    letterSpacing: '0.08em',
  },

  // ─── Autocomplete Options ────────────────────────────────────────────────────
  autocompleteCheckbox: {
    mr: 0.5,
  },

  autocompleteColorDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    mr: 1,
    flexShrink: 0,
  },

  // ─── Toggle Buttons ───────────────────────────────────────────────────────────
  toggleBtnActive: {
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    '&:hover': {
      background: 'linear-gradient(135deg,#4338ca,#6d28d9)',
      boxShadow: '0 4px 12px rgba(79,70,229,0.35)',
      transform: 'translateY(-1px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  toggleBtnBase: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    borderRadius: '8px',
    padding: '6px 18px',
    minWidth: 148,
    transition: 'all 0.18s ease',
    boxShadow: 'none',
    flex: 1,
  },

  toggleBtnActiveChart: {
    background: 'linear-gradient(135deg,#f97316 0%,#ec4899 55%,#8b5cf6 100%)',
    boxShadow: '0 4px 18px rgba(249,115,22,0.4)',
    '&:hover': {
      boxShadow: '0 6px 24px rgba(249,115,22,0.55)',
      transform: 'translateY(-1px)',
      background: 'linear-gradient(135deg,#ea580c 0%,#db2777 55%,#7c3aed 100%)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  toggleBtnActiveIncentive: {
    background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)',
    boxShadow: '0 4px 18px rgba(16,185,129,0.4)',
    '&:hover': {
      boxShadow: '0 6px 24px rgba(16,185,129,0.55)',
      transform: 'translateY(-1px)',
      background: 'linear-gradient(135deg,#059669 0%,#047857 100%)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  toggleBtnInactive: {
    color: '#64748b',
    borderColor: '#e2e8f0',
    background: '#f8fafc',
    '&:hover': { background: '#f1f5f9', borderColor: '#cbd5e1' },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  // ─── Table Cell Styles ───────────────────────────────────────────────────────
  cellNumeric: {
    fontSize: '0.63rem',
    fontWeight: 500,
    color: '#334155',
    textAlign: 'center',
  },

  cellNumericBold: {
    fontSize: '0.63rem',
    fontWeight: 700,
    color: '#1e293b',
    textAlign: 'center',
  },

  cellOpMode: {
    fontSize: '0.63rem',
    fontWeight: 600,
    color: '#475569',
    textAlign: 'center',
  },

  cellTurbineNo: {
    fontSize: '0.63rem',
    fontWeight: 600,
    color: '#1e40af',
    cursor: 'pointer',
    '&:hover': {
      color: '#4f46e5',
      textDecoration: 'underline',
    },
  },

  filterBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  // ─── Sprint Status Matrix ────────────────────────────────────────────────────
  toggleBtnActiveMatrix: {
    background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
    boxShadow: '0 4px 18px rgba(99,102,241,0.4)',
    '&:hover': {
      boxShadow: '0 6px 24px rgba(99,102,241,0.55)',
      transform: 'translateY(-1px)',
      background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});
