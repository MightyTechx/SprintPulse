import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  container: {
    padding: theme.spacing(3),
    background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: { padding: theme.spacing(1.25) },
    [theme.breakpoints.between('sm', 'md')]: { padding: theme.spacing(2) },
  },

  // ── Hero Header ────────────────────────────────────────────────────────────
  pageHeader: {
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #4f46e5 70%, #0ea5e9 100%)',
    backgroundSize: '300% 300%',
    borderRadius: theme.spacing(4),
    padding: theme.spacing(3),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 56px rgba(79,70,229,0.25)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -80,
      right: -80,
      width: 280,
      height: 280,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -60,
      left: '25%',
      width: 220,
      height: 220,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    animation: 'gradientShift 15s ease infinite',
    '@keyframes gradientShift': {
      '0%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
      '100%': { backgroundPosition: '0% 50%' },
    },
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  },

  pageHeaderTitle: {
    fontWeight: 800,
    color: '#fff',
    fontSize: '1.4rem',
    letterSpacing: '-0.025em',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.up('sm')]: { fontSize: '1.9rem' },
  },

  pageHeaderSubtitle: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
    position: 'relative',
    zIndex: 1,
  },

  pageHeaderStats: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2.5),
    flexWrap: 'wrap' as const,
  },

  pageHeaderStat: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
  },

  pageHeaderStatDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },

  pageHeaderStatText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.75rem',
    fontWeight: 500,
  },

  // ── Tab Bar ────────────────────────────────────────────────────────────────
  tabBar: {
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(16px)',
    borderRadius: theme.spacing(3.5),
    padding: theme.spacing(0.75),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(79,70,229,0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },

  tabs: {
    minHeight: 44,
    '& .MuiTab-root': {
      minHeight: 44,
      borderRadius: '10px',
      fontWeight: 600,
      fontSize: '0.8rem',
      textTransform: 'none' as const,
      color: 'text.secondary',
      transition: 'all 0.22s ease',
      position: 'relative' as const,
      '&.Mui-selected': {
        color: '#4f46e5',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(79,70,229,0.06) 100%)',
        boxShadow: '0 2px 12px rgba(79,70,229,0.2)',
      },
      '&:not(:last-of-type)::after': {
        content: '""',
        position: 'absolute' as const,
        right: 0,
        top: '22%',
        height: '56%',
        width: 1,
        background: 'rgba(0,0,0,0.08)',
        borderRadius: 1,
        pointerEvents: 'none',
      },
    },
    '& .MuiTabs-indicator': { display: 'none' },
  },

  // ── Section Panel ────────────────────────────────────────────────────────────
  sectionPanel: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: theme.spacing(3.5),
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },

  sectionPanelHeader: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, transparent 100%)',
  },

  sectionPanelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  sectionPanelIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionPanelTitleText: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'text.primary',
  },

  sectionPanelSubtitle: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    marginTop: 2,
  },

  sectionPanelBody: {
    padding: theme.spacing(2.5),
  },

  // ── Theme Grid ─────────────────────────────────────────────────────────────
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: theme.spacing(2),
  },

  themeOption: {
    borderRadius: theme.spacing(2.5),
    border: '2px solid',
    borderColor: 'transparent',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    overflow: 'hidden',
    '&:hover': {
      borderColor: 'rgba(79,70,229,0.3)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
  },

  themeOptionSelected: {
    borderColor: '#4f46e5',
    boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
  },

  themePreview: {
    height: 80,
    position: 'relative',
    overflow: 'hidden',
  },

  themeInfo: {
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  themeName: {
    fontWeight: 600,
    fontSize: '0.85rem',
  },

  // ── Config Item ─────────────────────────────────────────────────────────────
  configItem: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2.5),
    background: '#fafbfc',
    border: '1px solid rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#fff',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      transform: 'translateY(-1px)',
      borderColor: 'rgba(79,70,229,0.15)',
    },
  },

  configItemActive: {
    background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(79,70,229,0.02) 100%)',
    borderColor: 'rgba(79,70,229,0.2)',
  },

  configList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1.5),
  },

  // ── Info Box ─────────────────────────────────────────────────────────────────
  infoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)',
    border: '1px solid rgba(59,130,246,0.15)',
  },

  infoBoxIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.spacing(1.5),
    background: 'rgba(59,130,246,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  infoBoxContent: {
    flex: 1,
  },

  infoBoxTitle: {
    fontWeight: 600,
    fontSize: '0.82rem',
    color: 'text.primary',
  },

  infoBoxText: {
    fontSize: '0.75rem',
    color: 'text.secondary',
    marginTop: 2,
    lineHeight: 1.5,
  },

  // ── Status Indicator ────────────────────────────────────────────────────────
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.75),
    padding: '5px',
    width: 85,
    borderRadius: theme.spacing(2),
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.2)',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 },
    },
  },

  statusText: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#10b981',
  },

  // ── Admin Controls Tab - two-column grid ────────────────────────────────────
  adminControlsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3),
    alignItems: 'start',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '360px 1fr',
    },
  },

  // ── Panel ────────────────────────────────────────────────────────────────────
  panel: {
    background: 'rgba(255,255,255,0.92)',
    borderRadius: theme.spacing(4),
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },

  panelHeader: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid rgba(0,0,0,0.06)',
  },

  panelHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
  },

  panelSubtitle: {
    fontSize: '0.78rem',
    color: 'text.secondary',
    marginTop: theme.spacing(0.25),
  },

  panelAutoSave: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },

  // ── Theme list ─────────────────────────────────────────────────────────────
  themeList: {
    padding: theme.spacing(1.25),
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(0.5),
    maxHeight: 540,
    overflowY: 'auto' as const,
  },

  // ── Preview panel ──────────────────────────────────────────────────────────
  previewPanelHeaderRow: {
    padding: theme.spacing(2.5),
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewContent: {
    padding: theme.spacing(2.5),
  },

  colorPaletteLabel: {
    textTransform: 'uppercase' as const,
    letterSpacing: '0.09em',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'text.secondary',
  },

  colorPaletteRow: {
    display: 'flex',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap' as const,
  },

  colorSwatch: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    background: '#f8fafc',
    borderRadius: theme.spacing(2.5),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingTop: theme.spacing(0.85),
    paddingBottom: theme.spacing(0.85),
    border: '1px solid rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
      transform: 'translateY(-2px)',
    },
  },

  colorSwatchDot: {
    width: 20,
    height: 20,
    borderRadius: theme.spacing(1.5),
    flexShrink: 0,
    border: '1.5px solid rgba(0,0,0,0.1)',
  },

  colorSwatchLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'text.secondary',
    lineHeight: 1.2,
  },

  colorSwatchHex: {
    fontSize: '0.65rem',
    color: 'text.disabled',
    fontFamily: 'monospace',
    lineHeight: 1.3,
  },

  // ── AppPreview - browser chrome ─────────────────────────────────────────────
  appPreviewWrapper: {
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'box-shadow 0.3s ease',
    userSelect: 'none' as const,
  },

  browserChrome: {
    height: 32,
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },

  browserUrlBar: {
    flex: 1,
    height: 16,
    borderRadius: theme.spacing(2),
    background: '#e2e8f0',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },

  appLayout: {
    height: 230,
    display: 'flex',
  },

  // ── General tab row items ──────────────────────────────────────────────────
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(3),
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      transform: 'translateY(-1px)',
    },
  },

  settingRowList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1.5),
  },

  settingValue: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.85),
    paddingBottom: theme.spacing(0.85),
    borderRadius: theme.spacing(2),
    background: 'rgba(79,70,229,0.06)',
    border: '1px solid rgba(79,70,229,0.12)',
    color: '#4f46e5',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap' as const,
    fontSize: '0.82rem',
    fontWeight: 500,
  },
});
