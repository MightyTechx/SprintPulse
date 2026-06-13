import { Box, Typography } from '@infygen/component';
import { useMetadata } from '../metadata';

const TurbineSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 100 100'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    style={{ width: 32, height: 32 }}
  >
    <path d='M47 42 L53 42 L56 92 L44 92 Z' stroke='rgba(255,255,255,0.2)' strokeWidth={2} />
    <g style={{ transformOrigin: '50px 42px', animation: 'spin 5s linear infinite' }}>
      <circle cx={50} cy={42} r={3} fill='var(--neon-cyan)' />
      <path d='M50 42 L50 4 Q61 4 56 42 Z' fill='var(--neon-cyan)' />
      <path d='M50 42 L84 64 Q89 74 50 48 Z' fill='var(--neon-cyan)' />
      <path d='M50 42 L16 64 Q11 74 50 48 Z' fill='var(--neon-cyan)' />
    </g>
  </svg>
);

const FEATURES = [
  { label: 'Sprint Planning' },
  { label: 'Ticket & Issue Tracking' },
  { label: 'Defect Management' },
  { label: 'Team Workflows' },
  { label: 'Agile Boards' },
  { label: 'Project Collaboration' },
];

interface LeftPanelProps {
  classes: Record<string, string>;
  onNavigateSignUp: () => void;
}

const LeftPanel = ({ classes, onNavigateSignUp }: LeftPanelProps) => {
  const metadata = useMetadata();
  return (
    <Box className={classes.leftPanel}>
      <Box className={classes.circle1} />
      <Box className={classes.circle2} />
      <Box className={classes.circle3} />

      <Box className={classes.logoContainer}>
        {/* <Box component='span' className={classes.brandIcon}>
          <TurbineSVG />
        </Box> */}
        <Typography component='span' className={classes.brandTitle}>
          {metadata.tenet}
        </Typography>
      </Box>

      <Typography variant='h4' fontWeight={700} className={classes.heroHeading}>
        Agile Project
        <br />
        Management
      </Typography>
      <Typography className={classes.heroSubtitle}>
        A Jira-like platform for managing sprint planning, tasks, bugs, and project progress across
        your Agile teams.
      </Typography>

      {FEATURES.map(({ label }) => (
        <Box key={label} className={classes.featureRow}>
          <Box className={classes.featureIconWrap}>
            <Box component='span' className={classes.featureDot} />
          </Box>
          <Typography className={classes.featureLabel}>{label}</Typography>
        </Box>
      ))}

      <Box className={classes.signupLink} onClick={onNavigateSignUp}>
        New to {metadata.tenet}? <strong>Create an account</strong>
      </Box>
    </Box>
  );
};

export default LeftPanel;
