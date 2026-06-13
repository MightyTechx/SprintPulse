import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Tabs, Tab, Chip, Button, Loader } from '@infygen/component';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useStyles } from './styles';
import { PermitDetails } from './types/permitDetails.types';
import { constants } from '@infygen/utils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const mockPermitData: PermitDetails = {
  id: 'P-047183',
  permitName: 'P-047183',
  ownerId: 'USR001',
  ownerName: 'Bhogim Prathap',
  workOrderType: '',
  permitStatus: 'TBT Details Pending',
  permitApprover: 'Sheiksha Shaik',
  permitApprovalStatus: 'Approved',
  permitType: 'General Work Permit',
  isActive: true,
  durationHours: 8,
  associatedEmployeeCount: 3,
  componentOfWork: 'Transformer',
  workLocation: 'HT Yard',
  workOrder: '',
  hazard: 'Electrocution',
  otherHazards: '',
  workDescription: 'VCB inspection',
  detailsOfWorkDone: '',
  criteria: 'Electrical',
  wtg: 'SWS RAL-SC3-OAL01-VRB047',
  currentUser: 'Bhogim Prathap',
  ppeRequired: [
    'Safety Helmet',
    'Safety Goggles',
    'Safety Shoes',
    'Elect. Gloves Class 4',
    'HRC4 Suit',
  ],
  approveRejectComment: 'Ok',
  winchOperation: false,
  isolationRequired: false,
  hubLock: false,
  lotoPhotosCaptured: false,
  hubLockPhotoCaptured: false,
  winchPhotoCaptured: false,
  properFRPLadder: true,
  undergroundOverheadCables: true,
  oxymeterNeeded: 'NA',
  firstAidKitNeeded: 'NA',
  handLampNeeded: 'NA',
  state: 'Andhra Pradesh',
  area: 'Borampalli',
  permitExpiryAge: '0 days',
  permitRequestedTime: '31 March 2026 at 9:34 am',
  permitStartTime: '31 March 2026 at 9:46 am',
  permitValidTill: '31 March 2026 at 5:34 pm',
  extensionApprovalStatus: 'Not Started',
  extensionGiven: false,
  extensionDurationHours: 0,
};

const PermitDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const { classes } = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permit, setPermit] = useState<PermitDetails | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPermit(mockPermitData);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('pending')) return '#f59e0b';
    if (status.toLowerCase().includes('approved')) return '#10b981';
    if (status.toLowerCase().includes('rejected')) return '#ef4444';
    return '#64748b';
  };

  const getYesNoChip = (value: boolean) => {
    return value ? (
      <Chip label='Yes' size='small' className={`${classes.yesNoChip} ${classes.yesChip}`} />
    ) : (
      <Chip label='No' size='small' className={`${classes.yesNoChip} ${classes.noChip}`} />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Loader />
      </Box>
    );
  }

  if (!permit) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Permit not found
        </Typography>
        <IconButton onClick={() => navigate(AdminPath.OPERATIONS)} sx={{ mt: 2 }}>
          <ArrowBackIcon /> Back to Operations
        </IconButton>
      </Box>
    );
  }

  const statusColor = getStatusColor(permit.permitStatus);

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.headerTop}>
          <IconButton className={classes.backButton} onClick={() => navigate(AdminPath.OPERATIONS)}>
            <ArrowBackIcon />
          </IconButton>
          <Box className={classes.headerContent}>
            <Typography className={classes.permitLabel}>Permit</Typography>
            <Typography className={classes.permitId}>{permit.permitName}</Typography>
            <Typography className={classes.permitSummary}>
              {permit.workLocation} | {permit.permitApprovalStatus} | {permit.ownerName} |{' '}
              {permit.permitRequestedTime}
            </Typography>
          </Box>
          <Box sx={{ width: 40 }} />
        </Box>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          centered
          classes={{ indicator: classes.tabIndicator }}
          sx={{ mt: 1 }}
        >
          <Tab label='Details' className={classes.tab} />
          <Tab label='Related' className={classes.tab} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* General Permit Information */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>General Permit Information</Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Name</Typography>
              <Typography className={classes.fieldValue}>{permit.permitName}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Owner ID</Typography>
              <Typography className={classes.fieldValueLink}>{permit.ownerName}</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Work Order Type</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ fontSize: 14, color: statusColor }} />
                <Typography
                  className={classes.fieldValue}
                  sx={{ fontWeight: 700, color: statusColor }}
                >
                  {permit.permitStatus}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Component</Typography>
              <Typography className={classes.fieldValue}>{permit.componentOfWork}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Approver</Typography>
              <Typography className={classes.fieldValueLink}>{permit.permitApprover}</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Work Location</Typography>
              <Typography className={classes.fieldValue}>{permit.workLocation}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Approval Status</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                <Typography className={classes.fieldValue} sx={{ color: '#10b981' }}>
                  {permit.permitApprovalStatus}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Type</Typography>
              <Typography className={classes.fieldValue}>{permit.permitType}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Work Order</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
        </Box>

        {/* PPE Required */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>PPE Required</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {permit.ppeRequired.map((ppe, index) => (
              <Chip key={index} label={ppe} size='small' className={classes.ppeChip} />
            ))}
          </Box>
          <Box className={classes.fieldRow} sx={{ mt: 2 }}>
            <Box>
              <Typography className={classes.fieldLabel}>Approve/Reject Comment</Typography>
              <Typography className={classes.fieldValue}>{permit.approveRejectComment}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Work & Hazard Details */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>Work & Hazard Details</Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Hazard</Typography>
              <Typography className={classes.fieldValue} sx={{ color: '#ef4444', fontWeight: 700 }}>
                {permit.hazard}
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Other Hazards</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Winch Operation</Typography>
              {getYesNoChip(permit.winchOperation)}
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Work Description</Typography>
              <Typography className={classes.fieldValue}>{permit.workDescription}</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Isolation Required</Typography>
              {getYesNoChip(permit.isolationRequired)}
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>HUB Lock</Typography>
              {getYesNoChip(permit.hubLock)}
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Details of Work Done</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Current User</Typography>
              <Typography className={classes.fieldValueLink}>{permit.currentUser}</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>WTG</Typography>
              <Typography className={classes.fieldValue} sx={{ fontSize: '0.75rem' }}>
                {permit.wtg}
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Active</Typography>
              {getYesNoChip(permit.isActive)}
            </Box>
          </Box>
        </Box>

        {/* Safety Checklists & Photos */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>Safety Checklists & Photos</Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>LOTO Photos Captured</Typography>
              {getYesNoChip(permit.lotoPhotosCaptured)}
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>HUB Lock Photo Captured</Typography>
              {getYesNoChip(permit.hubLockPhotoCaptured)}
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Winch Photo Captured</Typography>
              {getYesNoChip(permit.winchPhotoCaptured)}
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Action Taken</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Duration</Typography>
              <Typography className={classes.fieldValue}>{permit.durationHours} Hrs</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Criteria</Typography>
              <Chip
                label={permit.criteria}
                size='small'
                sx={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#7c3aed',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>FRP Ladder Provided</Typography>
              {getYesNoChip(permit.properFRPLadder)}
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Cables Checked</Typography>
              {getYesNoChip(permit.undergroundOverheadCables)}
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Associated Employees</Typography>
              <Typography className={classes.fieldValue}>
                {permit.associatedEmployeeCount}
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Rejection Comments</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
        </Box>

        {/* Location and Timing */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>Location and Timing</Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit State</Typography>
              <Typography className={classes.fieldValue}>{permit.state}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Area</Typography>
              <Typography className={classes.fieldValue}>{permit.area}</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Expiry Age</Typography>
              <Typography className={classes.fieldValue}>{permit.permitExpiryAge}</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Requested Time</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography className={classes.fieldValue} sx={{ fontSize: '0.8rem' }}>
                  {permit.permitRequestedTime}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Start Time</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EventIcon sx={{ fontSize: 14, color: '#10b981' }} />
                <Typography className={classes.fieldValue} sx={{ fontSize: '0.8rem' }}>
                  {permit.permitStartTime}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Permit Valid Till</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EventIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                <Typography
                  className={classes.fieldValue}
                  sx={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}
                >
                  {permit.permitValidTill}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Extension Status</Typography>
              <Chip
                label={permit.extensionApprovalStatus}
                size='small'
                sx={{
                  background: 'rgba(100, 116, 139, 0.1)',
                  color: '#64748b',
                  border: '1px solid rgba(100, 116, 139, 0.3)',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Extension Given</Typography>
              {getYesNoChip(permit.extensionGiven)}
            </Box>
          </Box>
        </Box>

        {/* Confined Space Entry Permit */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>
            Confined Space Entry Permit (CSEP)
          </Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Name of Attendant</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Name of Entrant (1)</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Name of Entrant (2)</Typography>
              <Typography className={classes.fieldValue}>-</Typography>
            </Box>
          </Box>
        </Box>

        {/* Additional Equipment */}
        <Box className={classes.contentSection}>
          <Typography className={classes.sectionTitle}>Additional Equipment</Typography>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Oxymeter Needed</Typography>
              <Chip
                label={permit.oxymeterNeeded}
                size='small'
                className={`${classes.yesNoChip} ${classes.naChip}`}
              />
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>First Aid Kit Needed</Typography>
              <Chip
                label={permit.firstAidKitNeeded}
                size='small'
                className={`${classes.yesNoChip} ${classes.naChip}`}
              />
            </Box>
          </Box>
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>Hand/Head Lamp Needed</Typography>
              <Chip
                label={permit.handLampNeeded}
                size='small'
                className={`${classes.yesNoChip} ${classes.naChip}`}
              />
            </Box>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box className={classes.contentSection}>
          <Typography sx={{ textAlign: 'center', color: '#64748b', py: 4 }}>
            Related items will be displayed here
          </Typography>
        </Box>
      </TabPanel>

      {/* Actions Button */}
      <Box sx={{ p: 2, pb: 10 }}>
        <Button variant='contained' className={classes.actionsButton} startIcon={<FlashOnIcon />}>
          Actions
        </Button>
      </Box>
    </Box>
  );
};

export default PermitDetailsPage;
