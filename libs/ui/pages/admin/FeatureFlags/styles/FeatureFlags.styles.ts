import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@infygen/theme';
import { getBaseStyles } from './FeatureFlags.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
