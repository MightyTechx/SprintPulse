import { Router } from 'express';
import { prisma } from '@infygen/database';
import { FeatureFlagsController } from './FeatureFlags.controller';

const controller = new FeatureFlagsController(prisma);
const router = Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/toggle', controller.toggle);
router.delete('/:id', controller.remove);

export default router;
