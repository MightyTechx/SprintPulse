import { Router } from 'express';
import { prisma } from '@sprintpulse/database';
import { ConfigurationsController } from './Configurations.controller';

const controller = new ConfigurationsController(prisma);
const router = Router();

router.get('/:entity', controller.getAll);
router.post('/:entity', controller.create);
router.put('/:entity/:id', controller.update);
router.patch('/:entity/:id/toggle', controller.toggle);
router.delete('/:entity/:id', controller.remove);

export default router;
