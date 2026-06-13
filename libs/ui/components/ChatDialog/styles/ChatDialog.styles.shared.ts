import { Theme } from '@mui/material/styles';
import { CSSObject } from 'tss-react';

export const getBaseStyles = (theme: Theme): Record<string, CSSObject> => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1400,
    animation: 'fadeIn 0.3s ease-out',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },

  dialog: {
    width: '480px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    borderRadius: '20px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(145deg, #1a1f3e 0%, #0f1729 50%, #0d1320 100%)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    position: 'relative',
    animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '@keyframes slideUp': {
      from: { transform: 'translateY(30px) scale(0.95)', opacity: 0 },
      to: { transform: 'translateY(0) scale(1)', opacity: 1 },
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      maxWidth: '100vw',
      maxHeight: '90vh',
      borderRadius: '24px 24px 0 0',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  },

  header: {
    padding: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    position: 'relative',
    zIndex: 2,
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },

  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%)',
      borderRadius: '14px 14px 0 0',
    },
  },

  aiIcon: {
    color: '#ffffff',
    fontSize: '1.6rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    position: 'relative',
    zIndex: 1,
  },

  pulseRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: '14px',
    border: '2px solid rgba(168, 85, 247, 0.6)',
    transform: 'translate(-50%, -50%)',
    animation: 'pulseRing 2s ease-out infinite',
    '@keyframes pulseRing': {
      '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
      '100%': { transform: 'translate(-50%, -50%) scale(1.8)', opacity: 0 },
    },
  },

  pulseRingDelay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: '14px',
    border: '2px solid rgba(139, 92, 246, 0.4)',
    transform: 'translate(-50%, -50%)',
    animation: 'pulseRing 2s ease-out 1s infinite',
  },

  title: {
    color: '#e2e8f0',
    fontWeight: 700,
    fontSize: '1.1rem',
    letterSpacing: '0.02em',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  },

  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginTop: 2,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #34d399)',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
    animation: 'statusPulse 2s ease-in-out infinite',
    '@keyframes statusPulse': {
      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
      '50%': { opacity: 0.6, transform: 'scale(0.85)' },
    },
  },

  statusText: {
    color: '#6ee7b7',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },

  closeButton: {
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.15)',
      transform: 'rotate(90deg)',
    },
  },

  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    minHeight: 300,
    maxHeight: 400,
    [theme.breakpoints.down('sm')]: {
      minHeight: 250,
      maxHeight: 350,
    },
  },

  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
  },

  userMessageWrapper: {
    flexDirection: 'row-reverse',
  },

  aiMessageWrapper: {
    flexDirection: 'row',
  },

  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  messageAvatarIcon: {
    color: '#a855f7',
    fontSize: '1.2rem',
  },

  messageAvatarIconUser: {
    color: '#6366f1',
    fontSize: '1.2rem',
  },

  messageBubble: {
    padding: theme.spacing(1.5, 2),
    borderRadius: '16px',
    maxWidth: '75%',
    position: 'relative',
  },

  userBubble: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    borderBottomRightRadius: '4px',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
  },

  aiBubble: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderBottomLeftRadius: '4px',
    backdropFilter: 'blur(8px)',
  },

  messageText: {
    color: '#f1f5f9',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    fontFamily: 'inherit',
  },

  messageTime: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.65rem',
    marginTop: theme.spacing(0.5),
    textAlign: 'right',
  },

  inputArea: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.8) 100%)',
    borderTop: '1px solid rgba(99, 102, 241, 0.15)',
    position: 'relative',
    zIndex: 2,
  },

  inputField: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      background: 'rgba(30, 41, 59, 0.7)',
      borderRadius: '14px',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      transition: 'all 0.2s ease',
      '& fieldset': {
        border: 'none',
      },
      '&:hover': {
        background: 'rgba(30, 41, 59, 0.85)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
      },
      '&.Mui-focused': {
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.5)',
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
      },
    },
    '& .MuiInputBase-input': {
      color: '#e2e8f0',
      padding: theme.spacing(1.25, 1.5),
      fontSize: '0.9rem',
      lineHeight: 1.4,
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.4)',
        opacity: 1,
      },
    },
  },

  sendButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#ffffff',
    width: 44,
    height: 44,
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    '&:hover': {
      background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
      transform: 'scale(1.08)',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  },

  sendButtonDisabled: {
    background: 'rgba(99, 102, 241, 0.2)',
    color: 'rgba(255, 255, 255, 0.3)',
    boxShadow: 'none',
    '&:hover': {
      background: 'rgba(99, 102, 241, 0.2)',
      transform: 'none',
    },
  },

  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.06) 1px, transparent 0)',
    backgroundSize: '24px 24px',
    pointerEvents: 'none',
    zIndex: 0,
  },

  glowOrb1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'floatOrb 6s ease-in-out infinite',
    '@keyframes floatOrb': {
      '0%, 100%': { transform: 'translate(0, 0)' },
      '50%': { transform: 'translate(-20px, 20px)' },
    },
  },

  glowOrb2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'floatOrb2 8s ease-in-out infinite',
    '@keyframes floatOrb2': {
      '0%, 100%': { transform: 'translate(0, 0)' },
      '50%': { transform: 'translate(15px, -15px)' },
    },
  },

  suggestionsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1.5),
  },

  suggestionChip: {
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#a5b4fc',
    fontSize: '0.7rem',
    height: 28,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(99, 102, 241, 0.3)',
      borderColor: 'rgba(99, 102, 241, 0.5)',
      color: '#c7d2fe',
      transform: 'scale(1.02)',
    },
    '& .MuiChip-icon': {
      color: '#818cf8',
    },
  },

  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: theme.spacing(0.5, 1),
  },

  typingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#818cf8',
    animation: 'typingBounce 1.4s ease-in-out infinite',
    '&:nth-of-type(1)': { animationDelay: '0s' },
    '&:nth-of-type(2)': { animationDelay: '0.2s' },
    '&:nth-of-type(3)': { animationDelay: '0.4s' },
    '@keyframes typingBounce': {
      '0%, 60%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
      '30%': { transform: 'translateY(-6px)', opacity: 1 },
    },
  },
});
