import { Box, Typography } from '@sprintpulse/component';
import { useMetadata } from '../metadata';
import type { Step } from '../hooks/useForgotPassword';

const LEFT_STEPS = [
  { num: '01', title: 'Enter your email', desc: "We'll send a one-time passcode to your inbox" },
  { num: '02', title: 'Verify the OTP', desc: 'Enter the 6-digit code from your email' },
  { num: '03', title: 'Set new password', desc: 'Choose a strong password to secure your account' },
];

interface LeftPanelProps {
  step: Step;
  stepIndex: number;
  classes: Record<string, string>;
  onNavigateSignIn: () => void;
}

const LeftPanel = ({ stepIndex, classes, onNavigateSignIn }: LeftPanelProps) => {
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
        Account
        <br />
        Recovery
      </Typography>
      <Typography className={classes.heroSubtitle}>
        Regain secure access to your {metadata.tenet} Agile project management workspace in just a
        few steps.
      </Typography>

      {LEFT_STEPS.map((s, i) => (
        <Box key={s.num} className={classes.recoveryStep}>
          <Box
            className={`${classes.recoveryNum} ${i <= stepIndex ? classes.recoveryNumActive : ''}`}
          >
            {i < stepIndex ? '✓' : s.num}
          </Box>
          <Box>
            <Typography
              fontWeight={600}
              className={`${classes.recoveryStepTitle} ${i <= stepIndex ? classes.recoveryStepActiveTitle : classes.recoveryStepInactiveTitle}`}
            >
              {s.title}
            </Typography>
            <Typography
              variant='caption'
              className={`${classes.recoveryStepCaption} ${i <= stepIndex ? classes.recoveryStepActiveCaption : classes.recoveryStepInactiveCaption}`}
            >
              {s.desc}
            </Typography>
          </Box>
        </Box>
      ))}

      <Box className={classes.securityNote}>
        <Typography className={classes.securityNoteText}>
          Recovery codes expire in 15 minutes. Your data stays protected.
        </Typography>
      </Box>

      <Box className={classes.signinLink} onClick={onNavigateSignIn}>
        Remember your password? <strong>Sign in</strong>
      </Box>
    </Box>
  );
};

export default LeftPanel;
