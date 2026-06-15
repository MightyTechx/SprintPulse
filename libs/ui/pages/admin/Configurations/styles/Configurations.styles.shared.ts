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

  // ─── Tabs Box ────────────────────────────────────────────────────────────────
  tabsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    background: '#ffffff',
    padding: theme.spacing(1, 1.5),
    borderRadius: 14,
    border: '1px solid rgba(99,102,241,0.1)',
    boxShadow: '0 2px 14px rgba(15,23,42,0.04)',
    overflowX: 'auto',
    '&::-webkit-scrollbar': { height: 6 },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(99,102,241,0.3)',
      borderRadius: 3,
    },
  },

  tabPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    padding: '7px 14px',
    borderRadius: 22,
    cursor: 'pointer',
    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#475569',
    background: 'transparent',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    '&:hover': {
      background: 'rgba(99,102,241,0.06)',
      color: '#4338ca',
    },
  },

  tabPillActive: {
    color: '#fff !important',
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%) !important',
    boxShadow: '0 4px 14px rgba(99,102,241,0.35) !important',
    transform: 'translateY(-1px)',
    border: '1px solid rgba(255,255,255,0.18) !important',
  },

  tabIcon: {
    fontSize: '1.05rem !important',
  },

  tabCount: {
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: 10,
    background: 'rgba(99,102,241,0.12)',
    color: '#4338ca',
  },

  tabCountActive: {
    background: 'rgba(255,255,255,0.25)',
    color: '#fff',
  },

  // ─── Tab description strip ────────────────────────────────────────────────────
  tabDescription: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 2),
    marginBottom: theme.spacing(2),
    borderRadius: 10,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.03) 100%)',
    border: '1px solid rgba(99,102,241,0.12)',
  },

  tabDescriptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#fff',
  },

  tabDescriptionText: {
    fontSize: '0.85rem',
    color: '#475569',
    lineHeight: 1.4,
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

  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '7px 16px',
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
      borderRadius: 8,
    },
  },

  addButtonLabel: {
    fontSize: '0.78rem !important',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.01em',
  },

  // ─── Empty state ─────────────────────────────────────────────────────────────
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 2),
    color: '#94a3b8',
    textAlign: 'center',
  },

  emptyIcon: {
    fontSize: '3rem !important',
    color: 'rgba(99,102,241,0.3)',
    marginBottom: theme.spacing(1),
  },

  // ─── Dialog Styles ───────────────────────────────────────────────────────────
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 20,
      overflow: 'hidden',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column' as const,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(20px)',
      boxShadow:
        '0 24px 60px rgba(15,23,42,0.25), 0 8px 24px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.08)',
    },
    '& .MuiBackdrop-root': {
      background: 'rgba(15,23,42,0.45)',
      backdropFilter: 'blur(6px)',
    },
  },

  modalHero: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2, 2.5),
    background: '#1976d2',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },

  modalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  modalTitleBox: {
    flex: 1,
    minWidth: 0,
  },

  modalTitle: {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#fff',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },

  modalSubtitle: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    lineHeight: 1.3,
  },

  modalCloseBtn: {
    color: 'rgba(255,255,255,0.85) !important',
    transition: 'all 0.2s ease !important',
    '&:hover': {
      color: '#fff !important',
      background: 'rgba(255,255,255,0.15) !important',
    },
  },

  dialogContent: {
    p: 2.5,
    background: '#ffffff',
    maxHeight: '65vh',
    overflow: 'auto',
  },

  formStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.75),
  },

  dialogActions: {
    padding: theme.spacing(1.5, 2.5),
    borderTop: '1px solid #e2e8f0',
    background: '#ffffff',
    gap: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(1.5),
      gap: theme.spacing(1),
    },
  },

  cancelButton: {
    textTransform: 'none' as const,
    borderRadius: 2,
    fontWeight: 600,
    fontSize: '0.85rem',
    px: 2,
    color: '#1976d2 !important',
    borderColor: '#1976d2 !important',
    '&:hover': {
      background: 'rgba(25,118,210,0.06) !important',
      borderColor: '#1976d2 !important',
    },
  },

  submitButton: {
    textTransform: 'none' as const,
    borderRadius: 2,
    fontWeight: 600,
    fontSize: '0.85rem',
    px: 2.5,
    background: '#1976d2 !important',
    color: '#fff !important',
    boxShadow: 'none !important',
    '&:hover': {
      background: '#1565c0 !important',
      boxShadow: '0 2px 6px rgba(25,118,210,0.3) !important',
    },
    '&.Mui-disabled': {
      background: '#bbdefb !important',
      color: '#fff !important',
    },
  },

  // ─── Form Field Helpers ──────────────────────────────────────────────────────
  formField: {
    '& .MuiOutlinedInput-root': {
      background: '#ffffff',
      borderRadius: 1,
      fontSize: '0.88rem',
      '& fieldset': {
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px',
      fontSize: '0.88rem',
    },
  },

  // ─── Color picker ────────────────────────────────────────────────────────────
  accentColorField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 1.5),
    borderRadius: 14,
    background: '#ffffff',
    border: '1.5px solid',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 6px 18px rgba(15,23,42,0.06), 0 0 0 1px rgba(99,102,241,0.18)',
      transform: 'translateY(-1px)',
    },
  },

  accentColorDot: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    position: 'relative',
    flexShrink: 0,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -3,
      borderRadius: '50%',
      background: `linear-gradient(135deg, rgba(255,255,255,0.6), transparent 60%)`,
      zIndex: -1,
      filter: 'blur(2px)',
    },
  },

  accentColorDotLarge: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.35), 0 2px 6px rgba(0,0,0,0.12)',
  },

  accentColorSwatches: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 8px',
    borderRadius: 999,
    background: 'rgba(248,250,252,0.7)',
    border: '1px solid rgba(99,102,241,0.08)',
  },

  accentColorChip: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1.5px solid #ffffff',
    boxShadow: '0 0 0 1px rgba(15,23,42,0.06)',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      transform: 'scale(1.18)',
      boxShadow: '0 0 0 1px rgba(15,23,42,0.12), 0 2px 6px rgba(0,0,0,0.18)',
    },
  },

  accentColorChipActive: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '1.5px solid #ffffff',
    transform: 'scale(1.2)',
    boxShadow: '0 0 0 2px currentColor, 0 2px 8px rgba(0,0,0,0.18)',
  },

  accentColorPickerTrigger: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      transform: 'scale(1.08) rotate(8deg)',
      boxShadow: '0 4px 14px rgba(15,23,42,0.18)',
    },
  },

  accentColorPickerInput: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  },

  // ─── Actions Icon Buttons ────────────────────────────────────────────────────
  editButton: {
    color: '#4338ca',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      background: 'rgba(99,102,241,0.12)',
      transform: 'scale(1.1)',
    },
  },

  deleteButton: {
    color: '#dc2626',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      background: 'rgba(220,38,38,0.12)',
      transform: 'scale(1.1)',
    },
  },

  // ─── Icon Picker (Squads + Teams) ────────────────────────────────────────────
  iconPickerShell: {
    borderRadius: 2,
    border: '1.5px solid rgba(99,102,241,0.15)',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': { borderColor: 'rgba(99,102,241,0.35)' },
  },

  iconPickerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },

  iconPickerPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
    transition: 'all 0.25s ease',
  },

  iconPickerChevron: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    color: '#6366f1',
    background: 'rgba(99,102,241,0.1)',
    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  iconPickerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
    gap: 6,
    padding: 12,
    borderTop: '1px solid rgba(99,102,241,0.1)',
    background: 'linear-gradient(180deg, rgba(248,250,252,0.7) 0%, rgba(238,242,255,0.5) 100%)',
  },

  iconPickerCell: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    background: '#fff',
    border: '1px solid rgba(99,102,241,0.1)',
    transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      background: 'rgba(99,102,241,0.1)',
      color: '#4338ca',
      transform: 'translateY(-2px) scale(1.08)',
      boxShadow: '0 4px 10px rgba(99,102,241,0.15)',
    },
  },

  iconPickerCellActive: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: '#fff !important',
    border: '1px solid rgba(255,255,255,0.25)',
    boxShadow: '0 4px 10px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
  },
});
