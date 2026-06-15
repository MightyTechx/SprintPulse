/**
 * WhatsApp Reports Routes
 * API endpoints for WhatsApp report functionality
 */

import { Router } from 'express';
import {
  sendReport,
  getScheduledReports,
  createScheduledReport,
  updateScheduledReport,
  deleteScheduledReport,
  toggleScheduledReport,
  triggerScheduledReport,
  getStatus,
} from './WhatsAppReports.controller';

const router = Router();

/**
 * @route   GET /api/admin/whatsapp/status
 * @desc    Get WhatsApp service configuration status
 * @access  Admin
 */
router.get('/status', getStatus);

/**
 * @route   POST /api/admin/whatsapp/send
 * @desc    Send a report immediately via WhatsApp
 * @access  Admin
 * @body    { recipient: string, reportType: string, sprintIds?: string[] }
 */
router.post('/send', sendReport);

/**
 * @route   GET /api/admin/whatsapp/scheduled
 * @desc    Get all scheduled reports
 * @access  Admin
 */
router.get('/scheduled', getScheduledReports);

/**
 * @route   POST /api/admin/whatsapp/scheduled
 * @desc    Create a new scheduled report
 * @access  Admin
 * @body    { recipient: string, reportType: string, frequency: 'hourly' | 'daily', sprintIds?: string[] }
 */
router.post('/scheduled', createScheduledReport);

/**
 * @route   PUT /api/admin/whatsapp/scheduled/:id
 * @desc    Update a scheduled report
 * @access  Admin
 * @body    { recipient?: string, reportType?: string, frequency?: 'hourly' | 'daily', enabled?: boolean, sprintIds?: string[] }
 */
router.put('/scheduled/:id', updateScheduledReport);

/**
 * @route   DELETE /api/admin/whatsapp/scheduled/:id
 * @desc    Delete a scheduled report
 * @access  Admin
 */
router.delete('/scheduled/:id', deleteScheduledReport);

/**
 * @route   PATCH /api/admin/whatsapp/scheduled/:id/toggle
 * @desc    Toggle scheduled report enabled/disabled
 * @access  Admin
 * @body    { enabled: boolean }
 */
router.patch('/scheduled/:id/toggle', toggleScheduledReport);

/**
 * @route   POST /api/admin/whatsapp/scheduled/:id/trigger
 * @desc    Manually trigger a scheduled report to send immediately
 * @access  Admin
 */
router.post('/scheduled/:id/trigger', triggerScheduledReport);

export default router;
