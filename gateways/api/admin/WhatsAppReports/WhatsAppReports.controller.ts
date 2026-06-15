/**
 * WhatsApp Reports Controller
 * Handles API endpoints for WhatsApp report functionality
 */

import { whatsAppService } from '../../../src/services/whatsapp.service';
import { Request, Response } from 'express';

// Dynamic import for scheduledReportService to avoid circular dependency
let scheduledReportService: any = null;
const getScheduledReportService = async () => {
  if (!scheduledReportService) {
    const module = await import('../../../src/services/scheduledReport.service');
    scheduledReportService = module.scheduledReportService;
  }
  return scheduledReportService;
};

interface SendReportBody {
  recipient: string;
  reportType: string;
  sprintIds: string[];
}

interface ScheduleReportBody {
  recipient: string;
  reportType: string;
  frequency: 'hourly' | 'daily';
  sprintIds: string[];
  enabled?: boolean;
}

/**
 * Send a report via WhatsApp
 * POST /api/admin/whatsapp/send
 */
export const sendReport = async (req: Request, res: Response) => {
  try {
    const { recipient, reportType, sprintIds } = req.body as SendReportBody;

    if (!recipient || !reportType) {
      res.status(400).json({ error: 'Recipient and report type are required' });
      return;
    }

    // Generate mock data for the report
    const kpiData = generateMockKpiData(sprintIds || ['s01', 's02', 's03', 's04', 's05']);
    const downtimeData = generateMockDowntimeData();

    const result = await whatsAppService.sendHourlyReport(
      recipient,
      reportType,
      kpiData,
      downtimeData,
      sprintIds || ['s01', 's02', 's03', 's04', 's05'],
    );

    if (result.success) {
      res.json({
        success: true,
        messageId: result.messageId,
        message: 'Report sent successfully via WhatsApp',
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send report',
      });
    }
  } catch (error: any) {
    console.error('[WhatsApp Controller] Send error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get scheduled reports
 * GET /api/admin/whatsapp/scheduled
 */
export const getScheduledReports = async (_req: Request, res: Response) => {
  try {
    const service = await getScheduledReportService();
    const jobs = service.getScheduledJobs();
    res.json({ success: true, jobs });
  } catch (error: any) {
    console.error('[WhatsApp Controller] Get scheduled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Create a scheduled report
 * POST /api/admin/whatsapp/scheduled
 */
export const createScheduledReport = async (req: Request, res: Response) => {
  try {
    const { recipient, reportType, frequency, sprintIds, enabled } = req.body as ScheduleReportBody;

    if (!recipient || !reportType || !frequency) {
      res.status(400).json({ error: 'Recipient, report type, and frequency are required' });
      return;
    }

    const service = await getScheduledReportService();
    const job = service.createJob({
      reportType,
      recipient,
      frequency,
      enabled: enabled ?? true,
      sprintIds: sprintIds || ['s01', 's02', 's03', 's04', 's05'],
    });

    res.json({
      success: true,
      job,
      message: `Scheduled ${frequency} report created for ${recipient}`,
    });
  } catch (error: any) {
    console.error('[WhatsApp Controller] Create scheduled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update a scheduled report
 * PUT /api/admin/whatsapp/scheduled/:id
 */
export const updateScheduledReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await getScheduledReportService();
    const job = service.updateJob(id, updates);

    if (job) {
      res.json({ success: true, job });
    } else {
      res.status(404).json({ error: 'Scheduled report not found' });
    }
  } catch (error: any) {
    console.error('[WhatsApp Controller] Update scheduled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete a scheduled report
 * DELETE /api/admin/whatsapp/scheduled/:id
 */
export const deleteScheduledReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await getScheduledReportService();
    const deleted = service.deleteJob(id);

    if (deleted) {
      res.json({ success: true, message: 'Scheduled report deleted' });
    } else {
      res.status(404).json({ error: 'Scheduled report not found' });
    }
  } catch (error: any) {
    console.error('[WhatsApp Controller] Delete scheduled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Toggle scheduled report
 * PATCH /api/admin/whatsapp/scheduled/:id/toggle
 */
export const toggleScheduledReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { enabled } = req.body;

    const service = await getScheduledReportService();
    const job = service.toggleJob(id, enabled);

    if (job) {
      res.json({ success: true, job, message: `Report ${enabled ? 'enabled' : 'disabled'}` });
    } else {
      res.status(404).json({ error: 'Scheduled report not found' });
    }
  } catch (error: any) {
    console.error('[WhatsApp Controller] Toggle scheduled error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Manually trigger a scheduled report
 * POST /api/admin/whatsapp/scheduled/:id/trigger
 */
export const triggerScheduledReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await getScheduledReportService();
    const result = await service.triggerJob(id);

    if (result.success) {
      res.json({
        success: true,
        messageId: result.messageId,
        message: 'Report triggered and sent successfully',
      });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error: any) {
    console.error('[WhatsApp Controller] Trigger error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get WhatsApp service status
 * GET /api/admin/whatsapp/status
 */
export const getStatus = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    configured: whatsAppService.isConfigured(),
    message: whatsAppService.isConfigured()
      ? 'WhatsApp service is configured'
      : 'WhatsApp service is in demo mode (not configured with real API)',
  });
};

// Helper functions to generate mock data
function generateMockKpiData(sprintIds: string[]): any[] {
  const kpiLabels = [
    'Story Points Completed',
    'Up Time (hh:mm)',
    'Unscheduled Blocked Time (hh:mm)',
    'Scheduled Standup Time (hh:mm)',
    'Sprint Progress (%)',
    'Average Velocity (pts/day)',
    'Capacity Utilization Factor (CUF %)',
  ];

  return kpiLabels.map((kpi, i) => {
    const values: Record<string, string> = {};
    const allSprintIds = ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'];

    allSprintIds.forEach((s) => {
      if (kpi.includes('Story Points')) {
        values[s] = (Math.random() * 50 + 20).toFixed(2);
      } else if (kpi.includes('Progress')) {
        values[s] = (Math.random() * 30 + 60).toFixed(2);
      } else if (kpi.includes('Velocity')) {
        values[s] = (Math.random() * 10 + 5).toFixed(2);
      } else if (kpi.includes('CUF')) {
        values[s] = (Math.random() * 10 + 20).toFixed(2);
      } else if (kpi.includes('Time')) {
        values[s] = `${Math.floor(Math.random() * 24)
          .toString()
          .padStart(2, '0')}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, '0')}`;
      } else {
        values[s] = '-';
      }
    });

    const numericValues = Object.values(values)
      .filter((v) => v !== '-')
      .map(Number);
    const total =
      numericValues.length > 0
        ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2)
        : '-';

    return {
      id: i + 1,
      kpi,
      ...values,
      total,
    };
  });
}

function generateMockDowntimeData(): any[] {
  const downtimeTypes = ['Standup', 'Code Review', 'Blocker', 'Communication Loss'];
  const issueStatuses = [
    'Blocked: Waiting on dependency',
    'In Review: Code review pending',
    'On Hold: Awaiting design',
    'Communication Timeout with team',
  ];

  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
    id: i + 1,
    sprintNo: `S-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
    from: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    to: new Date().toISOString(),
    duration: `${Math.floor(Math.random() * 5)
      .toString()
      .padStart(2, '0')}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`,
    downtimeType: downtimeTypes[Math.floor(Math.random() * downtimeTypes.length)],
    issueStatus: issueStatuses[Math.floor(Math.random() * issueStatuses.length)],
    remarks: 'Auto-generated hourly report',
  }));
}
