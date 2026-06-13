import { createAppMetadata } from '@infygen/theme';
import { getBaseMetadata } from './metadata.shared';

export const useMetadata = createAppMetadata(
  getBaseMetadata(),
  {},
  {
    'wind-tree': { tenet: 'Wind Tree' },
  },
);
