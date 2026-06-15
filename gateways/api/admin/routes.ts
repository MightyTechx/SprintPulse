import { Router } from 'express';

import featureFlagsRoutes from './FeatureFlags/FeatureFlags.routes';
import configurationsRoutes from './Configurations/Configurations.routes';
import chatAIRoutes from './ChatAI/ChatAI.routes';
import { ADMIN_PATHS } from '@sprintpulse/constants';

const router = Router();

router.use(`/${ADMIN_PATHS.FEATURE_FLAGS}`, featureFlagsRoutes);
router.use(`/${ADMIN_PATHS.CONFIGURATIONS}`, configurationsRoutes);
router.use('/chat', chatAIRoutes);

export default router;
