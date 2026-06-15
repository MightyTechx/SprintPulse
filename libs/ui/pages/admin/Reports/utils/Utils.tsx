import { useMemo } from 'react';
import { Column, Typography, Chip } from '@sprintpulse/component';
import {
  getIncidentRows,
  IncidentRow,
  INCIDENT_STATUS_CONFIG,
} from './reports.utils';

export const useUtils = () => {
  const incidentRows = useMemo(() => getIncidentRows(), []);

  const incidentColumns: Column<IncidentRow>[] = useMemo(
    () => [
      {
        id: 'id',
        label: 'S.No',
        minWidth: 60,
        sortable: false,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#4f46e5' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'team',
        label: 'Team',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'assignee',
        label: 'Assignee',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'assignedTo',
        label: 'Assigned To',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'incidentNumber',
        label: 'Incident Number',
        minWidth: 140,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography
            sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontWeight: 600,
              fontSize: '12.5px',
              color: '#4f46e5',
              letterSpacing: '0.02em',
            }}
          >
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'fromDate',
        label: 'From Date',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'toDate',
        label: 'To Date',
        minWidth: 150,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography sx={{ fontSize: '13px', color: '#334155' }}>{String(v)}</Typography>
        ),
      },
      {
        id: 'issue',
        label: 'Issue',
        minWidth: 220,
        sortable: false,
        align: 'left' as const,
        format: (v) => (
          <Typography sx={{ fontSize: '13px', color: '#1e293b', textAlign: 'left' }}>
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'totalHours',
        label: 'Total Hours',
        minWidth: 120,
        sortable: true,
        align: 'center' as const,
        format: (v) => (
          <Typography
            sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontWeight: 600,
              fontSize: '12.5px',
              color: '#0f172a',
            }}
          >
            {String(v)}
          </Typography>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 130,
        sortable: true,
        align: 'center' as const,
        format: (v) => {
          const status = v as IncidentRow['status'];
          const s = INCIDENT_STATUS_CONFIG[status] ?? {
            bg: 'rgba(100,116,139,0.1)',
            color: '#475569',
            border: 'rgba(100,116,139,0.3)',
          };
          return (
            <Chip
              label={status}
              size='small'
              sx={{
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                fontWeight: 600,
                fontSize: '12px',
                height: 22,
              }}
            />
          );
        },
      },
    ],
    [],
  );

  const formatDateTime = useMemo(
    () =>
      (date: Date): string => {
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      },
    [],
  );

  return {
    incidentRows,
    incidentColumns,
    formatDateTime,
  };
};
