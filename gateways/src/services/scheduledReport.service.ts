/**
 * Scheduled Reports Service
 * Handles automatic hourly report generation and sending
 */

import { whatsAppService } from './whatsapp.service';

// In-memory store for scheduled reports (in production, use database)
interface ScheduledReportJob {
  id: string;
  reportType: string;
  recipient: string;
  frequency: 'hourly' | 'daily';
  enabled: boolean;
  lastSent?: Date;
  nextRun?: Date;
  sprintIds: string[];
}

// Demo recipients - in production, load from database
const DEFAULT_RECIPIENTS = [
  '9876543210', // Replace with actual phone numbers
];

class ScheduledReportService {
  private jobs: Map<string, ScheduledReportJob> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    // Initialize demo jobs
    this.initializeDemoJobs();
  }

  /**
   * Initialize demo scheduled jobs
   */
  private initializeDemoJobs(): void {
    // Hourly report job
    const hourlyJob: ScheduledReportJob = {
      id: 'hourly-report-1',
      reportType: 'Sprint Pulse Report',
      recipient: DEFAULT_RECIPIENTS[0],
      frequency: 'hourly',
      enabled: true,
      sprintIds: ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'],
      nextRun: this.getNextHourlyRun(),
    };

    // Daily report job
    const dailyJob: ScheduledReportJob = {
      id: 'daily-report-1',
      reportType: 'Sprint Pulse Report',
      recipient: DEFAULT_RECIPIENTS[0],
      frequency: 'daily',
      enabled: true,
      sprintIds: ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'],
      nextRun: this.getNextDailyRun(),
    };

    this.jobs.set(hourlyJob.id, hourlyJob);
    this.jobs.set(dailyJob.id, dailyJob);
  }

  /**
   * Calculate next hourly run (at the start of next hour)
   */
  private getNextHourlyRun(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(0, 0, 0);
    next.setHours(next.getHours() + 1);
    return next;
  }

  /**
   * Calculate next daily run (at 8 AM)
   */
  private getNextDailyRun(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(8, 0, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  }

  /**
   * Get all scheduled jobs
   */
  getScheduledJobs(): ScheduledReportJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get job by ID
   */
  getJob(id: string): ScheduledReportJob | undefined {
    return this.jobs.get(id);
  }

  /**
   * Create a new scheduled job
   */
  createJob(job: Omit<ScheduledReportJob, 'id' | 'nextRun'>): ScheduledReportJob {
    const newJob: ScheduledReportJob = {
      ...job,
      id: `job-${Date.now()}`,
      nextRun: job.frequency === 'hourly' ? this.getNextHourlyRun() : this.getNextDailyRun(),
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  /**
   * Update a scheduled job
   */
  updateJob(id: string, updates: Partial<ScheduledReportJob>): ScheduledReportJob | null {
    const job = this.jobs.get(id);
    if (!job) return null;

    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  /**
   * Delete a scheduled job
   */
  deleteJob(id: string): boolean {
    return this.jobs.delete(id);
  }

  /**
   * Toggle job enabled/disabled
   */
  toggleJob(id: string, enabled: boolean): ScheduledReportJob | null {
    return this.updateJob(id, { enabled });
  }

  /**
   * Generate mock KPI data for demo purposes
   */
  private generateMockKpiData(): any[] {
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
      ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10'].forEach((s) => {
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

  /**
   * Generate mock blocker data
   */
  private generateMockDowntimeData(): any[] {
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

  /**
   * Execute scheduled report job
   */
  private async executeJob(job: ScheduledReportJob): Promise<void> {
    if (!job.enabled) return;

    console.log(`[ScheduledReport] Executing job: ${job.id} (${job.reportType})`);

    try {
      // Generate mock data (in production, fetch from database)
      const kpiData = this.generateMockKpiData();
      const downtimeData = this.generateMockDowntimeData();

      // Send via WhatsApp
      const result = await whatsAppService.sendHourlyReport(
        job.recipient,
        job.reportType,
        kpiData,
        downtimeData,
        job.sprintIds,
      );

      // Update job status
      const now = new Date();
      this.updateJob(job.id, {
        lastSent: now,
        nextRun: job.frequency === 'hourly' ? this.getNextHourlyRun() : this.getNextDailyRun(),
      });

      console.log(`[ScheduledReport] Job ${job.id} completed. Success: ${result.success}`);

      if (result.messageId) {
        console.log(`[ScheduledReport] Message ID: ${result.messageId}`);
      }
    } catch (error) {
      console.error(`[ScheduledReport] Job ${job.id} failed:`, error);
    }
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('[ScheduledReport] Scheduler already running');
      return;
    }

    console.log('[ScheduledReport] Starting scheduler...');
    this.isRunning = true;

    // Check every minute for jobs to run
    this.intervalId = setInterval(() => {
      this.checkAndExecuteJobs();
    }, 60000); // Check every minute

    // Run immediately on start
    this.checkAndExecuteJobs();
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[ScheduledReport] Scheduler stopped');
  }

  /**
   * Check and execute jobs that are due
   */
  private checkAndExecuteJobs(): void {
    const now = new Date();
    this.jobs.forEach((job) => {
      if (job.enabled && job.nextRun && new Date(job.nextRun) <= now) {
        this.executeJob(job);
      }
    });
  }

  /**
   * Manually trigger a job
   */
  async triggerJob(
    jobId: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { success: false, error: 'Job not found' };
    }

    const kpiData = this.generateMockKpiData();
    const downtimeData = this.generateMockDowntimeData();

    return whatsAppService.sendHourlyReport(
      job.recipient,
      job.reportType,
      kpiData,
      downtimeData,
      job.sprintIds,
    );
  }
}

// Singleton instance
export const scheduledReportService = new ScheduledReportService();

// Auto-start scheduler
scheduledReportService.start();

export default ScheduledReportService;
