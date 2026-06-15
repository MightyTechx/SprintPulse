import { Router } from 'express';

import featureFlagsRoutes from './FeatureFlags/FeatureFlags.routes';
import chatAIRoutes from './ChatAI/ChatAI.routes';
import whatsAppReportsRoutes from './WhatsAppReports/WhatsAppReports.routes';
import { ADMIN_PATHS } from '@sprintpulse/constants';

const router = Router();

router.use(`/${ADMIN_PATHS.FEATURE_FLAGS}`, featureFlagsRoutes);
router.use('/chat', chatAIRoutes);
router.use('/whatsapp', whatsAppReportsRoutes);

export default router;
