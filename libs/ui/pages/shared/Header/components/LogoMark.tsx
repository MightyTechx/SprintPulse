import { Typography } from '@infygen/component';

interface LogoMarkProps {
  compact?: boolean;
}

const LogoMark = ({ compact = false }: LogoMarkProps) => {
  return (
    <Typography
        variant='h6'
        sx={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700,
          fontSize: compact ? '0.75rem' : '1.1rem',
          color: '#fff',
          letterSpacing: compact ? 1 : 2,
          textShadow: '0 0 10px rgba(0,242,255,0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        SPRINT PULSE
      </Typography>
  );
};

export default LogoMark;
