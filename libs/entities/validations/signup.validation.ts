import * as yup from 'yup';

export const SignUpSchema = yup.object({
  firstName: yup.string().required('required').min(2, 'First name must be at least 2 characters'),
  lastName: yup.string().required('required').min(2, 'Last name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('required'),
  phone: yup
    .string()
    .matches(/^[\d\s+\-()]*$/, 'Phone number must contain only numbers')
    .optional()
    .nullable(),
  dateOfBirth: yup.string().optional().nullable(),
  gender: yup.string().optional().nullable(),
  cityZone: yup.string().optional().nullable(),
  zipcode: yup.string().optional().nullable(),
  workLocation: yup.string().optional().nullable(),
  employeeId: yup.string().matches(/^\d*$/, 'Employee ID must be numeric').optional().nullable(),
  department: yup.string().optional().nullable(),
  managerName: yup.string().optional().nullable(),
  managerEmail: yup.string().email('Invalid manager email').optional().nullable(),
  reasonForAccess: yup.string().required('required'),
  businessUnit: yup.string().optional().nullable(),
  password: yup.string().required('required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('required')
    .oneOf(['user', 'consultant', 'admin'], 'Role must be user, consultant, or admin'),
  agreeToTerms: yup
    .boolean()
    .required('You must agree to terms')
    .oneOf([true], 'You must agree to terms'),
  // Auto-detected locale fields — optional, sent silently from the browser
  timezone: yup.string().optional().nullable(),
  language: yup.string().optional().nullable(),
  dateFormat: yup.string().optional().nullable(),
  timeFormat: yup.string().optional().nullable(),
  slaWorkingCalendar: yup.string().optional().nullable(),
  slaExceptionGroup: yup.string().optional().nullable(),
});

export type SignUpDto = yup.InferType<typeof SignUpSchema>;
