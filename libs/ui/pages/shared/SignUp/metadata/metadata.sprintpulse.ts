import { createAppMetadata } from '@sprintpulse/theme';
import { getBaseMetadata } from './metadata.shared';

export const useMetadata = createAppMetadata(
  getBaseMetadata(),
  {},
  {
    sprintpulse: { tenet: 'SprintPulse' },
  },
);
