import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

// Dialog-specific styles are in Configuration.styles.shared.ts
// This file re-exports them for the dialog's own useStyles hook.
export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  headerAppbar: {
    color: theme.palette.common.white,
    width: '100%',
    left: 0,
    right: 0,
    zIndex: 1201,
    boxShadow: '0 1px 0 rgba(255,255,255,0.06), 0 4px 32px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },

  // kept as dead style — no longer rendered
  mobileLogoBar: {
    display: 'none',
  },

  desktopLogoArea: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    borderRadius: '12px',
    padding: theme.spacing(0.75, 1.25),
    transition: 'all 0.22s ease',
    border: '1px solid transparent',
    overflow: 'visible',

    '&:hover': {
      background: 'rgba(99,102,241,0.12)',
      border: '1px solid rgba(99,102,241,0.25)',
      boxShadow: '0 0 20px rgba(99,102,241,0.2)',
    },

    // visible on all breakpoints — compact logo rendered on mobile via prop
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5, 0.75),
      borderRadius: '10px',
    },
  },

  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: '11px',
    background: 'linear-gradient(145deg, #6d28d9 0%, #4f46e5 50%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 1.5px rgba(255,255,255,0.15), 0 4px 20px rgba(99,102,241,0.55)',
    flexShrink: 0,
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
      borderRadius: '11px 11px 0 0',
    },
  },

  logoBadgeLetter: {
    color: theme.palette.common.white,
    fontWeight: 900,
    fontSize: '1.3rem',
    lineHeight: 1,
    letterSpacing: '-0.03em',
    position: 'relative' as const,
    zIndex: 1,
    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
  },

  logoWordmark: {
    color: theme.palette.common.white,
    fontWeight: 800,
    fontSize: '1.25rem',
    letterSpacing: '0.1em',
    lineHeight: 1,
    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
  },

  logoTagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.45rem',
    letterSpacing: '0.28em',
    lineHeight: 1,
    marginTop: '5px',
    textTransform: 'uppercase' as const,
    fontWeight: 700,

    [theme.breakpoints.down('sm')]: { display: 'none' },
  },

  logoDivider: {
    width: '1px',
    height: '26px',
    background: 'rgba(255,255,255,0.12)',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1.5),
    flexShrink: 0,

    [theme.breakpoints.down('sm')]: {
      height: '20px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(0.75),
    },
  },

  headerToolbar: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minHeight: '64px',
    height: '64px',
    overflow: 'visible',

    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },

    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      gap: '2px',
      minHeight: '56px',
      height: '56px',
    },
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),

    [theme.breakpoints.down('lg')]: { gap: theme.spacing(1) },
    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.75) },
  },

  avatar: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    border: '2px solid rgba(99,102,241,0.55)',
    boxShadow: '0 0 12px rgba(99,102,241,0.4)',
    transition: 'all 0.22s ease',

    '&:hover': {
      border: '2px solid rgba(165,180,252,0.8)',
      boxShadow: '0 0 20px rgba(99,102,241,0.6)',
    },

    [theme.breakpoints.down('md')]: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },

    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
    },
  },

  userName: {
    color: '#e2e8f0',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.01em',

    [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
  },

  headerCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center',
  },

  headerTitle: {
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: '1.15rem',
    letterSpacing: '0.02em',

    [theme.breakpoints.down('md')]: { fontSize: '1rem' },
    [theme.breakpoints.down('sm')]: { fontSize: '0.95rem' },
  },

  welcomeText: {
    display: 'flex',
    alignItems: 'center',

    [theme.breakpoints.down('md')]: { display: 'none' },
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(0.75),

    [theme.breakpoints.down('sm')]: { gap: theme.spacing(0.5) },
  },

  headerFields: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),

    [theme.breakpoints.down('lg')]: { display: 'none' },
  },

  mobileSearch: {
    display: 'none',

    [theme.breakpoints.down('lg')]: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      maxWidth: '220px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },

    [theme.breakpoints.down('md')]: { maxWidth: '180px' },

    [theme.breakpoints.down('sm')]: {
      maxWidth: '140px',
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },

  mobileSearchField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: '34px',
      fontSize: '0.82rem',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.22s ease',

      '& fieldset': { border: 'none' },

      '&:hover': {
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(99,102,241,0.35)',
      },

      '&.Mui-focused': {
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.5)',
        boxShadow: '0 0 16px rgba(99,102,241,0.2)',
      },
    },
    '& .MuiInputBase-input': {
      padding: `${theme.spacing(0.5)} ${theme.spacing(0.75)}`,
      fontSize: '0.82rem',
      color: '#e2e8f0',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,0.35)',
      opacity: 1,
      fontSize: '0.78rem',
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.4)',
    },

    [theme.breakpoints.down('sm')]: {
      '& .MuiOutlinedInput-root': { height: '30px' },
    },
  },

  headerRightSpacer: {
    flex: 1,

    [theme.breakpoints.down('sm')]: {
      display: 'block',
      flex: 1,
    },
  },

  adminChip: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(79,70,229,0.25)) !important',
    color: '#c7d2fe !important',
    fontWeight: 700,
    fontSize: '0.68rem',
    height: '24px',
    border: '1px solid rgba(99,102,241,0.4) !important',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    backdropFilter: 'blur(8px)',

    '& .MuiChip-icon': {
      color: '#a5b4fc !important',
    },

    [theme.breakpoints.down('sm')]: {
      '& .MuiChip-label': { display: 'none' },
      '& .MuiChip-icon': { margin: 0 },
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  },

  textField: {
    width: '220px',
    '& .MuiOutlinedInput-root': {
      height: '36px',
      fontSize: '0.85rem',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.22s ease',

      '& fieldset': { border: '1px solid rgba(255,255,255,0.1)' },

      '&:hover fieldset': { border: '1px solid rgba(99,102,241,0.4)' },

      '&.Mui-focused fieldset': {
        border: '1px solid rgba(99,102,241,0.6)',
        boxShadow: '0 0 16px rgba(99,102,241,0.2)',
      },
    },
    '& .MuiInputBase-input': {
      padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
      fontSize: '0.85rem',
      color: '#e2e8f0',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255,255,255,0.35)',
      opacity: 1,
    },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.4)',
    },
  },

  ticketSearchWrapper: {
    position: 'relative',
  },

  searchDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: theme.spacing(0.75),
    background: 'rgba(15,23,42,0.96)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: '14px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    zIndex: 1300,
    maxHeight: '300px',
    overflowY: 'auto',
    minWidth: '220px',

    '&::-webkit-scrollbar': { width: 4 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(99,102,241,0.4)',
      borderRadius: 4,
    },
  },

  searchResultItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.18s ease',

    '&:last-child': { borderBottom: 'none' },

    '&:hover': {
      background: 'rgba(99,102,241,0.15)',
      paddingLeft: theme.spacing(2),
    },
  },

  searchResultNumber: {
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#a5b4fc',
  },

  searchResultDesc: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    maxWidth: '130px',
  },

  searchNoResults: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'rgba(255,255,255,0.35)',
    fontSize: '0.82rem',
  },

  // Icon buttons — glowing ring on hover
  icon: {
    width: '1.1em',
    height: '1.1em',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.65)',
    transition: 'all 0.2s ease',

    '&:hover': {
      color: '#a5b4fc',
      filter: 'drop-shadow(0 0 6px rgba(165,180,252,0.7))',
      transform: 'scale(1.15)',
    },

    [theme.breakpoints.down('sm')]: {
      width: '18px',
      height: '18px',
    },
  },

  loadingText: {
    fontWeight: 'bold',
  },

  centerSearchWrap: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
  },

  iconBtnBase: {
    color: 'white',
    transition: 'background 0.15s, transform 0.15s',
    '&:hover': {
      background: 'rgba(255,255,255,0.15)',
      transform: 'scale(1.08)',
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
    },
  },

  loadingBackdrop: {
    color: '#fff',
    flexDirection: 'column' as const,
    gap: theme.spacing(2),
  },

  iconBtn: {
    padding: '8px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.22s ease',
    border: '1px solid transparent',

    '&:hover': {
      background: 'rgba(99,102,241,0.18)',
      border: '1px solid rgba(99,102,241,0.3)',
      boxShadow: '0 0 16px rgba(99,102,241,0.25)',
      transform: 'scale(1.08)',

      '& .MuiSvgIcon-root': {
        color: '#a5b4fc',
        filter: 'drop-shadow(0 0 5px rgba(165,180,252,0.6))',
      },
    },
  },
});
