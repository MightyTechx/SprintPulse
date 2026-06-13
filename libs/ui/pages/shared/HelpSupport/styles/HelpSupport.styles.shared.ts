import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  // ─── Container ───────────────────────────────────────────────────────────────
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    },
  },

  // ─── Page Header ───────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #4f46e5 65%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(79,70,229,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
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
      position: 'absolute' as const,
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

  headerOrb: {
    position: 'absolute' as const,
    bottom: '10%',
    right: '28%',
    width: 180,
    height: 180,
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(251,191,36,0.22) 0%, transparent 70%)',
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
    fontSize: '26px',
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

  // ─── Search Bar ──────────────────────────────────────────────────────────────
  searchBar: {
    borderRadius: 12,
    border: '1px solid rgba(79,70,229,0.12)',
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
  },

  searchInput: {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.5)',
      borderRadius: '40px',
      '&:hover fieldset': { borderColor: 'rgba(79,70,229,0.4)' },
      '&.Mui-focused fieldset': { borderColor: '#4f46e5', borderWidth: '2px' },
    },
    '& .MuiInputBase-input': {
      fontSize: '0.9rem',
      '&::placeholder': {
        color: '#94a3b8',
        opacity: 1,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#4f46e5' },
  },

  // ─── Stat Cards Grid ─────────────────────────────────────────────────────────
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

  quickActionCard: {
    borderRadius: 12,
    padding: theme.spacing(1),
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
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

  // ─── Contact Cards ───────────────────────────────────────────────────────────
  contactCard: {
    padding: theme.spacing(1),
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'default',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      borderRadius: '12px 12px 0 0',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
    },
    height: '100%',
  },

  contactCard0: {
    '&::before': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(79,70,229,0.16), 0 4px 16px rgba(79,70,229,0.08)' },
  },

  contactCard1: {
    '&::before': { background: 'linear-gradient(90deg, #059669, #10b981)' },
    '&:hover': { boxShadow: '0 18px 48px rgba(5,150,105,0.16), 0 4px 16px rgba(5,150,105,0.08)' },
  },

  // ─── Section ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: theme.spacing(2),
  },

  sectionTitle: {
    fontWeight: 700,
    fontSize: '14px',
    color: '#1e293b',
    marginBottom: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },

  // ─── Chat Assistant Card ─────────────────────────────────────────────────────
  chatAssistantCard: {
    borderRadius: 14,
    padding: theme.spacing(2.5, 3),
    marginBottom: theme.spacing(2),
    background: '#ffffff',
    border: '1px solid rgba(79,70,229,0.1)',
    boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    },
  },

  chatAssistantContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    flexWrap: 'wrap' as const,
  },

  chatAssistantLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flex: 1,
  },

  botAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
    flexShrink: 0,
  },

  onlineIndicator: {
    position: 'absolute' as const,
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#22c55e',
    border: '2px solid #fff',
  },

  chatButton: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    fontWeight: 600,
    fontSize: '0.85rem',
    px: 3,
    py: 1,
    borderRadius: 10,
    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
      boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
      transform: 'translateY(-1px)',
    },
  },

  // ─── FAQ Category ───────────────────────────────────────────────────────────
  faqCategory: {
    marginBottom: theme.spacing(2),
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(79,70,229,0.08)',
    background: '#ffffff',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
  },

  faqCategoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.5, 2),
    background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(124,58,237,0.04) 100%)',
    borderBottom: '1px solid rgba(99,102,241,0.1)',
  },

  // ─── FAQ Accordion ───────────────────────────────────────────────────────────
  faqAccordion: {
    background: 'transparent',
    boxShadow: 'none',
    '&::before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 },
    '&:not(:last-child)': {
      borderBottom: '1px solid #f1f5f9',
    },
  },

  faqAccordionSummary: {
    padding: theme.spacing(1.5, 2),
    minHeight: 'auto',
    '&.Mui-expanded': { minHeight: 'auto' },
    '& .MuiAccordionSummary-content': { margin: 0 },
    '&:hover': {
      background: 'rgba(99,102,241,0.03)',
    },
  },

  faqAccordionDetails: {
    padding: theme.spacing(0, 2, 1.5),
  },

  // ─── No Results ─────────────────────────────────────────────────────────────
  noResults: {
    padding: theme.spacing(4),
    borderRadius: 12,
    border: '1px solid rgba(79,70,229,0.1)',
    textAlign: 'center',
    background: '#ffffff',
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
  },

  // ─── Need Help Card ─────────────────────────────────────────────────────────
  needHelpCard: {
    padding: theme.spacing(3),
    borderRadius: 14,
    border: '1px solid rgba(79,70,229,0.1)',
    boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
    background: '#ffffff',
    marginBottom: theme.spacing(2),
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    },
  },

  needHelpButton: {
    fontWeight: 600,
    fontSize: '0.82rem',
    borderRadius: 8,
    textTransform: 'none' as const,
    px: 2.5,
  },

  needHelpButtonOutlined: {
    borderColor: 'rgba(79,70,229,0.4) !important',
    color: '#4f46e5 !important',
    '&:hover': {
      background: 'rgba(79,70,229,0.08)',
      borderColor: '#4f46e5',
    },
  },

  needHelpButtonContained: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed) !important',
    boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #4338ca, #6d28d9) !important',
      boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
    },
  },
});
