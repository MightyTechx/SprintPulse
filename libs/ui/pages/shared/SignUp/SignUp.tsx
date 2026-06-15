import { Avatar, SelectChangeEvent } from '@mui/material';
import { Box, Typography, Button } from '@sprintpulse/component';
import { constants } from '@sprintpulse/utils';
import { useStyles } from './SignUp.styles';
import useSignUp, { STEPS } from './hooks/useSignUp';
import StepProgress from './components/StepProgress';
import PersonalStep from './components/PersonalStep';
import WorkDetailsStep from './components/WorkDetailsStep';
import SecurityStep from './components/SecurityStep';
import LeftPanel from './components/LeftPanel';

const SignUp = () => {
  const { classes } = useStyles();
  const {
    formik,
    isLoading,
    submitted,
    step,
    setStep,
    step2Touched,
    setStep2Touched,
    step2Submitted,
    setStep2Submitted,
    handleNext,
    initials,
    navigate,
    emailExists,
    phoneExists,
    checkEmail,
    checkPhone,
  } = useSignUp();

  const touched = formik.touched as Partial<Record<string, boolean>>;
  const errors = formik.errors as Partial<Record<string, string>>;

  const handleSelectChange = (field: string) => (e: SelectChangeEvent<string>) => {
    formik.setFieldValue(field, e.target.value);
  };

  return (
    <Box className={classes.pageWrapper}>
      <LeftPanel classes={classes} onNavigateSignIn={() => navigate(constants.Path.SIGNIN)} />

      <Box className={classes.rightPanel}>
        <Box className={classes.formContainer}>
          <Box className={classes.formHeader}>
            <Avatar className={classes.avatarPreview}>{initials}</Avatar>
            <Box>
              <Typography variant='h5' fontWeight={700} color='text.primary'>
                Create your account
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 0.25 }}>
                Step {step + 1} of {STEPS.length} — {STEPS[step].label}
              </Typography>
            </Box>
          </Box>

          <StepProgress step={step} classes={classes} />

          <form
            onSubmit={(e) => {
              if (step < STEPS.length - 1) {
                e.preventDefault();
                return;
              }
              setStep2Submitted(true);
              formik.handleSubmit(e);
            }}
            noValidate
          >
            {/* Step 1 — Personal */}
            {step === 0 && (
              <PersonalStep
                values={{
                  firstName: formik.values.firstName,
                  lastName: formik.values.lastName,
                  email: formik.values.email,
                  phone: formik.values.phone,
                  dateOfBirth: formik.values.dateOfBirth,
                  gender: formik.values.gender,
                  workLocation: formik.values.workLocation,
                  cityZone: formik.values.cityZone,
                  zipcode: formik.values.zipcode,
                }}
                touched={touched}
                errors={errors}
                onChange={formik.handleChange}
                onSelectChange={handleSelectChange}
                onDateChange={(field, value) => formik.setFieldValue(field, value)}
                onBlur={formik.handleBlur}
                classes={classes}
                emailExists={emailExists}
                phoneExists={phoneExists}
                onEmailChange={checkEmail}
                onPhoneChange={checkPhone}
                onLocationChange={(field, value) => formik.setFieldValue(field, value)}
              />
            )}

            {/* Step 2 — Work Details */}
            {step === 1 && (
              <WorkDetailsStep
                values={{
                  employeeId: formik.values.employeeId,
                  department: formik.values.department,
                  managerEmail: formik.values.managerEmail,
                  reasonForAccess: formik.values.reasonForAccess,
                  role: formik.values.role,
                }}
                touched={touched}
                errors={errors}
                onChange={formik.handleChange}
                onRoleChange={(e) => formik.setFieldValue('role', e.target.value)}
                onDepartmentChange={(e) => formik.setFieldValue('department', e.target.value)}
                onBlur={formik.handleBlur}
                classes={classes}
              />
            )}

            {/* Step 3 — Security */}
            {step === 2 && (
              <SecurityStep
                values={{
                  password: formik.values.password,
                  confirmPassword: formik.values.confirmPassword,
                  agreeToTerms: formik.values.agreeToTerms,
                }}
                errors={errors}
                step2Touched={step2Touched}
                step2Submitted={step2Submitted}
                onPasswordChange={formik.handleChange}
                onPasswordBlur={(e) => {
                  setStep2Touched((p) => ({ ...p, password: true }));
                  formik.handleBlur(e);
                }}
                onConfirmChange={formik.handleChange}
                onConfirmBlur={(e) => {
                  setStep2Touched((p) => ({ ...p, confirmPassword: true }));
                  formik.handleBlur(e);
                }}
                onTermsChange={(checked) => formik.setFieldValue('agreeToTerms', checked)}
                classes={classes}
              />
            )}

            <Box className={classes.navRow}>
              {step > 0 ? (
                <Button
                  type='button'
                  variant='outlined'
                  color='secondary'
                  label='Back'
                  onClick={() => setStep((s) => s - 1)}
                />
              ) : (
                <Button
                  type='button'
                  variant='outlined'
                  color='secondary'
                  label='Cancel'
                  onClick={() => {
                    sessionStorage.removeItem('signUpStep');
                    navigate(constants.Path.SIGNIN);
                  }}
                />
              )}
              {step < STEPS.length - 1 ? (
                <Button
                  type='button'
                  variant='contained'
                  color='primary'
                  label='Continue'
                  onClick={handleNext}
                />
              ) : (
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  loading={isLoading}
                  disabled={isLoading || submitted || !formik.values.agreeToTerms}
                  label='Submit'
                />
              )}
            </Box>
          </form>

          <Box className={classes.mobileSignin}>
            <Typography variant='body2' color='text.secondary'>
              Already have an account?{' '}
              <Typography
                component='span'
                variant='body2'
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate(constants.Path.SIGNIN)}
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
