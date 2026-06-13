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
  },

  // ─── Page Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #4338ca 65%, #6366f1 100%)',
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(99,102,241,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 350,
      height: 350,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at center, rgba(165,180,252,0.38) 0%, rgba(99,102,241,0.12) 50%, transparent 70%)',
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
      background: 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 2),
      borderRadius: 12,
    },
  },

  headerOrb: {
    position: 'absolute' as const,
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
    position: 'relative' as const,
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
    position: 'relative' as const,
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    },
  },

  description: {
    color: 'rgba(255,255,255,0.68)',
    marginTop: theme.spacing(0.5),
    fontSize: '0.88rem',
    position: 'relative' as const,
    zIndex: 1,
  },

  // ─── Action Bar ──────────────────────────────────────────────────────────────
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    padding: `${theme.spacing(1.5)} ${theme.spacing(0)}`,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-end',
    },
  },

  // ─── Stat Cards Grid ─────────────────────────────────────────────────────────
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing(1),
    },
  },

  statCard: {
    borderRadius: 16,
    padding: theme.spacing(1.5),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    position: 'relative' as const,
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
    '&:hover': {
      transform: 'translateY(-4px)',
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.25),
      borderRadius: 14,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      borderRadius: 12,
    },
  },

  statCard0: {
    '&::before': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(79,70,229,0.16), 0 4px 16px rgba(79,70,229,0.08)' },
  },

  statCard1: {
    '&::before': { background: 'linear-gradient(90deg, #10b981, #059669)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(16,185,129,0.16), 0 4px 16px rgba(16,185,129,0.08)' },
  },

  statCard2: {
    '&::before': { background: 'linear-gradient(90deg, #ef4444, #dc2626)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(239,68,68,0.16), 0 4px 16px rgba(239,68,68,0.08)' },
  },

  statCard3: {
    '&::before': { background: 'linear-gradient(90deg, #f59e0b, #d97706)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(245,158,11,0.16), 0 4px 16px rgba(245,158,11,0.08)' },
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

  statSubRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    [theme.breakpoints.down('sm')]: { gap: 4 },
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

  // ─── Table Section ───────────────────────────────────────────────────────────
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflowX: 'auto' as const,
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    border: '1px solid rgba(99,102,241,0.08)',
  },

  tableSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2.5),
    background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.05) 100%)',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
    borderRadius: '14px 14px 0 0',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1),
    },
  },

  searchField: {
    marginLeft: 'auto',
    width: 240,
    flexShrink: 0,
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      borderRadius: 40,
      transition: 'all 0.22s ease',
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(99,102,241,0.18)',
        borderRadius: 40,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(99,102,241,0.4)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #6366f1',
        },
      },
    },
    '& .MuiInputBase-input': {
      padding: '4px 4px 4px 12px',
      fontSize: '0.85rem',
      '&::placeholder': { color: '#94a3b8', opacity: 1 },
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: 'rgba(99,102,241,0.6)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexBasis: '100%',
      marginLeft: 0,
    },
  },

  // ─── Consultant Access Banner ─────────────────────────────────────────────────
  accessBanner: {
    borderRadius: 12,
    padding: theme.spacing(1.5, 2.5),
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 100%)',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  // ─── Dialog Styles ───────────────────────────────────────────────────────────
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 16,
      overflow: 'hidden',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
    },
  },

  modalHero: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2.5, 3),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #4338ca 70%, #6366f1 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'relative' as const,
    flexShrink: 0,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -60,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'radial-gradient(circle at center, rgba(165,180,252,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },

  modalIconBox: {
    width: 50,
    height: 50,
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(79,70,229,0.45)',
    flexShrink: 0,
  },

  modalTitleBox: {
    flex: 1,
    minWidth: 0,
  },

  modalTitle: {
    fontWeight: 700,
    fontSize: '1.15rem',
    color: '#fff',
    letterSpacing: '-0.02em',
  },

  modalSubtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  modalCloseBtn: {
    color: 'rgba(255,255,255,0.7) !important',
    '&:hover': { color: '#fff !important', background: 'rgba(255,255,255,0.1) !important' },
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

  // ─── Add Button ────────────────────────────────────────────────────────────────
  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 20,
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
    boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
    },
    '&:active': { transform: 'translateY(0)' },
    '& .MuiSvgIcon-root': { fontSize: '0.95rem !important' },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexBasis: '100%',
      borderRadius: '8px',
    },
  },

  // ─── Dialog Actions ────────────────────────────────────────────────────────────
  dialogActions: {
    padding: theme.spacing(2, 3),
    borderTop: '1px solid',
    borderColor: 'divider',
    background: '#fafafa',
    gap: theme.spacing(1.5),
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(2),
      gap: theme.spacing(1),
    },
  },

  cancelButton: {
    borderRadius: '10px',
    textTransform: 'none' as const,
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'text.secondary',
    border: '1px solid',
    borderColor: 'divider',
    minWidth: 'auto',
    '&:hover': {
      background: 'rgba(0,0,0,0.04)',
      borderColor: 'text.disabled',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  submitButton: {
    borderRadius: '10px',
    textTransform: 'none' as const,
    fontWeight: 700,
    fontSize: '0.85rem',
    padding: '10px 28px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
    color: '#fff',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(99,102,241,0.45)',
      background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6d28d9 100%)',
    },
    '&.Mui-disabled': {
      background: 'rgba(99,102,241,0.3)',
      color: 'rgba(255,255,255,0.5)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  // ─── Actions Icon Buttons ──────────────────────────────────────────────────────
  editButton: {
    color: '#4338ca',
    '&:hover': { background: 'rgba(99,102,241,0.1)' },
  },

  deleteButton: {
    color: '#dc2626',
    '&:hover': { background: 'rgba(220,38,38,0.1)' },
  },

  // ─── Alert Banner ─────────────────────────────────────────────────────────────
  errorAlert: {
    mb: 2,
    borderRadius: 2,
  },

  // ─── Dialog Content ────────────────────────────────────────────────────────────
  dialogContent: {
    p: 3,
    bgcolor: 'background.default',
    maxHeight: '65vh',
    overflow: 'auto',
  },

  // ─── Text Helpers ─────────────────────────────────────────────────────────────
  textSmall: {
    fontSize: '0.82rem',
    color: '#64748b',
  },

  textSmallMuted: {
    fontSize: '0.72rem',
    color: '#94a3b8',
  },

  // ─── Form Field Styles ─────────────────────────────────────────────────────────
  formFieldFocused: {
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#6366f1' },
    '& label.Mui-focused': { color: '#6366f1' },
  },

  // ─── Page Header Icon Box ─────────────────────────────────────────────────────
  pageHeaderIconBox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 1.5,
  },

  pageHeaderChip: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.75rem',
    border: '1px solid rgba(255,255,255,0.25)',
    alignSelf: 'flex-start' as const,
    mt: 0.5,
  },

  // ─── Loading Spinner ──────────────────────────────────────────────────────────
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    py: 6,
  },

  // ─── Access Banner Text ───────────────────────────────────────────────────────
  accessBannerText: {
    fontSize: '0.85rem',
    color: '#4338ca',
    fontWeight: 500,
  },
});
