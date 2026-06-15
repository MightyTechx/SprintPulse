import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Slide,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useStyles } from '../styles';
import { useNotification } from '@sprintpulse/hooks';
import { useAuthActionMutation } from '@sprintpulse/services';
import { useLocationSearch } from '../../../../../hooks/useLocationSearch';
import TextField from '../../../../../components/TextField/TextField';

export const SlideUp = React.forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
    return <Slide direction='up' ref={ref} {...props} />;
  },
);

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Non-binary / Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

const DEPARTMENTS = [
  'IT Administration',
  'Maintenance',
  'Human Resources',
  'Operations',
  'Service',
  'External Consulting',
  'Other',
];

const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'admin', label: 'Admin' },
];

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone format'),
  password: Yup.string().required('Password is required').min(8, 'Min 8 characters required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  dateOfBirth: Yup.string(),
  gender: Yup.string(),
  cityZone: Yup.string(),
  zipcode: Yup.string(),
  workLocation: Yup.string(),
  employeeId: Yup.string(),
  department: Yup.string(),
  businessUnit: Yup.string(),
  managerName: Yup.string(),
  role: Yup.string().required('Role is required'),
});

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const DuplicateError = ({ message }: { message: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'error.main' }}>
    <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />
    <Typography component='span' sx={{ fontSize: '0.75rem' }}>
      {message}
    </Typography>
  </Box>
);

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, onClose, onCreated }) => {
  const { classes } = useStyles();
  const notify = useNotification();
  const [authAction, { isLoading }] = useAuthActionMutation();
  const [checkAction] = useAuthActionMutation();
  const city = useLocationSearch(2);
  const work = useLocationSearch(2);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkEmail = (email: string) => {
    if (emailTimer.current) clearTimeout(emailTimer.current);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailExists(false);
      return;
    }
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await checkAction({ action: 'check-availability', email }).unwrap();
        setEmailExists(res.data?.emailExists ?? false);
      } catch {
        setEmailExists(false);
      }
    }, 600);
  };

  const checkPhone = (phone: string) => {
    if (phoneTimer.current) clearTimeout(phoneTimer.current);
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      setPhoneExists(false);
      return;
    }
    phoneTimer.current = setTimeout(async () => {
      try {
        const res = await checkAction({ action: 'check-availability', phone }).unwrap();
        setPhoneExists(res.data?.phoneExists ?? false);
      } catch {
        setPhoneExists(false);
      }
    }, 600);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      cityZone: '',
      zipcode: '',
      employeeId: '',
      department: '',
      workLocation: '',
      businessUnit: '',
      managerName: '',
      role: 'user',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await authAction({
          action: 'create-user',
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone || null,
          department: values.department || null,
          workLocation: values.workLocation || null,
          employeeId: values.employeeId || null,
          businessUnit: values.businessUnit || null,
          managerName: values.managerName || null,
          role: values.role,
          password: values.password,
          dateOfBirth: values.dateOfBirth || null,
          gender: values.gender || null,
          cityZone: values.cityZone || null,
          zipcode: values.zipcode || null,
        }).unwrap();

        notify.success('User created successfully');
        formik.resetForm();
        city.clear();
        work.clear();
        onCreated?.();
        onClose();
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        notify.error(error?.data?.message || error?.message || 'Failed to create user');
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      city.clear();
      work.clear();
      setEmailExists(false);
      setPhoneExists(false);
    }
  }, [open]);

  const handleDateChange = (value: dayjs.Dayjs | null) => {
    formik.setFieldValue('dateOfBirth', value ? value.format('YYYY-MM-DD') : '');
  };

  const initials =
    `${formik.values.firstName[0] || ''}${formik.values.lastName[0] || ''}`.toUpperCase();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth='md'
      className={classes.dialog}
    >
      {/* Hero Header */}
      <Box className={classes.modalHero}>
        <Box className={classes.modalIconBox}>
          <PersonAddIcon sx={{ fontSize: 26, color: '#fff' }} />
        </Box>
        <Box className={classes.modalTitleBox}>
          <Typography className={classes.modalTitle}>Create New User</Typography>
          <Typography className={classes.modalSubtitle}>Add a new user to the system</Typography>
        </Box>
        <Avatar className={classes.avatarPreview}>{initials || '?'}</Avatar>
        <IconButton onClick={onClose} className={classes.modalCloseBtn} disabled={isLoading}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{ p: 3, bgcolor: 'background.default', maxHeight: '60vh', overflow: 'auto' }}
        >
          {/* Personal Information */}
          <Box className={classes.sectionCard}>
            <Box className={classes.sectionHeader}>
              <Box className={classes.sectionIcon}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography fontWeight={600} fontSize='0.95rem'>
                Personal Information
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='First Name'
                    name='firstName'
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                        ? String(formik.errors.firstName)
                        : ''
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Last Name'
                    name='lastName'
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                        ? String(formik.errors.lastName)
                        : ''
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Email'
                    name='email'
                    type='email'
                    value={formik.values.email}
                    onChange={(e) => {
                      formik.handleChange(e);
                      checkEmail(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    error={(formik.touched.email && Boolean(formik.errors.email)) || emailExists}
                    errorText={
                      emailExists ? (
                        <DuplicateError message='This email is already registered' />
                      ) : formik.touched.email && formik.errors.email ? (
                        String(formik.errors.email)
                      ) : undefined
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Phone'
                    name='phone'
                    value={formik.values.phone}
                    onChange={(e) => {
                      formik.handleChange(e);
                      checkPhone(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    error={(formik.touched.phone && Boolean(formik.errors.phone)) || phoneExists}
                    errorText={
                      phoneExists ? (
                        <DuplicateError message='This phone number is already registered' />
                      ) : formik.touched.phone && formik.errors.phone ? (
                        String(formik.errors.phone)
                      ) : undefined
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date of Birth'
                      value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                      onChange={handleDateChange}
                      maxDate={dayjs().subtract(18, 'year')}
                      slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small'>
                    <Select
                      name='gender'
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label='Gender'
                      required
                    >
                      {GENDER_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    options={city.results}
                    getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.display_name)}
                    filterOptions={(x) => x}
                    loading={city.isLoading}
                    inputValue={formik.values.cityZone}
                    onInputChange={(_, newValue) => {
                      city.setQuery(newValue);
                      formik.setFieldValue('cityZone', newValue);
                    }}
                    onChange={(_, option) => {
                      if (option && typeof option !== 'string') {
                        city.setQuery('');
                        formik.setFieldValue('cityZone', option.display_name);
                        if (option.address?.postcode) {
                          formik.setFieldValue('zipcode', option.address.postcode);
                        }
                      }
                    }}
                    renderOption={(props, option) => {
                      const [primary, ...rest] = option.display_name.split(',');
                      return (
                        <li {...props} key={option.place_id}>
                          <SearchIcon
                            sx={{ fontSize: 15, mr: 1, flexShrink: 0, color: 'text.secondary' }}
                          />
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant='body2' noWrap>
                              {primary}
                            </Typography>
                            {rest.length > 0 && (
                              <Typography variant='caption' color='text.secondary' noWrap>
                                {rest.join(',').trim()}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      );
                    }}
                    renderInput={({ InputProps, inputProps: autoInputProps, ...params }) => (
                      <TextField
                        {...params}
                        label='City / Zone of Operation'
                        placeholder='Start typing to search...'
                        size='small'
                        inputProps={{ ...autoInputProps, name: 'cityZone' }}
                        onBlur={formik.handleBlur}
                        InputProps={
                          {
                            ...InputProps,
                            endAdornment: (
                              <>
                                {city.isLoading ? (
                                  <InputAdornment position='end'>
                                    <CircularProgress size={14} />
                                  </InputAdornment>
                                ) : (
                                  <InputAdornment position='end'>
                                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  </InputAdornment>
                                )}
                                {InputProps.endAdornment}
                              </>
                            ),
                          } as Record<string, unknown>
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Zipcode / Postal Code'
                    name='zipcode'
                    value={formik.values.zipcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Employee ID'
                    name='employeeId'
                    value={formik.values.employeeId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Work Information */}
          <Box className={classes.sectionCard} sx={{ mt: 2 }}>
            <Box className={classes.sectionHeader}>
              <Box className={classes.sectionIcon}>
                <BusinessIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography fontWeight={600} fontSize='0.95rem'>
                Work Information
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small'>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name='department'
                      value={formik.values.department}
                      label='Department'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value=''>— None —</MenuItem>
                      {DEPARTMENTS.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    freeSolo
                    options={work.results}
                    getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.display_name)}
                    filterOptions={(x) => x}
                    loading={work.isLoading}
                    inputValue={formik.values.workLocation}
                    onInputChange={(_, newValue) => {
                      work.setQuery(newValue);
                      formik.setFieldValue('workLocation', newValue);
                    }}
                    onChange={(_, option) => {
                      if (option && typeof option !== 'string') {
                        work.setQuery('');
                        formik.setFieldValue('workLocation', option.display_name);
                      }
                    }}
                    renderOption={(props, option) => {
                      const [primary, ...rest] = option.display_name.split(',');
                      return (
                        <li {...props} key={option.place_id}>
                          <SearchIcon
                            sx={{ fontSize: 15, mr: 1, flexShrink: 0, color: 'text.secondary' }}
                          />
                          <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant='body2' noWrap>
                              {primary}
                            </Typography>
                            {rest.length > 0 && (
                              <Typography variant='caption' color='text.secondary' noWrap>
                                {rest.join(',').trim()}
                              </Typography>
                            )}
                          </Box>
                        </li>
                      );
                    }}
                    renderInput={({ InputProps, inputProps: autoInputProps, ...params }) => (
                      <TextField
                        {...params}
                        label='Work Location'
                        placeholder='Start typing to search...'
                        size='small'
                        inputProps={{ ...autoInputProps, name: 'workLocation' }}
                        onBlur={formik.handleBlur}
                        InputProps={
                          {
                            ...InputProps,
                            endAdornment: (
                              <>
                                {work.isLoading ? (
                                  <InputAdornment position='end'>
                                    <CircularProgress size={14} />
                                  </InputAdornment>
                                ) : (
                                  <InputAdornment position='end'>
                                    <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                  </InputAdornment>
                                )}
                                {InputProps.endAdornment}
                              </>
                            ),
                          } as Record<string, unknown>
                        }
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Business Unit'
                    name='businessUnit'
                    value={formik.values.businessUnit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Manager Name'
                    name='managerName'
                    value={formik.values.managerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small' required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name='role'
                      value={formik.values.role}
                      label='Role'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                      {ROLES.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Account Security */}
          <Box className={classes.sectionCard} sx={{ mt: 2 }}>
            <Box className={classes.sectionHeader}>
              <Box className={classes.sectionIcon}>
                <LockIcon sx={{ fontSize: 16 }} />
              </Box>
              <Typography fontWeight={600} fontSize='0.95rem'>
                Account Security
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Password'
                    name='password'
                    type='password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={
                      formik.touched.password && formik.errors.password
                        ? String(formik.errors.password)
                        : 'Min 8 characters'
                    }
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? String(formik.errors.confirmPassword)
                        : ''
                    }
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            borderTop: '1px solid rgba(99,102,241,0.15)',
            bgcolor: '#f8fafc',
            gap: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
            '@media (max-width:600px)': {
              flexDirection: 'column',
              '& .MuiButton-root': { width: '100%', m: 0 },
            },
          }}
        >
          <Button
            variant='outlined'
            color='inherit'
            onClick={onClose}
            disabled={isLoading}
            sx={{
              borderColor: 'rgba(100,116,139,0.3)',
              color: '#64748b',
              '&:hover': {
                borderColor: 'rgba(100,116,139,0.5)',
                bgcolor: 'rgba(100,116,139,0.05)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%)',
              color: '#fff',
              fontWeight: 600,
              px: 3,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6d28d9 100%)',
                boxShadow: '0 6px 20px rgba(99,102,241,0.45)',
                transform: 'translateY(-1px)',
              },
              '&:active': { transform: 'translateY(0)' },
              '&.Mui-disabled': {
                background: 'rgba(99,102,241,0.3)',
                color: 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {isLoading ? 'Pening...' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateUserDialog;
