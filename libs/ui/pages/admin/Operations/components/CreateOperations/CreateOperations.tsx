import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  UploadFile,
  PageHeader,
  Select,
} from '@infygen/component';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import CheckboxMui from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import {
  AssignmentInd,
  Build,
  ExpandMore,
  Security,
  Engineering,
  Person,
  Description,
  AttachFile,
} from '@mui/icons-material';
import { useStyles } from './styles';

// ── Icons ───────────────────────────────────────────────────────────────────
import ConstructionIcon from '@mui/icons-material/Construction';
import BadgeIcon from '@mui/icons-material/Badge';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HeightIcon from '@mui/icons-material/Height';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SendIcon from '@mui/icons-material/Send';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// ── Constants ────────────────────────────────────────────────────────────────
const PERMIT_TYPES = [
  'LOTO(Electrical)',
  'Mechanical',
  'Hot Work',
  'Height Work',
  'Confined Space',
];

const PPE_REQUIRED = [
  'Safety Helmet',
  'Safety Goggles',
  'HRC4 Suit',
  'Safety Shoes',
  'Hand Gloves',
  'Face Shield',
  'Ear Protection',
];

const HAZARDS = [
  'Dropped Objects',
  'Electrocution',
  'Working At Heights',
  'Arc Flash',
  'Fire Hazard',
  'Confined Space',
  'Chemical Exposure',
  'Noise Hazard',
];

const CRITERIA = ['Electrical', 'Mechanical', 'Safety', 'Civil', 'Environmental'];

const COMPONENTS = [
  'Transformer',
  'WTG',
  'Feeder Panel',
  'Cable',
  'Switchyard',
  'Bearing',
  'Gearbox',
  'Generator',
];

const WORK_LOCATIONS = ['HT Yard', 'Turbine', 'Substation', 'Line', 'Control Room', 'Storage Area'];

const MOCK_WTG_LIST = [
  'SWSRAL-SC3-0AL01-VRB001',
  'SWSRAL-SC3-0AL01-VRB002',
  'SWSRAL-SC3-0AL01-VRB003',
  'SWSRAL-SC3-0AL01-VRB004',
  'SWSRAL-SC3-0AL01-VRB005',
];

const MOCK_WORK_ORDERS = ['WO-100245', 'WO-100246', 'WO-100247', 'WO-100248', 'WO-100249'];
const MOCK_TECHNICIANS = [
  'Bhogim Prathap',
  'Shiva Raj G',
  'Suresh Kumar M',
  'Ravi Sharma',
  'Mahesh Patel',
];
const MOCK_EMPLOYEES = ['Shivaraj Yadav G V', 'Rajesh Kumar', 'Anil Singh', 'Vikram Rao'];
const MOCK_APPROVERS = ['SHEIKSHA SHAIK', 'RAMESH KUMAR', 'SUNITHA DEVI', 'PRAKASH JHA'];

const YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

// ── Section metadata ────────────────────────────────────────────────────────
const SECTION_META = [
  {
    icon: ConstructionIcon,
    label: 'Permit Type Selection',
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    glow: 'rgba(79,70,229,0.2)',
  },
  {
    icon: BadgeIcon,
    label: 'WTG Details',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    glow: 'rgba(14,165,233,0.2)',
  },
  {
    icon: Engineering,
    label: 'Work Order Details',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #0d9488)',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Person,
    label: 'Technician & Employee Details',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    glow: 'rgba(245,158,11,0.2)',
  },
  {
    icon: Security,
    label: 'Permit Details',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    glow: 'rgba(239,68,68,0.2)',
  },
  {
    icon: Description,
    label: 'Work Details',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    glow: 'rgba(139,92,246,0.2)',
  },
  {
    icon: VerifiedUserIcon,
    label: 'Safety Details',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    glow: 'rgba(236,72,153,0.2)',
  },
  {
    icon: CalendarMonthIcon,
    label: 'Permit Duration',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    glow: 'rgba(6,182,212,0.2)',
  },
  {
    icon: LockIcon,
    label: 'Safety Validation',
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16, #a3e635)',
    glow: 'rgba(132,204,22,0.2)',
  },
  {
    icon: Build,
    label: 'Equipment Details',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    glow: 'rgba(249,115,22,0.2)',
  },
  {
    icon: LockIcon,
    label: 'Electrical Details',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24, #facc15)',
    glow: 'rgba(251,191,36,0.2)',
  },
  {
    icon: HandshakeIcon,
    label: 'Approval Details',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    glow: 'rgba(99,102,241,0.2)',
  },
  {
    icon: AttachFile,
    label: 'Attachments',
    color: '#64748b',
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
    glow: 'rgba(100,116,139,0.2)',
  },
];

