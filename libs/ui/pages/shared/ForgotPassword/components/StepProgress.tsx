import { Box, Typography } from '@sprintpulse/component';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckIcon from '@mui/icons-material/Check';
import type { Step } from '../hooks/useForgotPassword';

const RECOVERY_STEPS = [
  { label: 'Email', icon: MailOutlineIcon },
  { label: 'Verify OTP', icon: MarkEmailReadIcon },
  { label: 'New Password', icon: LockResetIcon },
];

interface StepProgressProps {
  step: Step;
  classes: Record<string, string>;
}

const StepProgress = ({ step, classes }: StepProgressProps) => {
  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  return (
    <Box className={classes.stepRow}>
      {RECOVERY_STEPS.map((s, i) => {
        const StepIcon = s.icon;
        const done = i < stepIndex;
        const active = i === stepIndex;
        return (
          <Box key={s.label} className={classes.stepItem}>
            <Box
              className={`${classes.stepCircle} ${done ? classes.stepDone : active ? classes.stepActive : classes.stepIdle}`}
            >
              {done ? (
                <CheckIcon className={classes.stepIcon} />
              ) : (
                <StepIcon className={classes.stepIcon} />
              )}
            </Box>
            <Typography className={`${classes.stepLabel} ${active ? classes.stepLabelActive : ''}`}>
              {s.label}
            </Typography>
          </Box>
        );
      })}
      {RECOVERY_STEPS.slice(0, -1).map((_, i) => {
        const done = i < stepIndex;
        return (
          <Box
            key={i}
            className={`${classes.stepConnector} ${done ? classes.stepConnectorDone : ''}`}
          />
        );
      })}
    </Box>
  );
};

export default StepProgress;
