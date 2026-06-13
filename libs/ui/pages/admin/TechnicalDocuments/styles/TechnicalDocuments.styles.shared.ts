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

  // ─── Page Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(2.5),
    background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 30%, #0d9488 65%, #0891b2 100%)',
    backgroundSize: '300% 300%',
    borderRadius: 18,
    padding: theme.spacing(3.5, 4),
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow:
      '0 24px 64px rgba(13,148,136,0.28), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -100,
      right: -100,
      width: 350,
      height: 350,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at center, rgba(94,234,212,0.38) 0%, rgba(13,148,136,0.12) 50%, transparent 70%)',
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
      background: 'radial-gradient(circle at center, rgba(8,145,178,0.3) 0%, transparent 70%)',
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

  // ─── Table Section ───────────────────────────────────────────────────────────
  tableSection: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(13,148,136,0.1)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
    marginTop: theme.spacing(2.5),
  },

  tableSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.5, 2.5),
    background: 'linear-gradient(135deg, rgba(13,148,136,0.07) 0%, rgba(8,145,178,0.05) 100%)',
    borderBottom: '1px solid rgba(13,148,136,0.1)',
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
        border: '1px solid rgba(13,148,136,0.18)',
        borderRadius: 40,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(13,148,136,0.4)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(13,148,136,0.1)',
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #0d9488',
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
      color: 'rgba(13,148,136,0.6)',
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
});
