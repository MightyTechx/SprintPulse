import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@infygen/theme';
import { getBaseStyles } from './GridItem.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {
  admin: {
    root: {},
  },
  user: {
    root: {},
  },
  consultant: {
    root: {},
  },
});
