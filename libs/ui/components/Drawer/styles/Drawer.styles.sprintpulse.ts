import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@sprintpulse/theme';
import { getBaseStyles } from './Drawer.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme));
