import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

// Dialog-specific styles are in Configuration.styles.shared.ts
// This file re-exports them for the dialog's own useStyles hook.
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

  // ─── Hero Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #4f46e5 65%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 350,
      height: 350,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at center, rgba(167,139,250,0.38) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)',
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
      background: 'radial-gradient(circle at center, rgba(14,165,233,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2),
      borderRadius: 12,
    },
  },

  headerOrb3: {
    position: 'absolute',
    bottom: '10%',
    right: '28%',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  titleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.24)',
    borderRadius: 40,
    padding: '5px 14px',
    marginBottom: theme.spacing(1.25),
    width: 'fit-content',
    position: 'relative',
    zIndex: 1,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 8px #4ade80, 0 0 14px rgba(74,222,128,0.5)',
    flexShrink: 0,
  },

  titleBadgeText: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
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
    fontSize: '26px',
    letterSpacing: '-0.028em',
    lineHeight: 1.18,
    textShadow: '0 2px 18px rgba(0,0,0,0.28)',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative',
    zIndex: 1,
  },

  // Action bar between header and stat cards
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

  // Stat pills inside the header banner
  headerStatRow: {
    display: 'flex',
    gap: theme.spacing(1.25),
    marginTop: theme.spacing(2.75),
    flexWrap: 'wrap' as const,
    position: 'relative',
    zIndex: 1,
  },

  headerStatPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 32,
    padding: '8px 16px',
    cursor: 'default',
    transition: 'all 0.25s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.22)',
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    },
  },

  headerStatDot: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    flexShrink: 0,
  },

  headerStatValue: {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#fff',
    lineHeight: 1,
  },

  headerStatLabel: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.05em',
  },

  // ─── Stat Cards Grid ────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
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
    '&::before': { background: 'linear-gradient(90deg, #0ea5e9, #2563eb)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(14,165,233,0.16), 0 4px 16px rgba(14,165,233,0.08)' },
  },

  statCard4: {
    '&::before': { background: 'linear-gradient(90deg, #7c3aed, #a855f7)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(124,58,237,0.16), 0 4px 16px rgba(124,58,237,0.08)' },
  },

  statCard5: {
    '&::before': { background: 'linear-gradient(90deg, #0f766e, #0ea5e9)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(15,118,110,0.16), 0 4px 16px rgba(15,118,110,0.08)' },
  },

  statCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.15),
    [theme.breakpoints.down('md')]: { marginBottom: theme.spacing(0.4) },
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(0.3), marginTop: 0 },
  },

  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.25s ease',
    [theme.breakpoints.down('md')]: { width: 26, height: 26, borderRadius: 6 },
    [theme.breakpoints.down('sm')]: { width: 22, height: 22, borderRadius: 5 },
  },

  statIcon: {
    fontSize: '0.9rem !important',
    [theme.breakpoints.down('md')]: { fontSize: '0.85rem !important' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.75rem !important' },
  },

  statValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: theme.spacing(0.1),
    [theme.breakpoints.down('lg')]: { fontSize: '1rem' },
    [theme.breakpoints.down('md')]: { fontSize: '0.95rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.9rem', marginBottom: theme.spacing(0.08) },
  },

  statLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    [theme.breakpoints.down('sm')]: { fontSize: '0.58rem', letterSpacing: '0.03em' },
  },

  statDivider: {
    borderColor: 'rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(0.75),
    [theme.breakpoints.down('sm')]: { marginBottom: theme.spacing(0.4) },
  },

  statSubRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    [theme.breakpoints.down('sm')]: { gap: 3 },
  },

  statSubDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: { width: 4, height: 4 },
  },

  statSub: {
    fontSize: '0.58rem',
    color: 'rgba(0,0,0,0.42)',
    fontWeight: 500,
    [theme.breakpoints.down('md')]: { fontSize: '0.55rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.5rem' },
  },

  // ─── Glassmorphism Toolbar ────────────────────────────────────────────────
  toolbar: {
    padding: theme.spacing(1.5, 2),
    marginTop: theme.spacing(1),
    background: 'rgba(255,255,255,0.87) !important',
    backdropFilter: 'blur(20px)',
    borderRadius: '14px !important',
    border: '1px solid rgba(79,70,229,0.1) !important',
    boxShadow:
      '0 4px 24px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9) !important',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.25),
    },
  },

  toolbarStack: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    alignItems: 'center',
    '& > span': { flex: 1, minWidth: 0 },
    '& > .MuiButton-root': { flex: 1, minWidth: 0 },
    '& span > .MuiButton-root': { width: '100%' },
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
      gap: theme.spacing(0.75),
      '& > span': { flex: 'unset' as const, width: '100%' },
      '& > .MuiButton-root': { flex: 'unset' as const, width: '100%' },
      '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' },
    },
  },

  buttonLabel: {},

  // ─── Toolbar button variants ──────────────────────────────────────────────
  btnCreate: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed) !important',
    boxShadow: '0 4px 14px rgba(79,70,229,0.45) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(79,70,229,0.55) !important',
    },
  },

  btnDraft: {
    background: 'linear-gradient(135deg, #0ea5e9, #38bdf8) !important',
    boxShadow: '0 4px 14px rgba(14,165,233,0.45) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(14,165,233,0.55) !important',
    },
  },

  btnChangeProfile: {
    background: 'linear-gradient(135deg, #10b981, #059669) !important',
    boxShadow: '0 4px 14px rgba(16,185,129,0.42) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(16,185,129,0.55) !important',
    },
    '&.Mui-disabled': {
      background: 'rgba(0,0,0,0.12) !important',
      boxShadow: 'none !important',
      color: 'rgba(0,0,0,0.26) !important',
    },
  },

  btnChangesLog: {
    background: 'linear-gradient(135deg, #6d28d9, #a855f7) !important',
    boxShadow: '0 4px 14px rgba(109,40,217,0.42) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(109,40,217,0.55) !important',
    },
    '&.Mui-disabled': {
      background: 'rgba(0,0,0,0.12) !important',
      boxShadow: 'none !important',
      color: 'rgba(0,0,0,0.26) !important',
    },
  },

  btnLoginData: {
    background: 'linear-gradient(135deg, #0f766e, #0ea5e9) !important',
    boxShadow: '0 4px 14px rgba(15,118,110,0.42) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(15,118,110,0.55) !important',
    },
    '&.Mui-disabled': {
      background: 'rgba(0,0,0,0.12) !important',
      boxShadow: 'none !important',
      color: 'rgba(0,0,0,0.26) !important',
    },
  },

  btnResetPassword: {
    background: 'linear-gradient(135deg, #ef4444, #b91c1c) !important',
    boxShadow: '0 4px 14px rgba(239,68,68,0.42) !important',
    transition: 'all 0.22s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(239,68,68,0.55) !important',
    },
    '&.Mui-disabled': {
      background: 'rgba(0,0,0,0.12) !important',
      boxShadow: 'none !important',
      color: 'rgba(0,0,0,0.26) !important',
    },
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

  tableContainer: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(79,70,229,0.06)',
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

  adminControlsBtn: {
    marginLeft: 'auto',
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      width: '100%',
    },
  },

  selectionIndicator: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
    padding: '5px 10px',
    borderLeft: '3px solid #4f46e5',
    borderRadius: '0 8px 8px 0',
    background: 'linear-gradient(90deg, rgba(79,70,229,0.07), transparent)',
  },

  btnClear: {
    borderRadius: '50px !important',
    fontSize: '0.7rem !important',
    padding: '2px 12px !important',
    minWidth: 'unset !important',
    borderColor: 'rgba(239,68,68,0.4) !important',
    color: 'rgba(239,68,68,0.85) !important',
    transition: 'all 0.2s ease',
    '& .MuiSvgIcon-root': { fontSize: '0.9rem !important' },
    '&:hover': {
      borderColor: '#ef4444 !important',
      background: 'rgba(239,68,68,0.06) !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 10px rgba(239,68,68,0.2)',
    },
  },

  dividerMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  // ─── Dialog Styles (CreateUserDialog) ──────────────────────────────────────
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      overflow: 'hidden',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
    },
  },

  modalHero: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5, 3),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #4f46e5 70%, #0ea5e9 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
    flexShrink: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -60,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'radial-gradient(circle at center, rgba(167,139,250,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },

  modalIconBox: {
    width: 46,
    height: 46,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(79,70,229,0.45)',
    flexShrink: 0,
  },

  modalTitleBox: {
    flex: 1,
    minWidth: 0,
  },

  modalTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#fff',
    letterSpacing: '-0.02em',
  },

  modalSubtitle: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  avatarPreview: {
    width: 42,
    height: 42,
    fontSize: '0.95rem',
    fontWeight: 700,
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
    flexShrink: 0,
  },

  modalCloseBtn: {
    color: 'rgba(255,255,255,0.7) !important',
    '&:hover': { color: '#fff !important', background: 'rgba(255,255,255,0.1) !important' },
  },

  // ─── Section Card ──────────────────────────────────────────────────────────
  sectionCard: {
    borderRadius: 12,
    border: '1px solid',
    borderColor: 'divider',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2.5),
    background: 'linear-gradient(135deg, rgba(79,70,229,0.05), rgba(124,58,237,0.03))',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },

  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': { color: '#fff' },
  },
});
