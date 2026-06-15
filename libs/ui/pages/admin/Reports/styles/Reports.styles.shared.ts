import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
  },

  // ─── Filter Bar ───────────────────────────────────────────────────────────────
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.75, 2.5),
    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,244,255,0.95) 100%)',
    borderRadius: 14,
    border: '1px solid rgba(99,102,241,0.12)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(1.25),
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch' as const,
      gap: theme.spacing(1),
    },
  },

  // ─── Download Button (matches prior "filter bar download" treatment) ─────────
  downloadButton: {
    flex: '1 1 180px',
    minWidth: 170,
    maxWidth: 280,
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    borderRadius: '8px',
    padding: '8px 18px',
    boxShadow: 'none',
    background: 'linear-gradient(135deg, #1a4299, #2563eb)',
    color: '#fff',
    transition: 'all 0.18s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
      boxShadow: '0 4px 14px rgba(26,66,153,0.4)',
      transform: 'translateY(-1px)',
    },
    '&:active': { transform: 'translateY(0)' },
    '&:disabled': {
      background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
      color: '#94a3b8',
      transform: 'none',
      boxShadow: 'none',
    },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 160px',
      maxWidth: 240,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
    },
  },

  // ─── Action Buttons & Filters Section ─────────────────────────────────────────
  actionButtonsSection: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2.5),
    padding: theme.spacing(1.75, 2.5),
    background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,244,255,0.95) 100%)',
    borderRadius: 14,
    border: '1px solid rgba(99,102,241,0.12)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
    [theme.breakpoints.down('md')]: {
      gap: theme.spacing(1.25),
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch' as const,
      gap: theme.spacing(1),
    },
  },

  // ─── Filter Autocompletes (Flexible Width) ──────────────────────────────────────
  filterAutocomplete: {
    flex: '1 1 180px',
    minWidth: 170,
    maxWidth: 280,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': { borderColor: '#6366f1' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 160px',
      maxWidth: 240,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
      maxWidth: '100%',
    },
  },

  filterAutocompleteSmall: {
    flex: '1 1 160px',
    minWidth: 150,
    maxWidth: 260,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '&:hover fieldset': { borderColor: '#6366f1' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 140px',
      maxWidth: 220,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
      maxWidth: '100%',
    },
  },

  // ─── Date Picker Input (Flexible Width) ─────────────────────────────────────────
  datePickerInput: {
    flex: '1 1 160px',
    minWidth: 150,
    maxWidth: 260,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      height: '40px',
      '&:hover fieldset': { borderColor: '#6366f1' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 140px',
      maxWidth: 220,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
      maxWidth: '100%',
    },
  },

  // ─── Action Buttons ───────────────────────────────────────────────────────────
  actionButtonBase: {
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    borderRadius: '8px',
    padding: '8px 18px',
    minWidth: 130,
    boxShadow: 'none',
    transition: 'all 0.18s ease',
    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transform: 'translateY(-1px)' },
    '&:active': { transform: 'translateY(0)' },
    '&:disabled': {
      opacity: 0.5,
      transform: 'none',
      boxShadow: 'none',
    },
  },

  actionButtonAdd: {
    flex: '1 1 180px',
    minWidth: 170,
    maxWidth: 280,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    '&:hover': {
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
      color: '#94a3b8',
    },
    [theme.breakpoints.down('md')]: {
      flex: '1 1 160px',
      maxWidth: 240,
    },
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
    },
  },

  // ─── Doc Option ───────────────────────────────────────────────────────────────
  docOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    py: '8px !important',
    px: '12px !important',
    fontSize: '0.82rem',
  },

  // ─── Table Section ───────────────────────────────────────────────────────────
  tableSection: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(99,102,241,0.1)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3),
  },

  tableSectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
  },

  tableSectionDate: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 400,
  },

  tableSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2.5),
    background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(124,58,237,0.05) 100%)',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1),
    },
  },

  tableSectionTitleGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    minWidth: 0,
  },

  searchField: {
    marginLeft: 'auto',
    width: 200,
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
    [theme.breakpoints.down('md')]: {
      width: 180,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexBasis: '100%',
      marginLeft: 0,
    },
  },

  tableWrapper: {
    overflowX: 'auto' as const,
    background: '#fff',
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

  modalHeroWhatsapp: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5, 3),
    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #059669 70%, #25D366 100%)',
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
      background: 'radial-gradient(circle at center, rgba(167,243,208,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  },

  modalIconBoxWhatsapp: {
    width: 50,
    height: 50,
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #059669, #25D366)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
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

  dialogContent: {
    p: 3,
    bgcolor: 'background.default',
    maxHeight: '70vh',
    overflow: 'auto',
  },

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

  submitButtonWhatsapp: {
    borderRadius: '10px',
    textTransform: 'none' as const,
    fontWeight: 700,
    fontSize: '0.85rem',
    padding: '10px 28px',
    background: 'linear-gradient(135deg, #059669, #25D366) !important',
    boxShadow: '0 4px 14px rgba(37,211,102,0.4) !important',
    color: '#fff !important',
    minWidth: 'auto',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(37,211,102,0.5) !important',
    },
    '&:disabled': {
      background: 'rgba(0,0,0,0.12) !important',
      boxShadow: 'none !important',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  formField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
  },

  // ─── Schedule Section ────────────────────────────────────────────────────────
  scheduleSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },

  schedulePreviewBox: {
    mt: 1.5,
    p: 1.5,
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
    borderRadius: 1,
    border: '1px solid rgba(37, 211, 102, 0.3)',
  },

  reportDetailsBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    p: 2,
    borderRadius: 2,
    marginTop: theme.spacing(1),
  },
});
