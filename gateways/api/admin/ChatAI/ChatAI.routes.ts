import { Router, Request, Response } from 'express';
import { ChatAIController } from './ChatAI.controller';

const router = Router();
const chatAIController = new ChatAIController(process.env.GEMINI_API_KEY || '');

router.post('/', (req: Request, res: Response) => chatAIController.chat(req, res));

export default router;