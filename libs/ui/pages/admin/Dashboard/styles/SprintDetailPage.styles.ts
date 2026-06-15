import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@sprintpulse/theme';
import { getSprintDetailBaseStyles } from './SprintDetailPage.styles.shared';

export const useSprintDetailStyles = createAppStyles(
  (theme: Theme) => getSprintDetailBaseStyles(theme),
  {},
);
