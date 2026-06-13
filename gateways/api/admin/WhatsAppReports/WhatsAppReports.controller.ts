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
  turbineIds: string[];
}

interface ScheduleReportBody {
  recipient: string;
  reportType: string;
  frequency: 'hourly' | 'daily';
  turbineIds: string[];
  enabled?: boolean;
}

/**
 * Send a report via WhatsApp
 * POST /api/admin/whatsapp/send
 */
export const sendReport = async (req: Request, res: Response) => {
  try {
    const { recipient, reportType, turbineIds } = req.body as SendReportBody;

    if (!recipient || !reportType) {
      res.status(400).json({ error: 'Recipient and report type are required' });
      return;
    }

    // Generate mock data for the report
    const kpiData = generateMockKpiData(turbineIds || ['t01', 't02', 't03', 't04', 't05']);
    const downtimeData = generateMockDowntimeData();

    const result = await whatsAppService.sendHourlyReport(
      recipient,
      reportType,
      kpiData,
      downtimeData,
      turbineIds || ['t01', 't02', 't03', 't04', 't05'],
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
    const { recipient, reportType, frequency, turbineIds, enabled } =
      req.body as ScheduleReportBody;

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
      turbineIds: turbineIds || ['t01', 't02', 't03', 't04', 't05'],
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
function generateMockKpiData(turbineIds: string[]): any[] {
  const kpiLabels = [
    'Generation (kWh)',
    'Up Time (hh:mm)',
    'Unscheduled Down Time (hh:mm)',
    'Scheduled Down Time (hh:mm)',
    'Machine Availability (%)',
    'Average Wind Speed (m/s)',
    'Capacity Utilization Factor (CUF %)',
  ];

  return kpiLabels.map((kpi, i) => {
    const values: Record<string, string> = {};
    const allTurbineIds = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'];

    allTurbineIds.forEach((t) => {
      if (kpi.includes('Generation')) {
        values[t] = (Math.random() * 1000 + 500).toFixed(2);
      } else if (kpi.includes('Availability')) {
        values[t] = (Math.random() * 15 + 85).toFixed(2);
      } else if (kpi.includes('Wind')) {
        values[t] = (Math.random() * 10 + 5).toFixed(2);
      } else if (kpi.includes('CUF')) {
        values[t] = (Math.random() * 10 + 20).toFixed(2);
      } else if (kpi.includes('Time')) {
        values[t] = `${Math.floor(Math.random() * 24)
          .toString()
          .padStart(2, '0')}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, '0')}`;
      } else {
        values[t] = '-';
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
  const downtimeTypes = ['Scheduled', 'Unscheduled', 'Grid Fault', 'Communication Loss'];
  const faultStatuses = [
    '(Cnv) Type C stop : Emergency',
    '(Grd) Grid fault condition',
    '(Nac) Yaw mis-alignment',
    'WTU Communication Timeout',
  ];

  return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
    id: i + 1,
    turbineNo: `T-${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`,
    from: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    to: new Date().toISOString(),
    duration: `${Math.floor(Math.random() * 5)
      .toString()
      .padStart(2, '0')}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`,
    downtimeType: downtimeTypes[Math.floor(Math.random() * downtimeTypes.length)],
    faultStatus: faultStatuses[Math.floor(Math.random() * faultStatuses.length)],
    remarks: 'Auto-generated hourly report',
  }));
}
