import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
      maxHeight: '92vh',
    },
  },

  modalHero: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(3.5),
    paddingRight: theme.spacing(3.5),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    overflow: 'hidden',
    flexShrink: 0,
    background:
      'linear-gradient(135deg, #060d1f 0%, #0d1f4a 18%, #1a3480 40%, #3730a3 62%, #0369a1 85%, #0891b2 100%)',
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      top: -60,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.07)',
      pointerEvents: 'none',
    },
    '&::after': {
      content: '""',
      position: 'absolute' as const,
      bottom: -40,
      left: 80,
      width: 140,
      height: 140,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.05)',
      pointerEvents: 'none',
    },
  },

  modalIconBox: {
    width: 52,
    height: 52,
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.18)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    zIndex: 1,
  },

  modalTitleBox: {
    flex: 1,
    zIndex: 1,
  },

  modalTitle: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.2rem',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },

  modalSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.82rem',
    marginTop: theme.spacing(0.3),
  },

  modalStatChips: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(0.75),
    zIndex: 1,
    flexShrink: 0,
  },

  modalStatChip: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(1.25),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
  },

  modalCloseBtn: {
    color: 'rgba(255,255,255,0.8)',
    zIndex: 1,
    '&:hover': { background: 'rgba(255,255,255,0.12)' },
  },

  reviewCardRoot: {
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1.5px solid',
    marginBottom: theme.spacing(2),
  },

  reviewCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    borderBottom: '1px solid',
  },

  reviewCardIconBox: {
    width: 30,
    height: 30,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  reviewCardCountBadge: {
    marginLeft: 'auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    borderRadius: '20px',
  },

  reviewCardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 0,
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },

  reviewCardCell: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
  },

  reviewFieldLabel: {
    fontSize: '0.67rem',
    color: 'text.disabled',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: theme.spacing(0.3),
  },

  reviewFieldValue: {
    fontSize: '0.84rem',
    wordBreak: 'break-word' as const,
  },

  reviewRowRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },

  reviewRowLabel: {
    fontSize: '0.78rem',
    color: 'text.disabled',
    minWidth: 150,
  },

  reviewRowValue: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'text.primary',
    flex: 1,
  },

  attachmentsRoot: {
    borderRadius: '14px',
    border: '1.5px solid rgba(46,125,50,0.25)',
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
  },

  attachmentsHeader: {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    background: 'linear-gradient(135deg, rgba(46,125,50,0.1) 0%, rgba(46,125,50,0.04) 100%)',
    borderBottom: '1px solid rgba(46,125,50,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  attachmentsIconBox: {
    width: 30,
    height: 30,
    borderRadius: '8px',
    background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(46,125,50,0.3)',
    flexShrink: 0,
  },

  attachmentsCountBadge: {
    marginLeft: 'auto',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    borderRadius: '20px',
    background: 'rgba(46,125,50,0.12)',
    border: '1px solid rgba(46,125,50,0.25)',
  },

  attachmentsChipsRow: {
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(1),
  },

  actionBar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    gap: theme.spacing(1.5),
    flexWrap: 'wrap' as const,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      alignItems: 'stretch',
    },
  },

  actionBarHint: {
    fontSize: '0.78rem',
    color: 'text.secondary',
  },

  actionBarButtons: {
    display: 'flex',
    gap: theme.spacing(1.5),
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column' as const,
      width: '100%',
      '& .MuiButton-root': {
        width: '100%',
        justifyContent: 'center',
      },
    },
  },
});