// ── Component ───────────────────────────────────────────────────────────────
const CreateOperations = () => {
  const { classes } = useStyles();
  const theme = useTheme();

  // Form state
  const [permitTypeSelection, setPermitTypeSelection] = useState<
    'WorkOrder Permit' | 'General Permit'
  >('WorkOrder Permit');
  const [selectedWTG, setSelectedWTG] = useState<string>('');
  const [workOrders, setWorkOrders] = useState<string[]>([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [suzlonEmployees, setSuzlonEmployees] = useState<string[]>([]);
  const [nonSuzlonEmployees, setNonSuzlonEmployees] = useState('');
  const [permitTypes, setPermitTypes] = useState<string[]>([]);
  const [workDescription, setWorkDescription] = useState('');
  const [permitComponents, setPermitComponents] = useState<string[]>([]);
  const [workLocations, setWorkLocations] = useState<string[]>([]);
  const [ppeRequired, setPpeRequired] = useState<string[]>([]);
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [permitDuration, setPermitDuration] = useState('8');
  const [frpLadder, setFrpLadder] = useState('Yes');
  const [cableChecked, setCableChecked] = useState('Yes');
  const [toolBag, setToolBag] = useState('Yes');
  const [hubLock, setHubLock] = useState('No');
  const [winchOperation, setWinchOperation] = useState('No');
  const [electricalIsolation, setElectricalIsolation] = useState('Yes');
  const [selectedApprover, setSelectedApprover] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3]);

  const handleSectionToggle = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // Multi-select render helper
  const renderChipValue = (selected: unknown) => {
    const arr = selected as string[];
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {arr.slice(0, 3).map((value) => (
          <Chip key={value} label={value} size='small' sx={{ height: 22, fontSize: '0.72rem' }} />
        ))}
        {arr.length > 3 && (
          <Chip
            label={`+${arr.length - 3}`}
            size='small'
            sx={{ height: 22, fontSize: '0.72rem', backgroundColor: 'primary.light' }}
          />
        )}
      </Box>
    );
  };

  // Section wrapper
  const wrap = (index: number, children: React.ReactNode, collapsible = false) => {
    const m = SECTION_META[index];
    const Icon = m.icon;

    const iconBadge = (
      <Box
        sx={{
          background: m.gradient,
          boxShadow: `0 4px 14px ${m.glow}`,
          width: 36,
          height: 36,
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18, color: '#fff' }} />
      </Box>
    );

    const title = (
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: m.color }}>
        {m.label}
      </Typography>
    );

    if (collapsible) {
      const isExpanded = expandedSections.includes(index);
      return (
        <Accordion
          disableGutters
          expanded={isExpanded}
          onChange={() => handleSectionToggle(index)}
          sx={{
            borderLeft: `4px solid ${m.color}`,
            borderRadius: '16px !important',
            mb: 2.5,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
            '&::before': { display: 'none' },
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore sx={{ color: m.color, fontSize: 22 }} />}
            sx={{
              background: `${m.color}08`,
              borderBottom: '1px solid',
              borderColor: 'divider',
              minHeight: 0,
              px: 3,
              py: 0,
              '&.Mui-expanded': { minHeight: 0 },
              '& .MuiAccordionSummary-content': {
                margin: '14px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              },
            }}
          >
            {iconBadge}
            {title}
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>{children}</Box>
          </AccordionDetails>
        </Accordion>
      );
    }

    return (
      <Box
        sx={{
          borderLeft: `4px solid ${m.color}`,
          borderRadius: '16px',
          mb: 2.5,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 2,
            background: `${m.color}08`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {iconBadge}
          {title}
        </Box>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    );
  };

  // Checkbox list component
  const ChecklistItem = ({
    label,
    value,
    onChange,
    icon: Icon,
    color,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ElementType;
    color: string;
  }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.75,
        borderRadius: '12px',
        backgroundColor: 'background.default',
        border: `1px solid ${theme.palette.divider}`,
        mb: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 2px 8px ${color}20`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 18, color }} />
        </Box>
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</Typography>
      </Box>
      <FormControl size='small' sx={{ minWidth: 100 }}>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            borderRadius: '10px',
            '& .MuiSelect-select': {
              py: 1,
              fontWeight: 600,
              fontSize: '0.8rem',
            },
          }}
        >
          {YES_NO_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const handleSubmit = () => {
    const formData = {
      permitTypeSelection,
      selectedWTG,
      workOrders,
      selectedTechnicians,
      suzlonEmployees,
      nonSuzlonEmployees,
      permitTypes,
      workDescription,
      permitComponents,
      workLocations,
      ppeRequired,
      selectedHazards,
      selectedCriteria,
      permitDuration,
      frpLadder,
      cableChecked,
      toolBag,
      hubLock,
      winchOperation,
      electricalIsolation,
      selectedApprover,
      attachedFiles,
    };
    console.log('Form submitted:', formData);
  };

  return (
    <Box className={classes.formContainer}>
      <PageHeader
        title='Create Permit to Work'
        description='Fill in the details below to create a new work permit'
        icon={AssignmentInd}
        variant='admin'
      />

      {/* ── 1. Permit Type Selection ───────────────────────────────────── */}
      {wrap(
        0,
        <Box>
          <Box className={classes.toggleGroup}>
            <button
              className={`${classes.toggleButton} ${permitTypeSelection === 'WorkOrder Permit' ? 'active' : ''}`}
              onClick={() => setPermitTypeSelection('WorkOrder Permit')}
            >
              <BadgeIcon sx={{ fontSize: 18 }} />
              WorkOrder Permit
            </button>
            <button
              className={`${classes.toggleButton} ${permitTypeSelection === 'General Permit' ? 'active' : ''}`}
              onClick={() => setPermitTypeSelection('General Permit')}
            >
              <Build sx={{ fontSize: 18 }} />
              General Permit
            </button>
          </Box>
          <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: 'text.secondary' }}>
            {permitTypeSelection === 'WorkOrder Permit'
              ? 'Linked to specific work orders for structured maintenance activities'
              : 'General permit for ad-hoc maintenance and repair activities'}
          </Typography>
        </Box>,
      )}

      {/* ── 2. WTG Details ─────────────────────────────────────────────── */}
      {wrap(
        1,
        <Box className={classes.formGrid}>
          <FormControl fullWidth size='small'>
            <Select
              value={selectedWTG}
              label='Select WTG *'
              onChange={(e) => setSelectedWTG(e.target.value)}
            >
              <MenuItem value=''>
                <em>Select WTG</em>
              </MenuItem>
              {MOCK_WTG_LIST.map((wtg) => (
                <MenuItem key={wtg} value={wtg}>
                  {wtg}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 3. Work Order Details ──────────────────────────────────────── */}
      {wrap(
        2,
        <Box className={classes.formGrid}>
          <FormControl fullWidth size='small'>
            <InputLabel>Select Work Order Id</InputLabel>
            <Select
              multiple
              value={workOrders}
              onChange={(e) => setWorkOrders(e.target.value as string[])}
              input={<OutlinedInput label='Select Work Order Id' />}
              renderValue={renderChipValue}
            >
              {MOCK_WORK_ORDERS.map((wo) => (
                <MenuItem key={wo} value={wo}>
                  <CheckboxMui checked={workOrders.includes(wo)} size='small' />
                  <ListItemText primary={wo} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 4. Technician & Employee Details ──────────────────────────── */}
      {wrap(
        3,
        <Box className={classes.formGrid}>
          <FormControl fullWidth size='small'>
            <InputLabel>Select Technicians</InputLabel>
            <Select
              multiple
              value={selectedTechnicians}
              onChange={(e) => setSelectedTechnicians(e.target.value as string[])}
              input={<OutlinedInput label='Select Technicians' />}
              renderValue={renderChipValue}
            >
              {MOCK_TECHNICIANS.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  <CheckboxMui checked={selectedTechnicians.includes(tech)} size='small' />
                  <ListItemText primary={tech} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size='small'>
            <InputLabel>Select Suzlon Employees</InputLabel>
            <Select
              multiple
              value={suzlonEmployees}
              onChange={(e) => setSuzlonEmployees(e.target.value as string[])}
              input={<OutlinedInput label='Select Suzlon Employees' />}
              renderValue={renderChipValue}
            >
              {MOCK_EMPLOYEES.map((emp) => (
                <MenuItem key={emp} value={emp}>
                  <CheckboxMui checked={suzlonEmployees.includes(emp)} size='small' />
                  <ListItemText primary={emp} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size='small'
            label='Add Non-Suzlon Employees'
            placeholder='Enter contractor/external names'
            value={nonSuzlonEmployees}
            onChange={(e) => setNonSuzlonEmployees(e.target.value)}
            inputProps={{ maxLength: 100 }}
          />
        </Box>,
      )}

      {/* ── 5. Permit Details ──────────────────────────────────────────── */}
      {wrap(
        4,
        <Box>
          <FormControl fullWidth size='small' sx={{ mb: 3 }}>
            <InputLabel>Permit Type *</InputLabel>
            <Select
              multiple
              value={permitTypes}
              onChange={(e) => setPermitTypes(e.target.value as string[])}
              input={<OutlinedInput label='Permit Type *' />}
              renderValue={renderChipValue}
            >
              {PERMIT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  <CheckboxMui checked={permitTypes.includes(type)} size='small' />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Selected Permits:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {permitTypes.length === 0 ? (
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'italic' }}>
                No permit type selected
              </Typography>
            ) : (
              permitTypes.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onDelete={() => setPermitTypes(permitTypes.filter((t) => t !== type))}
                  sx={{
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    color: '#ef4444',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    border: '1px solid rgba(239,68,68,0.25)',
                  }}
                />
              ))
            )}
          </Box>
        </Box>,
      )}

      {/* ── 6. Work Details ───────────────────────────────────────────── */}
      {wrap(
        5,
        <Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Work Description *'
              multiline
              rows={3}
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder='Enter detailed description of work to be performed...'
              inputProps={{ maxLength: 255 }}
            />
            <Typography
              sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.5, textAlign: 'right' }}
            >
              {workDescription.length}/255
            </Typography>
          </Box>
          <Box className={classes.formGrid}>
            <FormControl fullWidth size='small'>
              <InputLabel>Permit Component of Work Done</InputLabel>
              <Select
                multiple
                value={permitComponents}
                onChange={(e) => setPermitComponents(e.target.value as string[])}
                input={<OutlinedInput label='Permit Component of Work Done' />}
                renderValue={renderChipValue}
              >
                {COMPONENTS.map((comp) => (
                  <MenuItem key={comp} value={comp}>
                    <CheckboxMui checked={permitComponents.includes(comp)} size='small' />
                    <ListItemText primary={comp} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size='small'>
              <InputLabel>Permit Issue for Work In</InputLabel>
              <Select
                multiple
                value={workLocations}
                onChange={(e) => setWorkLocations(e.target.value as string[])}
                input={<OutlinedInput label='Permit Issue for Work In' />}
                renderValue={renderChipValue}
              >
                {WORK_LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    <CheckboxMui checked={workLocations.includes(loc)} size='small' />
                    <ListItemText primary={loc} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>,
      )}

      {/* ── 7. Safety Details ───────────────────────────────────────────── */}
      {wrap(
        6,
        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Permit PPE Required:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {PPE_REQUIRED.map((ppe) => (
              <Chip
                key={ppe}
                label={ppe}
                onClick={() =>
                  setPpeRequired((prev) =>
                    prev.includes(ppe) ? prev.filter((p) => p !== ppe) : [...prev, ppe],
                  )
                }
                color={ppeRequired.includes(ppe) ? 'primary' : 'default'}
                variant={ppeRequired.includes(ppe) ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  fontWeight: ppeRequired.includes(ppe) ? 600 : 400,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  '&:hover': { opacity: 0.85, transform: 'translateY(-1px)' },
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary', mb: 1.5, mt: 2 }}
          >
            Hazards:
          </Typography>
          <FormControl fullWidth size='small' sx={{ mb: 3 }}>
            <InputLabel>Select Hazards</InputLabel>
            <Select
              multiple
              value={selectedHazards}
              onChange={(e) => setSelectedHazards(e.target.value as string[])}
              input={<OutlinedInput label='Select Hazards' />}
              renderValue={renderChipValue}
            >
              {HAZARDS.map((hazard) => (
                <MenuItem key={hazard} value={hazard}>
                  <CheckboxMui checked={selectedHazards.includes(hazard)} size='small' />
                  <ListItemText primary={hazard} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
            Criteria:
          </Typography>
          <FormControl fullWidth size='small'>
            <InputLabel>Select Criteria</InputLabel>
            <Select
              multiple
              value={selectedCriteria}
              onChange={(e) => setSelectedCriteria(e.target.value as string[])}
              input={<OutlinedInput label='Select Criteria' />}
              renderValue={renderChipValue}
            >
              {CRITERIA.map((crit) => (
                <MenuItem key={crit} value={crit}>
                  <CheckboxMui checked={selectedCriteria.includes(crit)} size='small' />
                  <ListItemText primary={crit} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>,
      )}

      {/* ── 8. Permit Duration ──────────────────────────────────────────── */}
      {wrap(
        7,
        <Box className={classes.formGridTwo}>
          <FormControl fullWidth size='small'>
            <InputLabel>Permit Valid Duration (1 to 8 Hrs)</InputLabel>
            <Select
              value={permitDuration}
              label='Permit Valid Duration (1 to 8 Hrs)'
              onChange={(e) => setPermitDuration(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((hr) => (
                <MenuItem key={hr} value={hr}>
                  {hr} Hour{hr > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.12) 100%)',
              border: '1px solid rgba(6,182,212,0.2)',
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 24, color: '#06b6d4', mr: 1 }} />
            <Box>
              <Typography
                sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4', lineHeight: 1 }}
              >
                {permitDuration}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
                Hour{parseInt(permitDuration) > 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Box>,
      )}

      {/* ── 9. Safety Validation ────────────────────────────────────────── */}
      {wrap(
        8,
        <Box>
          <ChecklistItem
            label='Proper FRP Ladder/Pole Climbing Kit Provided'
            value={frpLadder}
            onChange={setFrpLadder}
            icon={HeightIcon}
            color='#84cc16'
          />
          <ChecklistItem
            label='Underground/Overhead Cables checked for intervention'
            value={cableChecked}
            onChange={setCableChecked}
            icon={LockIcon}
            color='#84cc16'
          />
        </Box>,
      )}

      {/* ── 10. Equipment Details ──────────────────────────────────────── */}
      {wrap(
        9,
        <Box>
          <ChecklistItem
            label='Hub Lock'
            value={hubLock}
            onChange={setHubLock}
            icon={Build}
            color='#f97316'
          />
          <ChecklistItem
            label='Winch Operation'
            value={winchOperation}
            onChange={setWinchOperation}
            icon={Engineering}
            color='#f97316'
          />
        </Box>,
      )}

      {/* ── 11. Electrical Details ─────────────────────────────────────── */}
      {wrap(
        10,
        <Box>
          <ChecklistItem
            label='Electrical Isolation Required'
            value={electricalIsolation}
            onChange={setElectricalIsolation}
            icon={Security}
            color='#fbbf24'
          />
        </Box>,
      )}

      {/* ── 12. Approval Details ───────────────────────────────────────── */}
      {wrap(
        11,
        <Box className={classes.formGridTwo}>
          <FormControl fullWidth size='small'>
            <InputLabel>Select Approver *</InputLabel>
            <Select
              value={selectedApprover}
              label='Select Approver *'
              onChange={(e) => setSelectedApprover(e.target.value)}
            >
              {MOCK_APPROVERS.map((approver) => (
                <MenuItem key={approver} value={approver}>
                  {approver}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.12) 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <HandshakeIcon sx={{ fontSize: 24, color: '#6366f1', mr: 1 }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#6366f1' }}>
              {selectedApprover || 'Select Approver'}
            </Typography>
          </Box>
        </Box>,
      )}

      {/* ── Attachments (Collapsible) ─────────────────────────────────── */}
      {wrap(
        12,
        <>
          <UploadFile
            onChange={(files) =>
              files && setAttachedFiles((prev) => [...prev, ...(Array.from(files) as File[])])
            }
            multiple
            accept='.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif'
            buttonText='Upload Files'
            helperText='Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG, GIF'
            maxSize={10 * 1024 * 1024}
          />
          {attachedFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 1 }}>
                Attached Files:
              </Typography>
              {attachedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 1.5,
                    borderRadius: '8px',
                    backgroundColor: 'background.default',
                    mb: 0.5,
                  }}
                >
                  <AttachFile sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '0.8rem', flex: 1 }}>{file.name}</Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                    {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </>,
        true,
      )}

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <Box className={classes.buttonContainer}>
        <Button variant='outlined' color='inherit' sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button variant='outlined' color='secondary'>
          Save as Draft
        </Button>
        <Button
          variant='contained'
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
            },
          }}
        >
          Submit for Approval
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOperations;
