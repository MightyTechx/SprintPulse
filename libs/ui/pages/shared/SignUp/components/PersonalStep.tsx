import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  CircularProgress,
  InputAdornment,
} from '@sprintpulse/component';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFieldError } from '@sprintpulse/hooks';
import { useLocationSearch } from '../../../../hooks/useLocationSearch';
import TextField from '../../../../components/TextField/TextField';
import { SelectChangeEvent } from '@mui/material';

const DuplicateError = ({ message }: { message: string }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.4,
      color: 'error.main !important',
    }}
  >
    <ErrorOutlineIcon sx={{ fontSize: '0.9rem' }} />
    <Typography sx={{ fontSize: '12px !important', color: 'error.main !important' }}>
      {message}
    </Typography>
  </Box>
);

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Non-binary / Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

interface PersonalStepProps {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    workLocation: string;
    cityZone: string;
    zipcode: string;
  };
  touched: Partial<Record<string, boolean>>;
  errors: Partial<Record<string, string>>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSelectChange: (field: string) => (e: SelectChangeEvent<string>) => void;
  onDateChange: (field: string, value: string) => void;
  onBlur: React.FocusEventHandler;
  classes: Record<string, string>;
  emailExists?: boolean;
  phoneExists?: boolean;
  onEmailChange?: (email: string) => void;
  onPhoneChange?: (phone: string) => void;
  onLocationChange?: (field: string, value: string) => void;
}

const PersonalStep = ({
  values,
  touched,
  errors,
  onChange,
  onSelectChange,
  onDateChange,
  onBlur,
  classes,
  emailExists,
  phoneExists,
  onEmailChange,
  onPhoneChange,
  onLocationChange,
}: PersonalStepProps) => {
  const reqError = useFieldError();
  const city = useLocationSearch(2);
  const work = useLocationSearch(2);

  return (
    <Box className={classes.sectionCard}>
      <Box className={classes.sectionHeader}>
        <Box className={classes.sectionIcon}>
          <PersonIcon sx={{ fontSize: 16 }} />
        </Box>
        <Typography fontWeight={600} fontSize='0.95rem'>
          Personal Information
        </Typography>
      </Box>
      <Box className={classes.stepContent}>
        <Grid container spacing={2}>
          {/* Name row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='firstName'
              name='firstName'
              label='First Name'
              type='text'
              placeholder='First name'
              value={values.firstName}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.firstName && Boolean(errors.firstName)}
              errorText={reqError(touched.firstName, errors.firstName)}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='lastName'
              name='lastName'
              label='Last Name'
              type='text'
              placeholder='Last name'
              value={values.lastName}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.lastName && Boolean(errors.lastName)}
              errorText={reqError(touched.lastName, errors.lastName)}
              fullWidth
              required
            />
          </Grid>

          {/* Contact row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='email'
              name='email'
              label='Email'
              type='email'
              placeholder='you@example.com'
              value={values.email}
              onChange={(e) => {
                onChange(e);
                onEmailChange?.(e.target.value);
              }}
              onBlur={onBlur}
              error={(touched.email && Boolean(errors.email)) || emailExists}
              errorText={
                emailExists ? (
                  <DuplicateError message='This email is already registered' />
                ) : (
                  reqError(touched.email, errors.email)
                )
              }
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              id='phone'
              name='phone'
              label='Phone Number'
              type='tel'
              placeholder='+91 98765 43210'
              value={values.phone ?? ''}
              onChange={(e) => {
                onChange(e);
                onPhoneChange?.(e.target.value);
              }}
              onBlur={onBlur}
              error={(touched.phone && Boolean(errors.phone)) || phoneExists}
              errorText={
                phoneExists ? (
                  <DuplicateError message='This phone number is already registered' />
                ) : (
                  reqError(touched.phone, errors.phone)
                )
              }
              inputProps={{ inputMode: 'numeric' }}
              fullWidth
              required
            />
          </Grid>

          {/* DOB + Gender row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date of Birth'
                value={values.dateOfBirth ? dayjs(values.dateOfBirth) : null}
                onChange={(newValue) =>
                  onDateChange('dateOfBirth', newValue ? newValue.format('YYYY-MM-DD') : '')
                }
                maxDate={dayjs().subtract(18, 'year')}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    onBlur,
                    error: touched.dateOfBirth && Boolean(errors.dateOfBirth),
                    helperText: reqError(touched.dateOfBirth, errors.dateOfBirth),
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required error={touched.gender && Boolean(errors.gender)}>
              <Select
                labelId='gender-label'
                id='gender'
                name='gender'
                value={values.gender}
                label='Gender'
                onChange={onSelectChange('gender')}
                onBlur={onBlur}
                required
              >
                {GENDER_OPTIONS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {touched.gender && errors.gender && (
                <FormHelperText>{reqError(touched.gender, errors.gender)}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* City / Zone + Zipcode row */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              freeSolo
              options={city.results}
              getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.display_name)}
              filterOptions={(x) => x}
              loading={city.isLoading}
              inputValue={values.cityZone}
              onInputChange={(_, newValue) => {
                city.setQuery(newValue);
                onLocationChange?.('cityZone', newValue);
              }}
              onChange={(_, option) => {
                if (option && typeof option !== 'string') {
                  city.setQuery('');
                  onLocationChange?.('cityZone', option.display_name);
                  if (option.address?.postcode) {
                    onLocationChange?.('zipcode', option.address.postcode);
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
                  required
                  error={touched.cityZone && Boolean(errors.cityZone)}
                  errorText={reqError(touched.cityZone, errors.cityZone)}
                  inputProps={{ ...autoInputProps, name: 'cityZone' }}
                  onBlur={onBlur}
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
              id='zipcode'
              name='zipcode'
              label='Zipcode / Postal Code'
              type='text'
              placeholder='e.g. 560001'
              value={values.zipcode}
              onChange={onChange}
              onBlur={onBlur}
              error={touched.zipcode && Boolean(errors.zipcode)}
              errorText={touched.zipcode ? errors.zipcode : undefined}
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              fullWidth
              required
            />
          </Grid>

          {/* Work Location */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              freeSolo
              options={work.results}
              getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.display_name)}
              filterOptions={(x) => x}
              loading={work.isLoading}
              inputValue={values.workLocation}
              onInputChange={(_, newValue) => {
                work.setQuery(newValue);
                onLocationChange?.('workLocation', newValue);
              }}
              onChange={(_, option) => {
                if (option && typeof option !== 'string') {
                  work.setQuery('');
                  onLocationChange?.('workLocation', option.display_name);
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
                  inputProps={{ ...autoInputProps, name: 'workLocation' }}
                  onBlur={onBlur}
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
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalStep;
