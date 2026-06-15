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
} from '@sprintpulse/component';
import { InputAdornment, Autocomplete, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';

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
  getScheduledDowntimeRows,
  getUnscheduledDowntimeRows,
  calculateTotalDuration,
  getAgileReportRows,
  AgileReportRow,
  AgileReportType,
} from './utils/reports.utils';
import { useUtils } from './utils/Utils';
import { useAdminKeyframes } from '@sprintpulse/hooks';
import { generatePdfReport } from '../../../utils/export/pdf/pdf.generator';
import { generateExcelReport } from '../../../utils/export/excel/excel.generator';

const SELECT_ALL = '__select_all__';
const ALL_SPRINTS = TURBINE_LIST;
const ALL_TURBINES = ALL_SPRINTS; // legacy alias

type ReportType = (typeof REPORT_TYPES)[number];

// Generate HTML report as a placeholder for PowerPoint export
function generateHtmlReport(metadata: any, agileData: any[], downtimeData: any[]): string {
  const reportName = metadata.reportName || 'Report';
  const sprintInfo = metadata.sprint || 'All Sprints';
  const dateRange = `${metadata.fromDate} - ${metadata.toDate}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${reportName} - SprintPulse</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      margin: 40px;
      background: #f8fafc;
      color: #1e293b;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
    }
    .header p {
      margin: 5px 0;
      opacity: 0.95;
    }
    .section {
      background: white;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .section h2 {
      color: #4f46e5;
      margin-top: 0;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th {
      background: #4f46e5;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .chip {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .chip-points {
      background: rgba(79, 70, 229, 0.1);
      color: #4f46e5;
      border: 1px solid rgba(79, 70, 229, 0.35);
    }
    .chip-completed {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .chip-carry {
      background: rgba(220, 38, 38, 0.1);
      color: #dc2626;
      border: 1px solid rgba(220, 38, 38, 0.35);
    }
    .note {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      border-radius: 6px;
      margin-top: 20px;
      font-size: 13px;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${reportName}</h1>
    <p><strong>Team/Sprint:</strong> ${sprintInfo}</p>
    <p><strong>Date Range:</strong> ${dateRange}</p>
    <p><strong>Generated:</strong> ${metadata.generatedAt}</p>
  </div>

  <div class="section">
    <h2>Agile / Scrum Report</h2>
    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Team</th>
          <th>Sprint</th>
          <th>Total Story Points</th>
          <th>Total Completed Stories</th>
          <th>Total Carry Forward</th>
        </tr>
      </thead>
      <tbody>
        ${agileData
          .map(
            (row) => `
          <tr>
            <td>${row.id}</td>
            <td><strong>${row.team}</strong></td>
            <td>${row.sprint}</td>
            <td><span class="chip chip-points">${row.totalStoryPoints}</span></td>
            <td><span class="chip chip-completed">${row.totalCompletedStories}</span></td>
            <td><span class="chip chip-carry">${row.totalCarryForward}</span></td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  </div>

  ${
    downtimeData && downtimeData.length > 0
      ? `
  <div class="section">
    <h2>Detailed Downtime Log</h2>
    <table>
      <thead>
        <tr>
          <th>Turbine No</th>
          <th>From</th>
          <th>To</th>
          <th>Duration</th>
          <th>Downtime Type</th>
          <th>Fault Status</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${downtimeData
          .map(
            (row) => `
          <tr>
            <td><strong>${row.turbineNo || row.sprintNo || '-'}</strong></td>
            <td>${row.from || '-'}</td>
            <td>${row.to || '-'}</td>
            <td>${row.duration || '-'}</td>
            <td>${row.downtimeType || '-'}</td>
            <td>${row.faultStatus || '-'}</td>
            <td>${row.remarks || '-'}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  <div class="note">
    <strong>Note:</strong> This is an HTML export. To convert to PowerPoint, you can:
    <ul>
      <li>Open this file in a browser and copy-paste into PowerPoint</li>
      <li>Use the "Save as" function in PowerPoint to import HTML</li>
      <li>Full PPTX generation coming soon</li>
    </ul>
  </div>
</body>
</html>
  `.trim();
}

const Reports = () => {
  const { classes } = useStyles();

  const keyframes = useAdminKeyframes();

  const { incidentRows, incidentColumns, formatDateTime } = useUtils();

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const [reportType, setReportType] = useState<ReportType | null>('Daily Status Report');
  const [selectedTurbines, setSelectedTurbines] = useState<string[]>(ALL_SPRINTS);
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [docType, setDocType] = useState<string | null>('PDF');
  const [downloading, setDownloading] = useState(false);

  const [agileSearch, setAgileSearch] = useState('');
  const [dtSearch, setDtSearch] = useState('');

  // Handle report type change - reset dates based on report type
  const handleReportTypeChange = (newType: ReportType | null) => {
    setReportType(newType);
    const today = dayjs().startOf('day');

    switch (newType) {
      case 'Weekly Status Report':
        setFromDate(today.subtract(7, 'day'));
        setToDate(today);
        break;
      case 'Monthly Status Report':
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
        case 'Weekly Status Report':
          setToDate(newFromDate.add(7, 'day').isAfter(today) ? today : newFromDate.add(7, 'day'));
          break;
        case 'Monthly Status Report':
          setToDate(
            newFromDate.add(1, 'month').isAfter(today) ? today : newFromDate.add(1, 'month'),
          );
          break;
      }
    }
  };

  // Get selected sprint IDs for dynamic columns
  const selectedTurbineIds = useMemo(() => {
    return selectedTurbines.map((t) => t.replace('SPR-', 's').toLowerCase());
  }, [selectedTurbines]);

  // Monthly report data
  const monthlyData = useMemo(() => {
    if (reportType !== 'Monthly Status Report' || !fromDate || !toDate) {
      return null;
    }
    const turbines = selectedTurbines;
    const scheduledRows = getScheduledDowntimeRows(fromDate, toDate, turbines);
    const unscheduledRows = getUnscheduledDowntimeRows(fromDate, toDate, turbines);

    return {
      scheduledRows,
      unscheduledRows,
      totalScheduledDuration: calculateTotalDuration(scheduledRows),
      totalUnscheduledDuration: calculateTotalDuration(unscheduledRows),
      incidentRows,
    };
  }, [reportType, fromDate, toDate, selectedTurbines, incidentRows]);

  // Filtered monthly incident rows (for Detailed Downtime Log)
  const filteredMonthlyDt = dtSearch
    ? (monthlyData?.incidentRows ?? []).filter((r: any) =>
        Object.values(r).some((v: any) => String(v).toLowerCase().includes(dtSearch.toLowerCase())),
      )
    : (monthlyData?.incidentRows ?? []);

  // Active agile report data — one source for Daily / Weekly / Monthly
  const activeReportType: AgileReportType | null = reportType as AgileReportType | null;
  const agileRows = useMemo(() => {
    if (!activeReportType) return [];
    return getAgileReportRows(activeReportType, fromDate, toDate);
  }, [activeReportType, fromDate, toDate]);

  const filteredAgile = agileSearch
    ? agileRows.filter((r: AgileReportRow) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(agileSearch.toLowerCase())),
      )
    : agileRows;

  const downloadEnabled = !!reportType && !!fromDate && !!toDate && selectedTurbines.length > 0;

  const filteredDt = dtSearch
    ? incidentRows.filter((r: any) =>
        Object.values(r).some((v: any) => String(v).toLowerCase().includes(dtSearch.toLowerCase())),
      )
    : incidentRows;

  const formatDate = (date: Dayjs | null): string => {
    if (!date) return '';
    return date.format('DD/MM/YYYY');
  };

  const handleDownload = async () => {
    if (!downloadEnabled || downloading) return;

    setDownloading(true);

    const metadata = {
      reportName: reportType || 'Report',
      sprint:
        selectedTurbines.length === ALL_SPRINTS.length
          ? 'All Sprints'
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
        // Generate PDF for the selected report
        if (isDailyReport) {
          await generatePdfReport(metadata, agileRows as any, incidentRows, turbineIds);
        } else if (isWeeklyReport) {
          await generatePdfReport(metadata, agileRows as any, filteredDt, turbineIds);
        } else if (isMonthlyReport && monthlyData) {
          await generatePdfReport(metadata, agileRows as any, filteredMonthlyDt, turbineIds);
        } else {
          // Fallback for other report types
          await generatePdfReport(metadata, agileRows as any, [], turbineIds);
        }
      } else if (docType === 'Excel (XLSX)') {
        // Generate Excel for the selected report
        if (isDailyReport) {
          generateExcelReport(metadata, agileRows as any, incidentRows, turbineIds);
        } else if (isWeeklyReport) {
          generateExcelReport(metadata, agileRows as any, filteredDt, turbineIds);
        } else if (isMonthlyReport && monthlyData) {
          generateExcelReport(metadata, agileRows as any, filteredMonthlyDt, turbineIds);
        } else {
          generateExcelReport(metadata, agileRows as any, [], turbineIds);
        }
      } else if (docType === 'PowerPoint (PPTX)') {
        // Generate PowerPoint placeholder (for now - uses simple HTML export)
        alert(
          'PowerPoint export is not yet implemented. For now, the data has been exported as an HTML file.',
        );

        // Generate HTML content as a placeholder for PPT
        const htmlContent = generateHtmlReport(metadata, agileRows as any, filteredDt);

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SprintPulse_${metadata.reportName}_${metadata.fromDate.replace(/\//g, '-')}_to_${metadata.toDate.replace(/\//g, '-')}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setDownloading(false);
    }
  };

  const isDailyReport = reportType === 'Daily Status Report';
  const isWeeklyReport = reportType === 'Weekly Status Report';
  const isMonthlyReport = reportType === 'Monthly Status Report';

  // Agile / Scrum report columns (shared across Daily / Weekly / Monthly)
  const agileColumns: any[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'S.No',
        minWidth: 60,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'team',
        label: 'Team',
        minWidth: 150,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#4f46e5' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'sprint',
        label: 'Sprint',
        minWidth: 260,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'totalStoryPoints',
        label: 'Total Story Points',
        minWidth: 150,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Chip
            label={String(v)}
            size='small'
            sx={{
              background: 'rgba(79,70,229,0.1)',
              color: '#4f46e5',
              border: '1px solid rgba(79,70,229,0.35)',
              fontWeight: 700,
              fontSize: '12px',
              height: 24,
            }}
          />
        ),
      },
      {
        id: 'totalCompletedStories',
        label: 'Total Completed Stories',
        minWidth: 180,
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
              fontWeight: 700,
              fontSize: '12px',
              height: 24,
            }}
          />
        ),
      },
      {
        id: 'totalCarryForward',
        label: 'Total Carry Forward',
        minWidth: 160,
        sortable: false,
        align: 'center' as const,
        format: (v: any) => (
          <Chip
            label={String(v)}
            size='small'
            sx={{
              background: 'rgba(220,38,38,0.1)',
              color: '#dc2626',
              border: '1px solid rgba(220,38,38,0.35)',
              fontWeight: 700,
              fontSize: '12px',
              height: 24,
            }}
          />
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
          title='Status Reports'
          description='View and manage daily, weekly, and monthly status reports across all teams.'
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
                label='Team'
                size='small'
                placeholder={selectedTurbines.length === 0 ? 'Select teams...' : ''}
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

          {/* Temperature Parameter Filter removed */}

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
                ) : (
                  <SlideshowIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                );
              return (
                <li {...props} key={option} className={classes.docOption}>
                  {icon}
                  <Typography sx={{ ml: 1 }}>{option}</Typography>
                </li>
              );
            }}
          />

          {/* Action Button */}
          <Button
            variant='contained'
            startIcon={<DownloadIcon />}
            className={`${classes.actionButtonBase} ${classes.actionButtonAdd}`}
            disabled={!downloadEnabled || downloading}
            onClick={handleDownload}
          >
            {downloading ? 'Generating...' : 'Download Report'}
          </Button>
        </Box>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* DAILY GENERATION REPORT */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {isDailyReport && (
          <>
            <Box className={classes.tableSection}>
              <Box className={classes.tableSectionHeader}>
                <Box className={classes.tableSectionTitleGroup}>
                  <Typography className={classes.tableSectionTitle}>Daily Status Report</Typography>
                  <Typography className={classes.tableSectionDate}>
                    {formatDateTime(now)}
                  </Typography>
                </Box>
                <TextField
                  placeholder='Search team / sprint...'
                  value={agileSearch}
                  onChange={(e) => setAgileSearch(e.target.value)}
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
                  columns={agileColumns}
                  data={filteredAgile}
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
                    placeholder='Search team / incident / status...'
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
                    columns={incidentColumns}
                    data={filteredDt}
                    rowKey='id'
                    searchable={false}
                    initialRowsPerPage={10}
                    elevation={0}
                  />
                </Box>
              </Box>
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
                    Weekly Status Report
                  </Typography>
                  <Typography className={classes.tableSectionDate}>
                    {fromDate?.format('YYYY-MM-DD')} to {toDate?.format('YYYY-MM-DD')}
                  </Typography>
                </Box>
                <TextField
                  placeholder='Search team / sprint...'
                  value={agileSearch}
                  onChange={(e) => setAgileSearch(e.target.value)}
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
                  columns={agileColumns}
                  data={filteredAgile}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={10}
                  elevation={0}
                />
              </Box>
            </Box>

            {/* Detailed Downtime Log - Separate section with proper spacing */}
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
                  placeholder='Search team / incident / status...'
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
                  columns={incidentColumns}
                  data={filteredDt}
                  rowKey='id'
                  searchable={false}
                  initialRowsPerPage={10}
                  elevation={0}
                />
              </Box>
            </Box>
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
                  Please select at least one team to view Monthly Status Report data
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '13px', mt: 1 }}>
                  Use the Team filter above to select teams
                </Typography>
              </Box>
            ) : monthlyData ? (
              <>
                <Box className={classes.tableSection}>
                  <Box className={classes.tableSectionHeader}>
                    <Box className={classes.tableSectionTitleGroup}>
                      <Typography className={classes.tableSectionTitle}>
                        Monthly Status Report
                      </Typography>
                      <Typography className={classes.tableSectionDate}>
                        {fromDate?.format('DD-MM-YYYY')} → {toDate?.format('DD-MM-YYYY')}
                      </Typography>
                    </Box>
                    <TextField
                      placeholder='Search team / sprint...'
                      value={agileSearch}
                      onChange={(e) => setAgileSearch(e.target.value)}
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
                      columns={agileColumns}
                      data={filteredAgile}
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
                        Detailed Downtime Log
                      </Typography>
                      <Typography className={classes.tableSectionDate}>
                        {fromDate?.format('DD-MM-YYYY')} → {toDate?.format('DD-MM-YYYY')}
                      </Typography>
                    </Box>
                    <TextField
                      placeholder='Search team / incident / status...'
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
                    <DataTable
                      columns={incidentColumns}
                      data={filteredMonthlyDt}
                      rowKey='id'
                      searchable={false}
                      initialRowsPerPage={10}
                      elevation={0}
                    />
                  </Box>
                </Box>
              </>
            ) : null}
          </>
        )}

        {/* Empty-state fallback for unknown report types */}
        {!isDailyReport && !isWeeklyReport && !isMonthlyReport && (
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>{reportType}</Typography>
                <Typography className={classes.tableSectionDate}>
                  Select date range and teams to view data
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
                Select date range and teams to view {reportType} data
              </Typography>
            </Box>
          </Box>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default Reports;
