import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  PageHeader,
  DataTable,
} from '@sprintpulse/component';
import { InputAdornment, Autocomplete, Checkbox } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import type { Dayjs } from 'dayjs';
// eslint-disable-next-line no-duplicate-imports
import dayjs from 'dayjs';

import { useStyles } from './styles';
import {
  REPORT_TYPES,
  DOC_TYPES,
  AGILE_TEAM_NAMES,
  getAgileReportRows,
  AgileReportRow,
  AgileReportType,
  IncidentStatus,
  INCIDENT_STATUS_CONFIG,
  IncidentRow,
  getIncidentRows,
} from './utils/reports.utils';
import { useAdminKeyframes } from '@sprintpulse/hooks';

const SELECT_ALL = '__select_all__';
const TEAM_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type ReportType = (typeof REPORT_TYPES)[number];

const Reports = () => {
  const { classes } = useStyles();
  useAdminKeyframes();

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const [reportType, setReportType] = useState<ReportType>('Daily Status Report');
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs().startOf('day'));
  const [docType, setDocType] = useState<string | null>('PDF');
  const [downloading, setDownloading] = useState(false);

  const [agileSearch, setAgileSearch] = useState('');
  const [dtSearch, setDtSearch] = useState('');

  const [selectedTeams, setSelectedTeams] = useState<string[]>(AGILE_TEAM_NAMES);

  const teamsForReport = useMemo<string[]>(() => {
    if (selectedTeams.length === 0 || selectedTeams.length === AGILE_TEAM_NAMES.length) {
      return AGILE_TEAM_NAMES;
    }
    return selectedTeams;
  }, [selectedTeams]);

  const handleReportTypeChange = (newType: ReportType | null) => {
    if (!newType) return;
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

  const handleFromDateChange = (newFromDate: Dayjs | null) => {
    setFromDate(newFromDate);
    if (newFromDate) {
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

  // Agile / Scrum report rows
  const agileRows: AgileReportRow[] = useMemo(() => {
    return getAgileReportRows(reportType as AgileReportType, fromDate, toDate, teamsForReport);
  }, [reportType, fromDate, toDate, teamsForReport]);

  const filteredAgile = agileSearch
    ? agileRows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(agileSearch.toLowerCase())),
      )
    : agileRows;

  // Incident log rows
  const incidentRows: IncidentRow[] = useMemo(() => getIncidentRows(), []);
  const filteredDt = dtSearch
    ? incidentRows.filter((r) =>
        Object.values(r).some((v) => String(v).toLowerCase().includes(dtSearch.toLowerCase())),
      )
    : incidentRows;

  const agileColumns: any[] = useMemo(
    () => [
      { id: 'id', label: 'S.No', minWidth: 60, sortable: true, align: 'center' as const },
      { id: 'team', label: 'Team', minWidth: 150, sortable: true, align: 'center' as const },
      { id: 'sprint', label: 'Sprint', minWidth: 200, sortable: true, align: 'center' as const },
      {
        id: 'totalStoryPoints',
        label: 'Story Points',
        minWidth: 130,
        sortable: true,
        align: 'right' as const,
      },
      {
        id: 'totalCompletedStories',
        label: 'Completed Stories',
        minWidth: 150,
        sortable: true,
        align: 'right' as const,
      },
      {
        id: 'totalCarryForward',
        label: 'Carry Forward',
        minWidth: 140,
        sortable: true,
        align: 'right' as const,
      },
    ],
    [],
  );

  const incidentColumns: any[] = useMemo(
    () => [
      { id: 'id', label: 'S.No', minWidth: 60, sortable: true, align: 'center' as const },
      { id: 'team', label: 'Team', minWidth: 130, sortable: true, align: 'center' as const },
      {
        id: 'incidentNumber',
        label: 'Incident #',
        minWidth: 130,
        sortable: true,
        align: 'center' as const,
      },
      { id: 'issue', label: 'Issue', minWidth: 240, sortable: true, align: 'left' as const },
      {
        id: 'assignee',
        label: 'Assignee',
        minWidth: 130,
        sortable: true,
        align: 'center' as const,
      },
      {
        id: 'assignedTo',
        label: 'Assigned To',
        minWidth: 130,
        sortable: true,
        align: 'center' as const,
      },
      {
        id: 'fromDate',
        label: 'From',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
      },
      { id: 'toDate', label: 'To', minWidth: 150, sortable: true, align: 'center' as const },
      {
        id: 'totalHours',
        label: 'Hours',
        minWidth: 80,
        sortable: true,
        align: 'right' as const,
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 130,
        sortable: true,
        align: 'center' as const,
        format: (v: string) => {
          const cfg = INCIDENT_STATUS_CONFIG[v as IncidentStatus];
          return (
            <Chip
              size='small'
              label={v}
              sx={{
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
                fontWeight: 600,
                fontSize: '11px',
              }}
            />
          );
        },
      },
    ],
    [],
  );

  const downloadEnabled = !!reportType && !!fromDate && !!toDate;

  const handleDownload = async () => {
    if (!downloadEnabled || downloading) return;
    setDownloading(true);
    try {
      alert(
        `Generating ${docType ?? 'PDF'} for ${reportType}. Export pipeline will be wired in a future polish pass.`,
      );
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (date: Dayjs | null): string => {
    if (!date) return '';
    return date.format('DD/MM/YYYY');
  };

  const formatDateTime = (d: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        <PageHeader
          title='Status Reports'
          description='View and manage daily, weekly, and monthly status reports across all teams, and incident reports.'
          icon={AssessmentIcon}
          variant='admin'
        />

        {/* ── Filter row ── */}
        <Grid size={12}>
          <Box className={classes.filterBar}>
            {/* Report Type */}
            <Autocomplete
              className={classes.filterAutocomplete}
              options={REPORT_TYPES}
              value={reportType}
              onChange={(_, v) => handleReportTypeChange(v)}
              renderInput={(params) => <TextField {...params} label='Report Type' size='small' />}
            />

            {/* Teams (multi-select with "Select All" sentinel) */}
            <Autocomplete
              multiple
              disableCloseOnSelect
              size='small'
              className={classes.filterAutocomplete}
              options={[SELECT_ALL, ...AGILE_TEAM_NAMES]}
              value={selectedTeams}
              onChange={(_, v) => {
                if (v.includes(SELECT_ALL)) {
                  setSelectedTeams(
                    selectedTeams.length === AGILE_TEAM_NAMES.length ? [] : [...AGILE_TEAM_NAMES],
                  );
                } else {
                  setSelectedTeams(v as string[]);
                }
              }}
              getOptionLabel={(o) => (o === SELECT_ALL ? 'Select All' : o)}
              isOptionEqualToValue={(opt, val) => opt === val}
              renderOption={(props, option, { selected }) => {
                if (option === SELECT_ALL) {
                  const allSelected = selectedTeams.length === AGILE_TEAM_NAMES.length;
                  const indeterminate = selectedTeams.length > 0 && !allSelected;
                  return (
                    <li
                      {...props}
                      key={SELECT_ALL}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}
                    >
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 14 }} />}
                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 14 }} />}
                        indeterminateIcon={<IndeterminateCheckBoxIcon sx={{ fontSize: 14 }} />}
                        checked={allSelected}
                        indeterminate={indeterminate}
                        size='small'
                      />
                      <Typography sx={{ fontWeight: 600, color: '#4f46e5', fontSize: '0.78rem' }}>
                        Select All
                      </Typography>
                    </li>
                  );
                }
                const colorIdx = AGILE_TEAM_NAMES.indexOf(option);
                return (
                  <li
                    {...props}
                    key={option}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 14 }} />}
                      checkedIcon={<CheckBoxIcon sx={{ fontSize: 14 }} />}
                      checked={selected}
                      size='small'
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: TEAM_COLORS[colorIdx],
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: '0.78rem' }}>{option}</Typography>
                  </li>
                );
              }}
              renderTags={(value) => (
                <Chip
                  label={
                    value.length === AGILE_TEAM_NAMES.length
                      ? `All (${value.length})`
                      : `${value.length} selected`
                  }
                  size='small'
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    background: 'primary.light',
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              )}
              renderInput={(params) => (
                <TextField {...params} label='Teams' placeholder='Select…' size='small' />
              )}
              ListboxProps={{ sx: { maxHeight: 200 } }}
            />

            {/* From Date */}
            <DatePicker
              label='From Date'
              value={fromDate}
              onChange={(v) => handleFromDateChange(v)}
              maxDate={toDate || undefined}
              slotProps={{ textField: { size: 'small', className: classes.datePickerInput } }}
            />

            {/* To Date */}
            <DatePicker
              label='To Date'
              value={toDate}
              onChange={(v) => setToDate(v)}
              minDate={fromDate || undefined}
              maxDate={dayjs()}
              slotProps={{ textField: { size: 'small', className: classes.datePickerInput } }}
            />

            {/* Document Type */}
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

            <Button
              variant='contained'
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              disabled={!downloadEnabled || downloading}
              className={classes.downloadButton}
            >
              {downloading ? 'Generating...' : 'Download'}
            </Button>
          </Box>
        </Grid>

        {/* ── Agile Report ── */}
        <Grid size={12}>
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>{reportType}</Typography>
                <Typography className={classes.tableSectionDate}>
                  {formatDate(fromDate)} → {formatDate(toDate)}
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
        </Grid>

        {/* ── Incident Log ── */}
        <Grid size={12}>
          <Box className={classes.tableSection}>
            <Box className={classes.tableSectionHeader}>
              <Box className={classes.tableSectionTitleGroup}>
                <Typography className={classes.tableSectionTitle}>Incident Downtime Log</Typography>
                <Typography className={classes.tableSectionDate}>{formatDateTime(now)}</Typography>
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
                data={filteredDt}
                rowKey='id'
                searchable={false}
                initialRowsPerPage={10}
                elevation={0}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Reports;
