import { Box, Typography } from '@sprintpulse/component';
import { useMetadata } from '../metadata';

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
