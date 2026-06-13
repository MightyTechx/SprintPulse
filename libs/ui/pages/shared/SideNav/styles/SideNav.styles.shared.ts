import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

// Dialog-specific styles are in Configuration.styles.shared.ts
// This file re-exports them for the dialog's own useStyles hook.
export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  drawer: {
    whiteSpace: 'nowrap',
    transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
    flexShrink: 0,

    '& .MuiDrawer-paper': {
      borderRight: 'none',
      overflow: 'hidden',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      zIndex: 1200,
      boxSizing: 'border-box',
      top: '64px',
      height: 'calc(100vh - 64px)',
      width: 250,
      padding: theme.spacing(1.5),

      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      color: '#e2e8f0',

      [theme.breakpoints.between('md', 'lg')]: {
        width: 278,
        padding: theme.spacing(1.25),
      },

      [theme.breakpoints.between('sm', 'md')]: {
        width: 248,
        padding: theme.spacing(1),
        height: 'calc(100vh - 56px)',
        top: '56px',
      },

      [theme.breakpoints.down('sm')]: {
        width: 200,
        padding: theme.spacing(0.75),
        top: '56px',
        height: 'calc(100vh - 56px)',
      },
    },
  },

  drawerCollapsed: {
    '& .MuiDrawer-paper': {
      width: 72,

      [theme.breakpoints.between('md', 'lg')]: { width: 70 },
      [theme.breakpoints.between('sm', 'md')]: { width: 68 },
      [theme.breakpoints.down('sm')]: { width: 64 },
    },
  },

  toggleButtonCenter: {
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    transition: 'all 0.3s ease',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    paddingBottom: theme.spacing(1),

    '& .MuiIconButton-root': {
      padding: theme.spacing(0.75),
      color: '#94a3b8',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '50%',
      minWidth: '36px',
      minHeight: '36px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.25s ease',
      backdropFilter: 'blur(8px)',

      '&:hover': {
        background: 'rgba(99,102,241,0.25)',
        color: '#a5b4fc',
        border: '1px solid rgba(99,102,241,0.45)',
        boxShadow: '0 0 12px rgba(99,102,241,0.35)',
        transform: 'scale(1.1)',
      },

      '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
    },
  },

  toggleButtonRight: {
    display: 'flex !important',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(0.75, 0.5, 1, 0.5),
    marginBottom: theme.spacing(0.25),
    transition: 'all 0.3s ease',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'transparent',
    borderBottom: '1px solid rgba(255,255,255,0.07)',

    '& .MuiIconButton-root': {
      padding: theme.spacing(0.75),
      color: '#94a3b8',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '50%',
      minWidth: '36px',
      minHeight: '36px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.25s ease',
      backdropFilter: 'blur(8px)',

      '&:hover': {
        background: 'rgba(99,102,241,0.25)',
        color: '#a5b4fc',
        border: '1px solid rgba(99,102,241,0.45)',
        boxShadow: '0 0 12px rgba(99,102,241,0.35)',
        transform: 'scale(1.1)',
      },

      '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
    },
  },

  listItem: {
    padding: theme.spacing(0.875, 1.25),
    margin: theme.spacing(0.2, 0),
    borderRadius: '10px',
    color: '#94a3b8',
    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid transparent',

    '&:hover': {
      background: 'rgba(99,102,241,0.12)',
      color: '#c7d2fe',
      border: '1px solid rgba(99,102,241,0.2)',
      transform: 'translateX(3px)',
      boxShadow: '0 2px 12px rgba(99,102,241,0.12)',

      '& .MuiListItemIcon-root': {
        color: '#a5b4fc',
        filter: 'drop-shadow(0 0 6px rgba(165,180,252,0.6))',
      },
    },

    [theme.breakpoints.between('sm', 'md')]: {
      padding: theme.spacing(0.875, 1),
    },

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.75, 0.875),
      borderRadius: '8px',
    },
  },

  activeItem: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(79,70,229,0.2) 100%)',
    color: '#e0e7ff',
    border: '1px solid rgba(99,102,241,0.45)',
    transform: 'translateX(3px)',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '20%',
      bottom: '20%',
      width: '3px',
      borderRadius: '0 3px 3px 0',
      background: 'linear-gradient(180deg, #818cf8, #6366f1)',
      boxShadow: '0 0 10px rgba(129,140,248,0.8)',
    },

    '& .MuiListItemIcon-root': {
      color: '#a5b4fc',
      filter: 'drop-shadow(0 0 8px rgba(165,180,252,0.75))',
    },

    '& .MuiListItemText-primary': {
      fontWeight: 700,
      color: '#e0e7ff',
    },

    '&:hover': {
      background: 'linear-gradient(135deg, rgba(99,102,241,0.45) 0%, rgba(79,70,229,0.3) 100%)',
      transform: 'translateX(3px)',
    },
  },

  icon: {
    color: '#64748b',
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.22s ease',

    '& .MuiSvgIcon-root': {
      fontSize: '1.25rem',

      [theme.breakpoints.between('md', 'lg')]: { fontSize: '1.2rem' },
      [theme.breakpoints.between('sm', 'md')]: { fontSize: '1.15rem' },
      [theme.breakpoints.down('sm')]: { fontSize: '1.1rem' },
    },
  },

  iconMarginExpanded: {
    marginRight: theme.spacing(1.5),

    [theme.breakpoints.between('sm', 'md')]: { marginRight: theme.spacing(1.25) },
    [theme.breakpoints.down('sm')]: { marginRight: theme.spacing(1) },
  },

  iconMarginCollapsed: {
    marginRight: 0,
  },

  text: {
    opacity: 1,
    transition: 'opacity 0.3s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',

    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',

      [theme.breakpoints.between('sm', 'md')]: { fontSize: '0.84rem' },
      [theme.breakpoints.down('sm')]: { fontSize: '0.82rem' },
    },
  },

  navScrollArea: {
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    flex: 1,
    paddingBottom: theme.spacing(2),
    '&::-webkit-scrollbar': { width: 3 },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(99,102,241,0.3)',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(99,102,241,0.55)' },
  },

  navList: {
    padding: 0,
    width: '100%',
  },

  navGroupBox: {
    marginBottom: theme.spacing(0.5),
  },

  sectionHeaderExpanded: {
    marginLeft: theme.spacing(0.75),
    marginRight: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.9),
    paddingBottom: theme.spacing(0.9),
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },

  sectionGroupDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },

  sectionGroupLabel: {
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    userSelect: 'none' as const,
    lineHeight: 1,
  },

  sectionDividerCollapsed: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 28,
    height: 3,
    borderRadius: 8,
    cursor: 'default',
  },

  subItem: {
    paddingLeft: 6.875,
    color: '#64748b',
    borderRadius: 1,
    display: 'flex',
    fontSize: '0.875rem',

    '&:hover': {
      background: 'rgba(99,102,241,0.1)',
      color: '#a5b4fc',
    },
  },

  subText: {
    opacity: 1,
    transition: 'opacity 0.2s',
    fontSize: '0.875rem',
  },

  subTextCollapsed: {
    opacity: 0,
  },
});
