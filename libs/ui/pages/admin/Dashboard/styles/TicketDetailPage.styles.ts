import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@infygen/theme';
import { getTicketDetailBaseStyles } from './TicketDetailPage.styles.shared';

export const useTicketDetailStyles = createAppStyles(
  (theme: Theme) => getTicketDetailBaseStyles(theme),
  {},
);