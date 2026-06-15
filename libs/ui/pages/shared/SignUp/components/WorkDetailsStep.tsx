import { Box, Typography, Grid, Select, MenuItem, TextField } from '@sprintpulse/component';
import { FormControl, InputLabel, FormHelperText, SelectChangeEvent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useFieldError } from '@sprintpulse/hooks';

const DEPARTMENT_OPTIONS = [
  'IT Administration',
  'Maintenance',
  'Human Resources',
  'Operations',
  'Service',
  'External Consulting',
  'Other',
];

interface WorkDetailsStepProps {
  values: {
    employeeId: string;
    department: string;
    managerEmail: string;
    reasonForAccess: string;
    role: string;
  };
  touched: Partial<Record<string, boolean>>;
  errors: Partial<Record<string, string>>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onRoleChange: (event: SelectChangeEvent<string>) => void;
  onDepartmentChange: (event: SelectChangeEvent<string>) => void;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  classes: Record<string, string>;
}

const WorkDetailsStep = ({
  values,
  touched,
  errors,
  onChange,
  onRoleChange,
  onDepartmentChange,
  onBlur,
  classes,
}: WorkDetailsStepProps) => {
  const reqError = useFieldError();

  return (
    <Box className={classes.sectionCard}>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <WorkIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography fontWeight={600} fontSize='0.95rem'>
          Work Details
        </Typography>
      </Box>
      <Box className={classes.stepContent}>
        <Grid container spacing={2}>
          {/* Employee ID + Department */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='employeeId'
              name='employeeId'
              label='Employee ID (Optional)'
              type='text'
              placeholder='e.g. 12345'
              value={values.employeeId}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.employeeId && Boolean(errors.employeeId)}
              errorText={touched.employeeId ? errors.employeeId : undefined}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Select
                labelId='department-label'
                id='department'
                name='department'
                value={values.department}
                label='Department (Optional)'
                onChange={onDepartmentChange}
                onBlur={onBlur}
              >
                {DEPARTMENT_OPTIONS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Manager Email */}
          <Grid size={{ xs: 12 }}>
            <TextField
              id='managerEmail'
              name='managerEmail'
              label='Reporting Manager Email (Optional)'
              type='email'
              placeholder='manager@company.com'
              value={values.managerEmail}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.managerEmail && Boolean(errors.managerEmail)}
              errorText={touched.managerEmail ? errors.managerEmail : undefined}
              fullWidth
              helperText='Helps route your approval request to the right person.'
            />
          </Grid>

          {/* Requested Role */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth required error={touched.role && Boolean(errors.role)}>
              <Select
                labelId='role-label'
                id='role'
                name='role'
                value={values.role}
                label='Requested Role'
                onChange={onRoleChange}
                onBlur={onBlur}
                required
              >
                <MenuItem value='admin'>
                  Admin — Manage platform settings, users &amp; reports
                </MenuItem>
                <MenuItem value='consultant'>
                  Consultant — Read-only access to reports &amp; analytics
                </MenuItem>
              </Select>
              <FormHelperText>
                {errors.role && touched.role
                  ? errors.role
                  : 'All sign-ups require admin approval before platform access is granted.'}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Reason for Access */}
          <Grid size={{ xs: 12 }}>
            <TextField
              id='reasonForAccess'
              name='reasonForAccess'
              label='Reason for Access'
              type='text'
              placeholder='Briefly describe why you need access to SprintPulse...'
              value={values.reasonForAccess}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.reasonForAccess && Boolean(errors.reasonForAccess)}
              errorText={reqError(touched.reasonForAccess, errors.reasonForAccess)}
              fullWidth
              required
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WorkDetailsStep;
