import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  DataTable,
  Typography,
  Grid,
  TextField,
  Button,
  PageHeader,
  Chip,
} from '@infygen/component';
import { InputAdornment, Autocomplete, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import type { Dayjs } from 'dayjs';
// eslint-disable-next-line no-duplicate-imports
import dayjs from 'dayjs';
import { useStyles } from './styles';
import {
  REPORT_TYPES,
  TURBINE_LIST,
  DOC_TYPES,
  getMonthlyKpiRows,
  getScheduledDowntimeRows,
  getUnscheduledDowntimeRows,
  calculateTotalDuration,
  getTemperatureAlertRows,
  getEventLogRows,
  getDowntimeAnalysisRows,
  getMachineAvailabilityRows,
  getWeeklyKpiRows,
  WeeklyKpiRow,
  getKpiRows,
  getDowntimeRows,
} from './utils/reports.utils';
import { useUtils } from './utils/Utils';
import { useAdminKeyframes } from '@infygen/hooks';
import { generatePdfReport } from '../../../utils/export/pdf/pdf.generator';
import { generateExcelReport } from '../../../utils/export/excel/excel.generator';
import { generateSvgExport } from '../../../utils/export/svg/svg.generator';

const SELECT_ALL = '__select_all__';
const ALL_TURBINES = TURBINE_LIST.filter((t) => t !== 'All Turbines');

// Parameter options for Temperature Alerts - like turbine multiselect
const PARAMETER_OPTIONS = [
  '(Gri) Active power ,1sec. (Max)',
  '(Met) Wind speed 1 ,calibration Act. (Max)',
  '(Trf) Winding Temp U ,1sec. (Max)',
  '(Trf) Winding Temp V ,1sec. (Max)',
  '(Trf) Winding Temp W ,1sec. (Max)',
  '(Gn) Bearing temp. DE ,1sec. (Max)',
  '(Gn) Bearing temp. NDE ,1sec. (Max)',
  '(Gn) Stator winding temp. U ,1sec. (Max)',
  '(Gn) Stator winding temp. V ,1sec. (Max)',
  '(Gn) Stator winding temp. W ,1sec. (Max)',
  '(Gbx) Bearing DE intermediate shaft temp. ,1sec. (Max)',
  '(Gbx) Bearing NDE intermediate shaft temp. ,1sec. (Max)',
  '(Gbx) Bearing DE temp. ,1sec. (Max)',
  '(Gbx) Bearing NDE temp. ,1sec. (Max)',
  '(Gbx) Oil Inlet temp. ,1sec. (Max)',
  '(Gbx) Oilsump temp. ,1sec. (Max)',
  '(Hy) Oil temperature ,1sec. (Max)',
  '(Cnv) Temp. MSC Inductance 1 (Max)',
  '(Cl) Cool Trf Heat Ex. In. temp. ,30sec. (Max)',
  '(Nac) Temp.sw.cab.Nacelle ,1sec. (Max)',
  '(Cnv) Temp. Ambient Outside (Max)',
  '(Cnv) Temp. GSC Inductance core (Max)',
  '(Cl) Cool Cnv Heat Ex. In. temp ,30sec. (Max)',
  '(Cl) Cool Cnv Heat Ex. Out. temp ,30sec. (Max)',
  '(Nac) Nacelle temp. averaged value ,1sec. (Max)',
  '(Pt) Blade angle ,Act. (Max)',
  '(Rot) Rotor speed encoder ,Act. (Max)',
  '(Rot) Rotor speed encoder X cycles (Max)',
  '(Rot) Rotor speed ,Act. (Max)',
  '(Met) Wind speed 2 ,calibration Act. (Max)',
  '(Met) Wind speed 1/2 ,calibration Act. (Max)',
  '(Met) Wind speed 1 ,1sec. (Max)',
  '(Met) Wind speed 1/2 ,1sec. (Max)',
  '(Met) Wind speed 2 ,1sec. (Max)',
  '(Met) Relative wind direction 1 ,1sec. (Max)',
  '(Met) Relative wind direction 1/2 ,1sec. (Max)',
  '(Met) Relative wind direction 2 ,1sec. (Max)',
  '(Nac) Nacelle position (Max)',
  '(Gbx) Oil pressure ,Act. (Max)',
  '(Cnv) Temp. GSC Inductance winding (Max)',
  '(Cnv) Coolant Inlet Pressure ,1sec. (Max)',
  '(Cnv) Coolant Outlet Pressure ,1sec. (Max)',
  '(Cnv) Temp. Ambient Chopper (Max)',
  '(Cnv) Temp. Ambient Control zone (Max)',
  '(Cnv) Temp. Ambient Converter zone (Max)',
  '(Cnv) Temp. Ambient Grid cell (Max)',
  '(Cnv) Temp. Ambient Machine cell (Max)',
  '(Cnv) Temp. Heatsink GSC 1 (Max)',
  '(Cnv) Temp. Heatsink GSC 2 (Max)',
  '(Cnv) Temp. Heatsink MSC 1 (Max)',
  '(Cnv) Temp. Heatsink MSC 2 (Max)',
  '(Cnv) Temp. Inlet Coolant Liquid (Max)',
  '(Hy) HSS Brake 1 pressure ,1sec. (Max)',
  '(Hy) HSS Brake 2 charging pressure ,1sec. (Max)',
  '(Hy) HSS Brake 2 pressure ,1sec. (Max)',
  '(Brk) Brake temp. B1 ,1sec. (Max)',
  '(Brk) Brake temp. B2 ,1sec. (Max)',
  '(Brk) Brake temp. Max ,1sec. (Max)',
  '(Cl) Coolant Pump Inlet Pressure ,1sec. (Max)',
  '(Cl) Coolant Pump Outlet Pressure ,1sec. (Max)',
  '(Gri) Current L1 ,1sec. (Max)',
  '(Gri) Current L2 ,1sec. (Max)',
  '(Gri) Current L3 ,1sec. (Max)',
  '(Gri) Frequency ,10min. (Max)',
  '(Gri) Voltage L1 L2 L3 ,1sec. (Max)',
  '(Gbx) Gear speed ,Act. (Max)',
  '(Cnv) Cnv-Generator Active Power (Max)',
  '(Ctl) Max Temp. Safety Terminals HCC (Max)',
  '(Ctl) Max Temp. Safety Terminals NCC (Max)',
  '(Ctl) Max Temp. Safety Terminals TCC (Max)',
  '(Ctl) Setpoint val. active power (Max)',
  '(Gn) Generator speed ,Act. (Max)',
  '(Gri) Apparent power ,1sec. (Max)',
  '(Gri) Current L1 ,10min. (Max)',
  '(Gri) Current L2 ,10min. (Max)',
  '(Gri) Current L3 ,10min. (Max)',
  '(Gri) Reactive power ,10min. (Max)',
  '(Gri) Reactive power MFR300 ,Act. (Max)',
  '(Gri) Voltage L1 ,10min. (Max)',
  '(Gri) Voltage L1 ,1sec. (Max)',
  '(Gri) Voltage L1 L2 L3 ,30sec. (Max)',
  '(Gri) Voltage L1 L2 L3 ,Act. (Max)',
  '(Gri) Voltage L2 ,10min. (Max)',
  '(Gri) Voltage L2 ,1sec. (Max)',
  '(Gri) Voltage L3 ,10min. (Max)',
  '(Gri) Voltage L3 ,1sec. (Max)',
  '(Met) Outdoor temp. ,1sec. (Max)',
  '(Nac) Nacelle temp. front ,1sec. (Max)',
  '(Nac) Nacelle temp. rear ,1sec. (Max)',
  '(Rot) Temp.sw.cab.Hub ,1sec. (Max)',
  '(Tow) Temp.sw.cab.1 Tower ,1sec. (Max)',
  'Torquem. setpoint inverter (Max)',
];

type ReportType = (typeof REPORT_TYPES)[number];

const Reports = () => {
  const { classes } = useStyles();

  const keyframes = useAdminKeyframes();

  const { kpiRows, downtimeRows, downtimeColumns, formatDateTime } = useUtils();

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const [reportType, setReportType] = useState<ReportType | null>('Daily Generation Report');
  const [selectedTurbines, setSelectedTurbines] = useState<string[]>(ALL_TURBINES);
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [docType, setDocType] = useState<string | null>('PDF');
  const [downloading, setDownloading] = useState(false);
  const [selectedParameters, setSelectedParameters] = useState<string[]>(PARAMETER_OPTIONS);

  const [kpiSearch, setKpiSearch] = useState('');
  const [dtSearch, setDtSearch] = useState('');
  const [weeklySearch, setWeeklySearch] = useState('');
  const [monthlyKpiSearch, setMonthlyKpiSearch] = useState('');
  const [scheduledSearch, setScheduledSearch] = useState('');
  const [unscheduledSearch, setUnscheduledSearch] = useState('');
  const [tempAlertSearch, setTempAlertSearch] = useState('');
  const [eventLogSearch, setEventLogSearch] = useState('');
  const [downtimeAnalysisSearch, setDowntimeAnalysisSearch] = useState('');
  const [machineAvailSearch, setMachineAvailSearch] = useState('');

  // WhatsApp related state
  const [whatsAppDialogOpen, setWhatsAppDialogOpen] = useState(false);
  const [whatsAppRecipient, setWhatsAppRecipient] = useState('');
  const [whatsAppSending, setWhatsAppSending] = useState(false);
  const [whatsAppSnackbar, setWhatsAppSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [scheduledJobs, setScheduledJobs] = useState<any[]>([]);
  const [scheduledDialogOpen, setScheduledDialogOpen] = useState(false);
  const [scheduledForm, setScheduledForm] = useState({
    recipient: '',
    frequency: 'hourly' as 'hourly' | 'daily',
    enabled: true,
  });
  const [scheduledLoading, setScheduledLoading] = useState(false);

  // WhatsApp dialog schedule state
  const [scheduleViaWhatsApp, setScheduleViaWhatsApp] = useState(false);
  const [whatsAppScheduleDate, setWhatsAppScheduleDate] = useState<Dayjs | null>(null);
  const [whatsAppScheduleTime, setWhatsAppScheduleTime] = useState<Dayjs | null>(null);
  const [whatsAppRepeatFrequency, setWhatsAppRepeatFrequency] = useState<string>('once');

  // Handle report type change - reset dates based on report type
  const handleReportTypeChange = (newType: ReportType | null) => {
    setReportType(newType);
    const today = dayjs().startOf('day');

    switch (newType) {
      case 'Weekly Generation Report':
        setFromDate(today.subtract(7, 'day'));
        setToDate(today);
        break;
      case 'Monthly Generation Report':
        setFromDate(today.subtract(1, 'month'));
        setToDate(today);
        break;
      default:
        setFromDate(today);
        setToDate(today);
    }
  };

  // Handle from date change - auto-adjust to date for weekly/monthly
  const handleFromDateChange = (newFromDate: Dayjs | null) => {
    setFromDate(newFromDate);
    if (newFromDate && reportType) {
      const today = dayjs().startOf('day');
      switch (reportType) {
        case 'Weekly Generation Report':
          setToDate(newFromDate.add(7, 'day').isAfter(today) ? today : newFromDate.add(7, 'day'));
          break;
        case 'Monthly Generation Report':
          setToDate(
            newFromDate.add(1, 'month').isAfter(today) ? today : newFromDate.add(1, 'month'),
          );
          break;
      }
    }
  };

  // Get selected turbine IDs for dynamic columns
  const selectedTurbineIds = useMemo(() => {
    return selectedTurbines.map((t) => t.replace('T-', 't').toLowerCase());
  }, [selectedTurbines]);

  // Monthly report data
  const monthlyData = useMemo(() => {
    if (reportType !== 'Monthly Generation Report' || !fromDate || !toDate) {
      return null;
    }
    const turbines = selectedTurbines;
    const scheduledRows = getScheduledDowntimeRows(fromDate, toDate, turbines);
    const unscheduledRows = getUnscheduledDowntimeRows(fromDate, toDate, turbines);
    return {
      kpiRows: getMonthlyKpiRows(turbines),
      scheduledRows,
      unscheduledRows,
      totalScheduledDuration: calculateTotalDuration(scheduledRows),
      totalUnscheduledDuration: calculateTotalDuration(unscheduledRows),
    };
  }, [reportType, fromDate, toDate, selectedTurbines]);

  // Temperature alert data
  const temperatureData = useMemo(() => {
    if (reportType !== 'Temperature Alerts' || !fromDate || !toDate) {
      return null;
    }
    return getTemperatureAlertRows(selectedTurbines, selectedParameters);
  }, [reportType, fromDate, toDate, selectedTurbines, selectedParameters]);

  // Event log data
  const eventLogData = useMemo(() => {
    if (reportType !== 'Event Log' || !fromDate || !toDate) {
      return null;
    }
    return getEventLogRows(fromDate, toDate, selectedTurbines);
  }, [reportType, fromDate, toDate, selectedTurbines]);

  // Downtime analysis data
  const downtimeAnalysisData = useMemo(() => {
    if (reportType !== 'Downtime Analysis (MTBF & MTTR)' || !fromDate || !toDate) {
      return null;
    }
    return getDowntimeAnalysisRows(fromDate, toDate, selectedTurbines);
  }, [reportType, fromDate, toDate, selectedTurbines]);

  // Machine availability data
  const machineAvailabilityData = useMemo(() => {
    if (reportType !== 'Machine Availability' || !fromDate || !toDate) {
      return null;
    }
    return getMachineAvailabilityRows(fromDate, toDate, selectedTurbines);
  }, [reportType, fromDate, toDate, selectedTurbines]);

  // Weekly report data
  const weeklyData = useMemo(() => {
    if (reportType !== 'Weekly Generation Report' || !fromDate || !toDate) {
      return null;
    }
    return getWeeklyKpiRows(selectedTurbines, fromDate, toDate);
  }, [reportType, fromDate, toDate, selectedTurbines]);

  const downloadEnabled =
    !!reportType && !!fromDate && !!toDate && selectedTurbines.length > 0 && docType !== 'WhatsApp';

  const whatsappScheduleEnabled =
    !!reportType && !!fromDate && !!toDate && selectedTurbines.length > 0;

  const filteredKpi = kpiSearch
    ? kpiRows.filter((r: any) => r.kpi.toLowerCase().includes(kpiSearch.toLowerCase()))
    : kpiRows;

  const filteredDt = dtSearch
    ? downtimeRows.filter((r: any) =>
        Object.values(r).some((v: any) => String(v).toLowerCase().includes(dtSearch.toLowerCase())),
      )
    : downtimeRows;

  const formatDate = (date: Dayjs | null): string => {
    if (!date) return '';
    return date.format('DD/MM/YYYY');
  };

  const handleDownload = async () => {
    if (!downloadEnabled || downloading) return;

    setDownloading(true);

    const metadata = {
      reportName: reportType || 'Report',
      turbine:
        selectedTurbines.length === ALL_TURBINES.length
          ? 'All Turbines'
          : selectedTurbines.join(', '),
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      generatedAt: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      // Get turbine IDs for dynamic columns
      const turbineIds =
        selectedTurbineIds.length > 0
          ? selectedTurbineIds
          : ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10'];

      if (docType === 'PDF') {
        // Generate PDF for all report types based on selected report
        if (isDailyReport) {
          const kpiData = getKpiRows();
          const dtData = getDowntimeRows();
          await generatePdfReport(metadata, kpiData, dtData, turbineIds);
        } else if (isWeeklyReport && weeklyData) {
          await generatePdfReport(metadata, weeklyData as any, filteredDt, turbineIds);
        } else if (isMonthlyReport && monthlyData) {
          await generatePdfReport(metadata, monthlyData.kpiRows as any, [], turbineIds);
        } else if (isTemperatureAlerts && temperatureData) {
          await generatePdfReport(metadata, temperatureData as any, [], turbineIds);
        } else if (isEventLog && eventLogData) {
          await generatePdfReport(metadata, eventLogData as any, [], turbineIds);
        } else if (isDowntimeAnalysis && downtimeAnalysisData) {
          await generatePdfReport(metadata, downtimeAnalysisData as any, [], turbineIds);
        } else if (isMachineAvailability && machineAvailabilityData) {
          await generatePdfReport(metadata, machineAvailabilityData as any, [], turbineIds);
        } else {
          // Fallback for other report types
          const kpiData = getKpiRows();
          await generatePdfReport(metadata, kpiData, [], turbineIds);
        }
      } else if (docType === 'Excel (XLSX)') {
        // Generate Excel for all report types
        if (isDailyReport) {
          const kpiData = getKpiRows();
          const dtData = getDowntimeRows();
          generateExcelReport(metadata, kpiData, dtData, turbineIds);
        } else if (isWeeklyReport && weeklyData) {
          generateExcelReport(metadata, weeklyData as any, filteredDt, turbineIds);
        } else if (isMonthlyReport && monthlyData) {
          generateExcelReport(metadata, monthlyData.kpiRows as any, [], turbineIds);
        } else if (isTemperatureAlerts && temperatureData) {
          generateExcelReport(metadata, temperatureData as any, [], turbineIds);
        } else if (isEventLog && eventLogData) {
          generateExcelReport(metadata, eventLogData as any, [], turbineIds);
        } else if (isDowntimeAnalysis && downtimeAnalysisData) {
          generateExcelReport(metadata, downtimeAnalysisData as any, [], turbineIds);
        } else if (isMachineAvailability && machineAvailabilityData) {
          generateExcelReport(metadata, machineAvailabilityData as any, [], turbineIds);
        } else {
          const kpiData = getKpiRows();
          generateExcelReport(metadata, kpiData, [], turbineIds);
        }
      } else if (docType === 'SVG') {
        // Generate SVG export with proper data
        if (isDailyReport) {
          generateSvgExport(metadata, 'chart', getKpiRows(), getDowntimeRows(), turbineIds);
        } else if (isWeeklyReport && weeklyData) {
          generateSvgExport(metadata, 'chart', weeklyData as any, filteredDt, turbineIds);
        } else if (isMonthlyReport && monthlyData) {
          generateSvgExport(metadata, 'chart', monthlyData.kpiRows as any, [], turbineIds);
        } else if (isTemperatureAlerts && temperatureData) {
          generateSvgExport(metadata, 'chart', temperatureData as any, [], turbineIds);
        } else if (isEventLog && eventLogData) {
          generateSvgExport(metadata, 'chart', eventLogData as any, [], turbineIds);
        } else if (isDowntimeAnalysis && downtimeAnalysisData) {
          generateSvgExport(metadata, 'chart', downtimeAnalysisData as any, [], turbineIds);
        } else if (isMachineAvailability && machineAvailabilityData) {
          generateSvgExport(metadata, 'chart', machineAvailabilityData as any, [], turbineIds);
        } else {
          generateSvgExport(metadata, 'default-chart', undefined, undefined, turbineIds);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const isDailyReport = reportType === 'Daily Generation Report';
  const isWeeklyReport = reportType === 'Weekly Generation Report';
  const isMonthlyReport = reportType === 'Monthly Generation Report';
  const isTemperatureAlerts = reportType === 'Temperature Alerts';
  const isEventLog = reportType === 'Event Log';
  const isDowntimeAnalysis = reportType === 'Downtime Analysis (MTBF & MTTR)';
  const isMachineAvailability = reportType === 'Machine Availability';

  // WhatsApp functions
  const handleSendToWhatsApp = async () => {
    if (!whatsAppRecipient.trim()) {
      setWhatsAppSnackbar({
        open: true,
        message: 'Please enter recipient phone number',
        severity: 'error',
      });
      return;
    }

    if (scheduleViaWhatsApp) {
      if (!whatsAppScheduleDate || !whatsAppScheduleTime) {
        setWhatsAppSnackbar({
          open: true,
          message: 'Please select date and time for scheduling',
          severity: 'error',
        });
        return;
      }
    }

    setWhatsAppSending(true);
    try {
      const API_BASE = '/api/admin/whatsapp';
      const turbineIds =
        selectedTurbineIds.length > 0 ? selectedTurbineIds : ['t01', 't02', 't03', 't04', 't05'];

      const requestBody: any = {
        recipient: whatsAppRecipient.replace(/\D/g, ''),
        reportType: reportType || 'Daily Generation Report',
        turbineIds,
      };

      if (scheduleViaWhatsApp && whatsAppScheduleDate && whatsAppScheduleTime) {
        const scheduledDateTime = whatsAppScheduleDate
          .hour(whatsAppScheduleTime.hour())
          .minute(whatsAppScheduleTime.minute())
          .second(0);
        requestBody.scheduledAt = scheduledDateTime.toISOString();
        requestBody.repeatFrequency = whatsAppRepeatFrequency;
        requestBody.scheduleEnabled = true;
      }

      const endpoint = scheduleViaWhatsApp ? `${API_BASE}/schedule` : `${API_BASE}/send`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (data.success) {
        setWhatsAppSnackbar({
          open: true,
          message: scheduleViaWhatsApp
            ? 'Report scheduled successfully!'
            : 'Report sent to WhatsApp successfully!',
          severity: 'success',
        });
        setWhatsAppDialogOpen(false);
      } else {
        setWhatsAppSnackbar({
          open: true,
          message: data.error || 'Failed to send report',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      setWhatsAppSnackbar({
        open: true,
        message: scheduleViaWhatsApp ? 'Failed to schedule report' : 'Failed to send report',
        severity: 'error',
      });
    } finally {
      setWhatsAppSending(false);
    }
  };

  const handleOpenWhatsAppDialog = () => {
    setWhatsAppDialogOpen(true);
    setWhatsAppRecipient('');
    setScheduleViaWhatsApp(false);
    setWhatsAppScheduleDate(null);
    setWhatsAppScheduleTime(null);
    setWhatsAppRepeatFrequency('once');
  };

  const handleFetchScheduledJobs = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp/scheduled');
      const data = await response.json();
      if (data.success) {
        setScheduledJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled jobs:', error);
    }
  };

  const handleOpenScheduledDialog = () => {
    handleFetchScheduledJobs();
    setScheduledDialogOpen(true);
    setScheduledForm({ recipient: '', frequency: 'hourly', enabled: true });
  };

  const handleCreateScheduledReport = async () => {
    if (!scheduledForm.recipient.trim()) {
      setWhatsAppSnackbar({
        open: true,
        message: 'Please enter recipient phone number',
        severity: 'error',
      });
      return;
    }
    setScheduledLoading(true);
    try {
      const API_BASE = '/api/admin/whatsapp/scheduled';
      const turbineIds =
        selectedTurbineIds.length > 0 ? selectedTurbineIds : ['t01', 't02', 't03', 't04', 't05'];
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: scheduledForm.recipient.replace(/\D/g, ''),
          reportType: reportType || 'Daily Generation Report',
          frequency: scheduledForm.frequency,
          enabled: scheduledForm.enabled,
          turbineIds,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setWhatsAppSnackbar({
          open: true,
          message: 'Scheduled report created!',
          severity: 'success',
        });
        handleFetchScheduledJobs();
        setScheduledForm({ recipient: '', frequency: 'hourly', enabled: true });
      } else {
        setWhatsAppSnackbar({
          open: true,
          message: data.error || 'Failed to create schedule',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Create scheduled error:', error);
      setWhatsAppSnackbar({ open: true, message: 'Failed to create schedule', severity: 'error' });
    } finally {
      setScheduledLoading(false);
    }
  };

  const handleToggleScheduledJob = async (jobId: string, enabled: boolean) => {
    try {
      await fetch(`/api/admin/whatsapp/scheduled/${jobId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      handleFetchScheduledJobs();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleDeleteScheduledJob = async (jobId: string) => {
    try {
      await fetch(`/api/admin/whatsapp/scheduled/${jobId}`, { method: 'DELETE' });
      handleFetchScheduledJobs();
      setWhatsAppSnackbar({ open: true, message: 'Scheduled report deleted', severity: 'success' });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleTriggerScheduledJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/admin/whatsapp/scheduled/${jobId}/trigger`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setWhatsAppSnackbar({
          open: true,
          message: 'Report sent immediately!',
          severity: 'success',
        });
      } else {
        setWhatsAppSnackbar({ open: true, message: 'Failed to trigger report', severity: 'error' });
      }
    } catch (error) {
      console.error('Trigger error:', error);
    }
  };

  // Dynamic KPI columns based on selected turbines
  const dynamicKpiColumns = useMemo(() => {
    const cols: any[] = [
      {
        id: 'kpi',
        label: 'Key Performance Indicator (KPI)',
        minWidth: 270,
        sortable: false,
        align: 'center',
        format: (v: any) => (
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              color: '#1e293b',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}
          >
            {String(v)}
          </Typography>
        ),
      },
    ];

    selectedTurbineIds.forEach((id, i) => {
      const turbineNum = id.replace('t', '');
      cols.push({
        id,
        label: `T${turbineNum.padStart(2, '0')}`,
        minWidth: 72,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      });
    });

    cols.push({
      id: 'total',
      label: 'Total / Avg',
      minWidth: 100,
      sortable: false,
      align: 'center',
      format: (v: any) => (
        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#4f46e5' }}>
          {String(v ?? '-')}
        </Typography>
      ),
    });
    return cols;
  }, [selectedTurbineIds]);

  // Temperature parameter columns
  const temperatureColumns = useMemo(() => {
    const cols: any[] = [
      {
        id: 'parameter',
        label: 'Parameter',
        minWidth: 300,
        sortable: false,
        align: 'center',
        format: (v: any) => (
          <Typography
            sx={{ fontWeight: 500, fontSize: '12px', color: '#1e293b', textAlign: 'center' }}
          >
            {String(v)}
          </Typography>
        ),
      },
    ];

    selectedTurbineIds.forEach((id) => {
      const turbineNum = id.replace('t', '');
      cols.push({
        id,
        label: `T${turbineNum.padStart(2, '0')}`,
        minWidth: 70,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontSize: '12px', color: '#334155' }}>{String(v)}</Typography>
        ),
      });
    });

    cols.push({
      id: 'avg',
      label: 'AVG',
      minWidth: 70,
      sortable: false,
      align: 'center',
      format: (v: any) => (
        <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#4f46e5' }}>
          {String(v ?? '-')}
        </Typography>
      ),
    });
    return cols;
  }, [selectedTurbineIds]);

  // Machine availability columns
  const machineAvailabilityColumns = useMemo(() => {
    const cols: any[] = [
      {
        id: 'date',
        label: 'Date',
        minWidth: 120,
        sortable: false,
        align: 'center',
        format: (v: any) => (
          <Typography sx={{ fontWeight: 500, fontSize: '12px', color: '#1e293b' }}>
            {String(v)}
          </Typography>
        ),
      },
    ];

    selectedTurbineIds.forEach((id) => {
      const turbineNum = id.replace('t', '');
      cols.push({
        id,
        label: `T${turbineNum.padStart(2, '0')}`,
        minWidth: 70,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontSize: '12px', color: '#334155' }}>{String(v)}</Typography>
        ),
      });
    });

    cols.push({
      id: 'avg',
      label: 'Average',
      minWidth: 80,
      sortable: false,
      align: 'center',
      format: (v: any) => (
        <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#4f46e5' }}>
          {String(v ?? '-')}
        </Typography>
      ),
    });
    return cols;
  }, [selectedTurbineIds]);

  // Event log columns
  const eventLogColumns = useMemo(
    () => [
      { id: 'turbine', label: 'Turbine', minWidth: 70, sortable: false, align: 'center' as const },
      {
        id: 'statusCode',
        label: 'Status Code',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'statusDesc',
        label: 'Status Description',
        minWidth: 200,
        sortable: false,
        align: 'center' as const,
      },
      { id: 'opmode', label: 'OPMODE', minWidth: 80, sortable: false, align: 'center' as const },
      { id: 'type', label: 'Type', minWidth: 50, sortable: false, align: 'center' as const },
      { id: 'atype', label: 'AType', minWidth: 50, sortable: false, align: 'center' as const },
      {
        id: 'timestamp',
        label: 'TimeStamp',
        minWidth: 150,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'bladeAngle',
        label: 'BladeAngle',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'gbxSpeed',
        label: 'GbxSpeed',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'genSpeed',
        label: 'GenSpeed',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'hydPressure',
        label: 'HydPressure',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'rotSpeed',
        label: 'RotSpeed',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'activePower',
        label: 'ActivePower',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'windSpeed',
        label: 'Wind Speed',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
    ],
    [],
  );

  // Downtime analysis columns
  const downtimeAnalysisColumns = useMemo(
    () => [
      { id: 'turbine', label: 'Turbine', minWidth: 80, sortable: false, align: 'center' as const },
      {
        id: 'totalHours',
        label: 'Total Hours',
        minWidth: 100,
        sortable: false,
        align: 'center' as const,
      },
      { id: 'count', label: 'Count', minWidth: 70, sortable: false, align: 'center' as const },
      {
        id: 'downTime',
        label: 'Down Time (HH:MM)',
        minWidth: 120,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'mtbf',
        label: 'MTBF (HH:MM)',
        minWidth: 100,
        sortable: false,
        align: 'center' as const,
      },
      {
        id: 'mttr',
        label: 'MTTR (HH:MM)',
        minWidth: 100,
        sortable: false,
        align: 'center' as const,
      },
    ],
    [],
  );

  // Scheduled downtime columns
  const scheduledColumns = useMemo(
    () => [
      { id: 'id', label: '#', minWidth: 50, sortable: false, align: 'center' as const },
      {
        id: 'turbineNo',
        label: 'Turbine',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      { id: 'from', label: 'From', minWidth: 150, sortable: false, align: 'center' as const },
      { id: 'to', label: 'To', minWidth: 150, sortable: false, align: 'center' as const },
      {
        id: 'status',
        label: 'Status',
        minWidth: 150,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Chip
            label={String(v)}
            size='small'
            sx={{
              background: 'rgba(16,185,129,0.1)',
              color: '#059669',
              border: '1px solid rgba(16,185,129,0.35)',
              fontWeight: 600,
              fontSize: '11px',
              height: 22,
            }}
          />
        ),
      },
      {
        id: 'duration',
        label: 'Duration',
        minWidth: 100,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#059669' }}>
            {String(v)}
          </Typography>
        ),
      },
    ],
    [],
  );

  // Unscheduled downtime columns
  const unscheduledColumns = useMemo(
    () => [
      { id: 'id', label: '#', minWidth: 50, sortable: false, align: 'center' as const },
      {
        id: 'turbineNo',
        label: 'Turbine',
        minWidth: 80,
        sortable: false,
        align: 'center' as const,
      },
      { id: 'from', label: 'From', minWidth: 150, sortable: false, align: 'center' as const },
      { id: 'to', label: 'To', minWidth: 150, sortable: false, align: 'center' as const },
      {
        id: 'status',
        label: 'Status',
        minWidth: 220,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontSize: '12px', color: '#dc2626', textAlign: 'center' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'duration',
        label: 'Duration',
        minWidth: 100,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#dc2626' }}>
            {String(v)}
          </Typography>
        ),
      },
    ],
    [],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {keyframes}

      <Grid className={classes.container}>
        <PageHeader
          title='Generation Reports'
          description='View and manage energy generation reports and analytics across all systems.'
          icon={AssessmentIcon}
          variant='admin'
        />

        {/* ── Action Buttons & Filters Section ── */}
        <Box className={classes.actionButtonsSection}>
          {/* Report Type Filter */}
          <Autocomplete
            className={classes.filterAutocomplete}
            options={REPORT_TYPES}
            value={reportType}
            onChange={(_, v) => handleReportTypeChange(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Report Type'
                size='small'
                placeholder='Select type...'
              />
            )}
            renderOption={(props, option) => {
              // Determine if this report type has data available
              let hasData = false;
              if (selectedTurbines.length > 0) {
                if (
                  option === 'Daily Generation Report' ||
                  option === 'Event Log' ||
                  option === 'Downtime Analysis (MTBF & MTTR)' ||
                  option === 'Machine Availability'
                ) {
                  hasData = true;
                } else if (option === 'Weekly Generation Report') {
                  hasData = !!weeklyData;
                } else if (option === 'Monthly Generation Report') {
                  hasData = !!monthlyData;
                } else if (option === 'Temperature Alerts') {
                  hasData = selectedParameters.length > 0;
                }
              }
              return (
                <li
                  {...props}
                  key={option}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}
                >
                  <Typography sx={{ fontSize: '0.82rem' }}>{option}</Typography>
                </li>
              );
            }}
          />

          {/* Turbine Filter with Checkboxes */}
          <Autocomplete
            multiple
            disableCloseOnSelect
            size='small'
            className={classes.filterAutocomplete}
            options={[SELECT_ALL, ...ALL_TURBINES]}
            value={selectedTurbines}
            onChange={(_, v) => {
              if (v.includes(SELECT_ALL)) {
                setSelectedTurbines(
                  selectedTurbines.length === ALL_TURBINES.length ? [] : [...ALL_TURBINES],
                );
              } else {
                setSelectedTurbines(v as string[]);
              }
            }}
            getOptionLabel={(o) => (o === SELECT_ALL ? 'Select All' : o)}
            isOptionEqualToValue={(opt, val) => opt === val}
            renderOption={(props, option, { selected }) => {
              if (option === SELECT_ALL) {
                const allSelected = selectedTurbines.length === ALL_TURBINES.length;
                const indeterminate = selectedTurbines.length > 0 && !allSelected;
                return (
                  <li
                    {...props}
                    key={SELECT_ALL}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />}
                      checkedIcon={<CheckBoxIcon sx={{ fontSize: 16 }} />}
                      indeterminateIcon={<IndeterminateCheckBoxIcon sx={{ fontSize: 16 }} />}
                      checked={allSelected}
                      indeterminate={indeterminate}
                      size='small'
                      sx={{
                        p: 0.5,
                        color: '#c7d2fe',
                        '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#4f46e5' },
                      }}
                    />
                    <Typography sx={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.82rem' }}>
                      Select All
                    </Typography>
                  </li>
                );
              }
              const colorIdx = ALL_TURBINES.indexOf(option);
              const colors = [
                '#6366f1',
                '#06b6d4',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#f97316',
                '#0d9488',
                '#3b82f6',
                '#ec4899',
              ];
              return (
                <li
                  {...props}
                  key={option}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}
                >
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />}
                    checkedIcon={<CheckBoxIcon sx={{ fontSize: 16 }} />}
                    checked={selected}
                    size='small'
                    sx={{
                      p: 0.5,
                      color: '#c7d2fe',
                      '&.Mui-checked': { color: '#4f46e5' },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: colors[colorIdx] || '#6366f1',
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.82rem' }}>{option}</Typography>
                </li>
              );
            }}
            renderTags={(value) => (
              <Chip
                label={
                  value.length === ALL_TURBINES.length
                    ? `All (${value.length})`
                    : `${value.length} selected`
                }
                size='small'
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: 'rgba(79,70,229,0.1)',
                  border: '1px solid rgba(79,70,229,0.25)',
                  color: '#4f46e5',
                }}
              />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Turbine'
                size='small'
                placeholder={selectedTurbines.length === 0 ? 'Select turbines...' : ''}
              />
            )}
            sx={{
              '& .MuiAutocomplete-inputRoot': {
                background: '#fff',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4f46e5 !important',
                borderWidth: '2px',
              },
            }}
          />

          {/* From Date Filter */}
          <DatePicker
            label='From Date'
            value={fromDate}
            onChange={(v) => handleFromDateChange(v)}
            maxDate={toDate || undefined}
            slotProps={{
              textField: {
                size: 'small',
                className: classes.datePickerInput,
              },
            }}
          />

          {/* To Date Filter */}
          <DatePicker
            label='To Date'
            value={toDate}
            onChange={(v) => setToDate(v)}
            minDate={fromDate || undefined}
            maxDate={dayjs()}
            slotProps={{
              textField: {
                size: 'small',
                className: classes.datePickerInput,
              },
            }}
          />

          {/* Temperature Parameter Filter - Only show for Temperature Alerts (multi-select like turbines) */}
          {isTemperatureAlerts && (
            <Autocomplete
              multiple
              disableCloseOnSelect
              size='small'
              className={classes.filterAutocomplete}
              options={[SELECT_ALL, ...PARAMETER_OPTIONS]}
              value={selectedParameters}
              onChange={(_, v) => {
                if (v.includes(SELECT_ALL)) {
                  setSelectedParameters(
                    selectedParameters.length === PARAMETER_OPTIONS.length
                      ? []
                      : [...PARAMETER_OPTIONS],
                  );
                } else {
                  setSelectedParameters(v as string[]);
                }
              }}
              getOptionLabel={(o) => (o === SELECT_ALL ? 'Select All' : o)}
              isOptionEqualToValue={(opt, val) => opt === val}
              renderOption={(props, option, { selected }) => {
                if (option === SELECT_ALL) {
                  const allSelected = selectedParameters.length === PARAMETER_OPTIONS.length;
                  const indeterminate = selectedParameters.length > 0 && !allSelected;
                  return (
                    <li
                      {...props}
                      key={SELECT_ALL}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}
                    >
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />}
                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 16 }} />}
                        indeterminateIcon={<IndeterminateCheckBoxIcon sx={{ fontSize: 16 }} />}
                        checked={allSelected}
                        indeterminate={indeterminate}
                        size='small'
                        sx={{
                          p: 0.5,
                          color: '#c7d2fe',
                          '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#4f46e5' },
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, color: '#4f46e5', fontSize: '0.82rem' }}>
                        Select All
                      </Typography>
                    </li>
                  );
                }
                return (
                  <li
                    {...props}
                    key={option}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px' }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 16 }} />}
                      checkedIcon={<CheckBoxIcon sx={{ fontSize: 16 }} />}
                      checked={selected}
                      size='small'
                      sx={{
                        p: 0.5,
                        color: '#c7d2fe',
                        '&.Mui-checked': { color: '#4f46e5' },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.75rem' }}>{option}</Typography>
                  </li>
                );
              }}
              renderTags={(value) => (
                <Chip
                  label={
                    value.length === PARAMETER_OPTIONS.length
                      ? `All (${value.length})`
                      : `${value.length} selected`
                  }
                  size='small'
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: 'rgba(79,70,229,0.1)',
                    border: '1px solid rgba(79,70,229,0.25)',
                    color: '#4f46e5',
                  }}
                />
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Parameter'
                  size='small'
                  placeholder={selectedParameters.length === 0 ? 'Select parameters...' : ''}
                />
              )}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  background: '#fff',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4f46e5 !important',
                  borderWidth: '2px',
                },
              }}
            />
          )}

          {/* Document Type Filter */}
          <Autocomplete
            className={classes.filterAutocompleteSmall}
            options={DOC_TYPES.map((d) => d.label)}
            value={docType}
            onChange={(_, v) => setDocType(v)}
            renderInput={(params) => (
              <TextField {...params} label='Document Type' size='small' placeholder='Select...' />
            )}
            renderOption={(props, option) => {
              const icon =
                option === 'PDF' ? (
                  <PictureAsPdfIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                ) : option === 'Excel (XLSX)' ? (
                  <TableChartIcon sx={{ fontSize: 18, color: '#10b981' }} />
                ) : option === 'SVG' ? (
                  <ImageIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                ) : (
                  <WhatsAppIcon sx={{ fontSize: 18, color: '#25D366' }} />
                );
              return (
                <li {...props} key={option} className={classes.docOption}>
                  {icon}
                  <Typography sx={{ ml: 1 }}>{option}</Typography>
                </li>
              );
            }}
          />

          {/* Action Button - changes based on docType */}
          {docType === 'WhatsApp' ? (
            <Button
              variant='contained'
              startIcon={<WhatsAppIcon />}
              className={`${classes.actionButtonBase} ${classes.actionButtonAdd}`}
              disabled={!whatsappScheduleEnabled}
              onClick={handleOpenWhatsAppDialog}
              sx={{
                backgroundColor: '#25D366',
                '&:hover': {
                  backgroundColor: '#128C7E',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.4)',
                },
              }}
            >
              Send via WhatsApp
            </Button>
          ) : (
            <Button
              variant='contained'
              startIcon={<DownloadIcon />}
              className={`${classes.actionButtonBase} ${classes.actionButtonAdd}`}
              disabled={!downloadEnabled || downloading}
              onClick={handleDownload}
            >
              {downloading ? 'Generating...' : 'Download Report'}
            </Button>
          )}
        </Box>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DAILY GENERATION REPORT */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isDailyReport && (
          <>
            <Box className={classes.tableSection}>
              <Box className={classes.tableSectionHeader}>
                <Box className={classes.tableSectionTitleGroup}>
                  <Typography className={classes.tableSectionTitle}>
                    Daily Generation Report
                  </Typography>
                  <Typography className={classes.tableSectionDate}>
                    {formatDateTime(now)}
                  </Typography>
                </Box>
                {selectedTurbines.length > 0 && (
                  <TextField
                    placeholder='Search KPI...'
                    value={kpiSearch}
                    onChange={(e) => setKpiSearch(e.target.value)}
                    className={classes.searchField}
                    size='small'
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Box>
              {selectedTurbines.length === 0 ? (
                <Box
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    background: 'rgba(79,70,229,0.05)',
                    borderRadius: 2,
                    border: '1px dashed rgba(79,70,229,0.3)',
                  }}
                >
                  <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                    Please select at least one turbine to view Daily Generation Report data
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                    Use the Turbine filter above to select turbines
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box className={classes.tableWrapper}>
                    {/* @ts-ignore */}
                    <DataTable
                      columns={dynamicKpiColumns}
                      data={filteredKpi}
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      elevation={0}
                    />
                  </Box>

                  <Box sx={{ mt: 4 }} className={classes.tableSection}>
                    <Box className={classes.tableSectionHeader}>
                      <Box className={classes.tableSectionTitleGroup}>
                        <Typography className={classes.tableSectionTitle}>
                          Detailed Downtime Log
                        </Typography>
                        <Typography className={classes.tableSectionDate}>
                          {formatDateTime(now)}
                        </Typography>
                      </Box>
                      <TextField
                        placeholder='Search turbine / status...'
                        value={dtSearch}
                        onChange={(e) => setDtSearch(e.target.value)}
                        className={classes.searchField}
                        size='small'
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position='end'>
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    </Box>
                    <Box className={classes.tableWrapper}>
                      {/* @ts-ignore */}
                      <DataTable
                        columns={downtimeColumns}
                        data={filteredDt}
                        rowKey='id'
                        searchable={false}
                        initialRowsPerPage={10}
                        elevation={0}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* WEEKLY GENERATION REPORT */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isWeeklyReport && (
          <Box>
            <Box className={classes.tableSection}>
              <Box className={classes.tableSectionHeader}>
                <Box className={classes.tableSectionTitleGroup}>
                  <Typography className={classes.tableSectionTitle}>
                    Weekly Generation Report
                  </Typography>
                  <Typography className={classes.tableSectionDate}>
                    {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                  </Typography>
                </Box>
                {selectedTurbines.length > 0 && (
                  <TextField
                    placeholder='Search KPI...'
                    value={weeklySearch}
                    onChange={(e) => setWeeklySearch(e.target.value)}
                    className={classes.searchField}
                    size='small'
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Box>
              {selectedTurbines.length === 0 ? (
                <Box
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    background: 'rgba(79,70,229,0.05)',
                    borderRadius: 2,
                    border: '1px dashed rgba(79,70,229,0.3)',
                  }}
                >
                  <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                    Please select at least one turbine to view Weekly Generation Report data
                  </Typography>
                  <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                    Use the Turbine filter above to select turbines
                  </Typography>
                </Box>
              ) : weeklyData ? (
                <Box className={classes.tableWrapper}>
                  {/* @ts-ignore */}
                  <DataTable
                    columns={dynamicKpiColumns}
                    data={
                      weeklySearch
                        ? weeklyData.filter((r: WeeklyKpiRow) =>
                            r.kpi.toLowerCase().includes(weeklySearch.toLowerCase()),
                          )
                        : weeklyData
                    }
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    elevation={0}
                  />
                </Box>
              ) : null}
            </Box>

            {/* Detailed Downtime Log - Separate section with proper spacing */}
            {weeklyData && (
              <Box sx={{ mt: 3 }} className={classes.tableSection}>
                <Box className={classes.tableSectionHeader}>
                  <Box className={classes.tableSectionTitleGroup}>
                    <Typography className={classes.tableSectionTitle}>
                      Detailed Downtime Log
                    </Typography>
                    <Typography className={classes.tableSectionDate}>
                      {formatDateTime(now)}
                    </Typography>
                  </Box>
                  <TextField
                    placeholder='Search turbine / status...'
                    value={dtSearch}
                    onChange={(e) => setDtSearch(e.target.value)}
                    className={classes.searchField}
                    size='small'
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <Box className={classes.tableWrapper}>
                  {/* @ts-ignore */}
                  <DataTable
                    columns={downtimeColumns}
                    data={filteredDt}
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    elevation={0}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MONTHLY GENERATION REPORT */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isMonthlyReport && (
          <>
            {selectedTurbines.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'rgba(79,70,229,0.05)',
                  borderRadius: 2,
                  border: '1px dashed rgba(79,70,229,0.3)',
                }}
              >
                <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                  Please select at least one turbine to view Monthly Generation Report data
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                  Use the Turbine filter above to select turbines
                </Typography>
              </Box>
            ) : monthlyData ? (
              <>
                <Box className={classes.tableSection}>
                  <Box className={classes.tableSectionHeader}>
                    <Box className={classes.tableSectionTitleGroup}>
                      <Typography className={classes.tableSectionTitle}>
                        Monthly Generation Report
                      </Typography>
                      <Typography className={classes.tableSectionDate}>
                        {fromDate?.format('DD-MM-YYYY')} → {toDate?.format('DD-MM-YYYY')}
                      </Typography>
                    </Box>
                    <TextField
                      placeholder='Search KPI...'
                      value={monthlyKpiSearch}
                      onChange={(e) => setMonthlyKpiSearch(e.target.value)}
                      className={classes.searchField}
                      size='small'
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <Box className={classes.tableWrapper}>
                    <DataTable
                      columns={dynamicKpiColumns}
                      data={
                        monthlyKpiSearch
                          ? monthlyData.kpiRows.filter((r: any) =>
                              r.kpi.toLowerCase().includes(monthlyKpiSearch.toLowerCase()),
                            )
                          : monthlyData.kpiRows
                      }
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      elevation={0}
                    />
                  </Box>
                </Box>

                <Box className={classes.tableSection}>
                  <Box className={classes.tableSectionHeader}>
                    <Box className={classes.tableSectionTitleGroup}>
                      <Typography className={classes.tableSectionTitle}>
                        Scheduled Downtime Log
                      </Typography>
                    </Box>
                    <TextField
                      placeholder='Search...'
                      value={scheduledSearch}
                      onChange={(e) => setScheduledSearch(e.target.value)}
                      className={classes.searchField}
                      size='small'
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <Box className={classes.tableWrapper}>
                    <DataTable
                      columns={scheduledColumns}
                      data={
                        scheduledSearch
                          ? monthlyData.scheduledRows.filter((r: any) =>
                              Object.values(r).some((v: any) =>
                                String(v).toLowerCase().includes(scheduledSearch.toLowerCase()),
                              ),
                            )
                          : monthlyData.scheduledRows
                      }
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      elevation={0}
                    />
                  </Box>
                  {monthlyData.totalScheduledDuration &&
                    monthlyData.totalScheduledDuration !== '00:00' && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, py: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#059669' }}>
                          Total Duration: {monthlyData.totalScheduledDuration}
                        </Typography>
                      </Box>
                    )}
                </Box>

                <Box className={classes.tableSection}>
                  <Box className={classes.tableSectionHeader}>
                    <Box className={classes.tableSectionTitleGroup}>
                      <Typography className={classes.tableSectionTitle}>
                        Unscheduled Downtime Log
                      </Typography>
                    </Box>
                    <TextField
                      placeholder='Search...'
                      value={unscheduledSearch}
                      onChange={(e) => setUnscheduledSearch(e.target.value)}
                      className={classes.searchField}
                      size='small'
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <Box className={classes.tableWrapper}>
                    <DataTable
                      columns={unscheduledColumns}
                      data={
                        unscheduledSearch
                          ? monthlyData.unscheduledRows.filter((r: any) =>
                              Object.values(r).some((v: any) =>
                                String(v).toLowerCase().includes(unscheduledSearch.toLowerCase()),
                              ),
                            )
                          : monthlyData.unscheduledRows
                      }
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      elevation={0}
                    />
                  </Box>
                  {monthlyData.totalUnscheduledDuration &&
                    monthlyData.totalUnscheduledDuration !== '00:00' && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, py: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#dc2626' }}>
                          Total Duration: {monthlyData.totalUnscheduledDuration}
                        </Typography>
                      </Box>
                    )}
                </Box>
              </>
            ) : null}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TEMPERATURE ALERTS */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isTemperatureAlerts && (
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>
                  Temperature Alerts
                  {selectedParameters.length > 0
                    ? ` (${selectedParameters.length} parameters)`
                    : ''}
                </Typography>
                <Typography className={classes.tableSectionDate}>
                  {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                </Typography>
              </Box>
              {selectedTurbines.length > 0 && (
                <TextField
                  placeholder='Search parameter...'
                  value={tempAlertSearch}
                  onChange={(e) => setTempAlertSearch(e.target.value)}
                  className={classes.searchField}
                  size='small'
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            </Box>
            {selectedTurbines.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'rgba(79,70,229,0.05)',
                  borderRadius: 2,
                  border: '1px dashed rgba(79,70,229,0.3)',
                }}
              >
                <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                  Please select at least one turbine to view Temperature Alerts data
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                  Use the Turbine filter above to select turbines
                </Typography>
              </Box>
            ) : selectedParameters.length === 0 ? (
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'rgba(79,70,229,0.05)',
                  borderRadius: 2,
                  border: '1px dashed rgba(79,70,229,0.3)',
                }}
              >
                <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                  Please select at least one parameter to view Temperature Alerts data
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                  Use the Parameter filter above to select parameters
                </Typography>
              </Box>
            ) : (
              <Box
                className={classes.tableWrapper}
                sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '700px' }}
              >
                {/* @ts-ignore */}
                <DataTable
                  columns={temperatureColumns}
                  data={temperatureData ?? []}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={100}
                  elevation={0}
                />
              </Box>
            )}
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* EVENT LOG */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isEventLog && eventLogData && (
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>
                  Event Log {selectedTurbines.length === 1 ? `— ${selectedTurbines[0]}` : ''}
                </Typography>
                <Typography className={classes.tableSectionDate}>
                  {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                </Typography>
              </Box>
              <TextField
                placeholder='Search event...'
                value={eventLogSearch}
                onChange={(e) => setEventLogSearch(e.target.value)}
                className={classes.searchField}
                size='small'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box className={classes.tableWrapper}>
              <DataTable
                columns={eventLogColumns}
                data={
                  eventLogSearch
                    ? eventLogData.filter((r: any) =>
                        Object.values(r).some((v: any) =>
                          String(v).toLowerCase().includes(eventLogSearch.toLowerCase()),
                        ),
                      )
                    : eventLogData
                }
                rowKey='id'
                searchable={false}
                initialRowsPerPage={20}
                elevation={0}
              />
            </Box>
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DOWNTIME ANALYSIS MTBF/MTTR */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isDowntimeAnalysis && downtimeAnalysisData && (
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>
                  Downtime Analysis (MTBF & MTTR)
                </Typography>
                <Typography className={classes.tableSectionDate}>
                  {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                </Typography>
              </Box>
              <TextField
                placeholder='Search turbine...'
                value={downtimeAnalysisSearch}
                onChange={(e) => setDowntimeAnalysisSearch(e.target.value)}
                className={classes.searchField}
                size='small'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box className={classes.tableWrapper}>
              <DataTable
                columns={downtimeAnalysisColumns}
                data={
                  downtimeAnalysisSearch
                    ? downtimeAnalysisData.filter((r: any) =>
                        Object.values(r).some((v: any) =>
                          String(v).toLowerCase().includes(downtimeAnalysisSearch.toLowerCase()),
                        ),
                      )
                    : downtimeAnalysisData
                }
                rowKey='id'
                searchable={false}
                initialRowsPerPage={10}
                elevation={0}
              />
            </Box>
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* MACHINE AVAILABILITY */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isMachineAvailability && machineAvailabilityData && (
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>
                  Machine Availability (%)
                </Typography>
                <Typography className={classes.tableSectionDate}>
                  {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                </Typography>
              </Box>
              <TextField
                placeholder='Search date...'
                value={machineAvailSearch}
                onChange={(e) => setMachineAvailSearch(e.target.value)}
                className={classes.searchField}
                size='small'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Box className={classes.tableWrapper}>
              <DataTable
                columns={machineAvailabilityColumns}
                data={
                  machineAvailSearch
                    ? machineAvailabilityData.filter((r: any) =>
                        Object.values(r).some((v: any) =>
                          String(v).toLowerCase().includes(machineAvailSearch.toLowerCase()),
                        ),
                      )
                    : machineAvailabilityData
                }
                rowKey='id'
                searchable={false}
                initialRowsPerPage={10}
                elevation={0}
              />
            </Box>
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* OTHER REPORT TYPES */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {!isDailyReport &&
          !isWeeklyReport &&
          !isMonthlyReport &&
          !isTemperatureAlerts &&
          !isEventLog &&
          !isDowntimeAnalysis &&
          !isMachineAvailability && (
            <Box className={classes.tableSection}>
              <Box className={classes.tableSectionHeader}>
                <Box className={classes.tableSectionTitleGroup}>
                  <Typography className={classes.tableSectionTitle}>{reportType}</Typography>
                  <Typography className={classes.tableSectionDate}>
                    Select date range and turbines to view data
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  background: 'rgba(79,70,229,0.05)',
                  borderRadius: 2,
                  border: '1px dashed rgba(79,70,229,0.3)',
                }}
              >
                <Typography sx={{ color: '#4f46e5', fontSize: '16px' }}>
                  Select date range and turbines to view {reportType} data
                </Typography>
              </Box>
            </Box>
          )}
      </Grid>

      {/* WhatsApp Send Dialog */}
      <Dialog
        open={whatsAppDialogOpen}
        onClose={() => setWhatsAppDialogOpen(false)}
        maxWidth='sm'
        fullWidth
        className={classes.dialog}
      >
        {/* Modal Header */}
        <Box className={classes.modalHeroWhatsapp}>
          <Box className={classes.modalIconBoxWhatsapp}>
            <WhatsAppIcon sx={{ fontSize: 26, color: '#fff' }} />
          </Box>
          <Box className={classes.modalTitleBox}>
            <Typography className={classes.modalTitle}>
              {scheduleViaWhatsApp ? 'Schedule Report via WhatsApp' : 'Send Report via WhatsApp'}
            </Typography>
            <Typography className={classes.modalSubtitle}>
              {scheduleViaWhatsApp
                ? 'Set a scheduled time to send the report automatically'
                : 'Enter recipient details to send the report immediately'}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setWhatsAppDialogOpen(false)}
            className={classes.modalCloseBtn}
            size='small'
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2.5}>
            {/* Phone Number */}
            <Grid size={12}>
              <TextField
                fullWidth
                label='Phone Number *'
                value={whatsAppRecipient}
                onChange={(e) => setWhatsAppRecipient(e.target.value)}
                placeholder='919876543210'
                className={classes.formField}
                size='small'
                helperText='Enter with country code (e.g., 919876543210 for India)'
              />
            </Grid>

            {/* Schedule Switch */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={scheduleViaWhatsApp}
                    onChange={(e) => {
                      setScheduleViaWhatsApp(e.target.checked);
                      if (!e.target.checked) {
                        setWhatsAppScheduleDate(null);
                        setWhatsAppScheduleTime(null);
                        setWhatsAppRepeatFrequency('once');
                      }
                    }}
                  />
                }
                label='Schedule this message'
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 600,
                    color: '#059669',
                  },
                }}
              />
            </Grid>

            {/* Schedule Details - Show when switch is enabled */}
            {scheduleViaWhatsApp && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DatePicker
                    label='Schedule Date'
                    value={whatsAppScheduleDate}
                    onChange={(v) => setWhatsAppScheduleDate(v)}
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        className: classes.formField,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Schedule Time'
                    type='time'
                    value={whatsAppScheduleTime ? whatsAppScheduleTime.format('HH:mm') : ''}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const time = dayjs().hour(Number(hours)).minute(Number(minutes)).second(0);
                      setWhatsAppScheduleTime(time);
                    }}
                    className={classes.formField}
                    size='small'
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />
                </Grid>

                {/* Repeat Frequency */}
                <Grid size={12}>
                  <Autocomplete
                    options={['once', 'daily', 'weekly', 'monthly']}
                    value={whatsAppRepeatFrequency}
                    onChange={(_, v) => v && setWhatsAppRepeatFrequency(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Repeat Frequency'
                        size='small'
                        className={classes.formField}
                        helperText={
                          whatsAppRepeatFrequency === 'once'
                            ? 'Send once at the scheduled time'
                            : whatsAppRepeatFrequency === 'daily'
                              ? 'Repeat every day at the scheduled time'
                              : whatsAppRepeatFrequency === 'weekly'
                                ? 'Repeat every week on the same day'
                                : 'Repeat every month on the same date'
                        }
                      />
                    )}
                  />
                </Grid>

                {/* Show scheduled datetime preview */}
                {whatsAppScheduleDate && whatsAppScheduleTime && (
                  <Grid size={12}>
                    <Box className={classes.schedulePreviewBox}>
                      <Typography variant='body2' sx={{ color: '#059669', fontWeight: 600 }}>
                        Scheduled: {whatsAppScheduleDate.format('DD MMM YYYY')} at{' '}
                        {whatsAppScheduleTime.format('hh:mm A')}
                        {whatsAppRepeatFrequency !== 'once' && (
                          <Typography component='span' sx={{ ml: 1 }}>
                            ({whatsAppRepeatFrequency})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}

            {/* Report Details */}
            <Grid size={12}>
              <Box className={classes.reportDetailsBox}>
                <Typography variant='body2' sx={{ fontWeight: 600, mb: 1, color: '#4f46e5' }}>
                  Report Details:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant='body2'>
                    <strong>Report Type:</strong> {reportType}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Turbines:</strong>{' '}
                    {selectedTurbines.length > 0 ? selectedTurbines.join(', ') : 'All'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Date Range:</strong> {fromDate?.format('DD/MM/YYYY')} -{' '}
                    {toDate?.format('DD/MM/YYYY')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          <Button onClick={() => setWhatsAppDialogOpen(false)} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleSendToWhatsApp}
            disabled={
              whatsAppSending ||
              !whatsAppRecipient.trim() ||
              (scheduleViaWhatsApp && (!whatsAppScheduleDate || !whatsAppScheduleTime))
            }
            className={classes.submitButtonWhatsapp}
            startIcon={
              whatsAppSending ? (
                <CircularProgress size={16} color='inherit' />
              ) : scheduleViaWhatsApp ? (
                <ScheduleIcon fontSize='small' />
              ) : (
                <SendIcon fontSize='small' />
              )
            }
          >
            {whatsAppSending
              ? 'Processing...'
              : scheduleViaWhatsApp
                ? 'Schedule Report'
                : 'Send Now'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scheduled Reports Dialog */}
      <Dialog
        open={scheduledDialogOpen}
        onClose={() => setScheduledDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: '#4f46e5',
            color: '#fff',
          }}
        >
          <ScheduleIcon /> Schedule Reports
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label='Phone Number'
              value={scheduledForm.recipient}
              onChange={(e) => setScheduledForm({ ...scheduledForm, recipient: e.target.value })}
              placeholder='919876543210'
            />
            <Autocomplete
              options={['hourly', 'daily'] as const}
              value={scheduledForm.frequency}
              onChange={(_, v) => v && setScheduledForm({ ...scheduledForm, frequency: v })}
              renderInput={(params) => <TextField {...params} label='Frequency' />}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={scheduledForm.enabled}
                onChange={(e) => setScheduledForm({ ...scheduledForm, enabled: e.target.checked })}
              />
            }
            label='Enable immediately'
          />
          <Button
            variant='contained'
            onClick={handleCreateScheduledReport}
            disabled={scheduledLoading}
            sx={{ ml: 2 }}
          >
            {scheduledLoading ? 'Creating...' : 'Create Schedule'}
          </Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
            Active Schedules
          </Typography>
          {scheduledJobs.length === 0 ? (
            <Typography variant='body2' color='text.secondary'>
              No scheduled reports yet
            </Typography>
          ) : (
            <List dense>
              {scheduledJobs.map((job) => (
                <ListItem key={job.id} divider>
                  <ListItemIcon>
                    <WhatsAppIcon sx={{ color: '#25D366' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${job.frequency === 'hourly' ? 'Hourly' : 'Daily'} Report - ${job.recipient}`}
                    secondary={`Next: ${job.nextRun ? new Date(job.nextRun).toLocaleString() : 'N/A'}`}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={job.enabled}
                      onChange={(e) => handleToggleScheduledJob(job.id, e.target.checked)}
                    />
                    <IconButton
                      size='small'
                      onClick={() => handleTriggerScheduledJob(job.id)}
                      title='Send Now'
                    >
                      <SendIcon />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteScheduledJob(job.id)}
                      title='Delete'
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setScheduledDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={whatsAppSnackbar.open}
        autoHideDuration={4000}
        onClose={() => setWhatsAppSnackbar({ ...whatsAppSnackbar, open: false })}
      >
        <Alert
          severity={whatsAppSnackbar.severity}
          onClose={() => setWhatsAppSnackbar({ ...whatsAppSnackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {whatsAppSnackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default Reports;
