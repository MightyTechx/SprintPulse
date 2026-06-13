import * as Yup from 'yup';
import { useNotification } from '@infygen/hooks';
import { useAuthActionMutation } from '@infygen/services';
import { useFormik } from 'formik';

export const CITY_OPTIONS = [
  'Ahmedabad',
  'Bengaluru',
  'Bhopal',
  'Chennai',
  'Coimbatore',
  'Delhi',
  'Hyderabad',
  'Indore',
  'Jaipur',
  'Kolkata',
  'Lucknow',
  'Mumbai',
  'Nagpur',
  'Patna',
  'Pune',
  'Surat',
  'Thane',
  'Vadodara',
  'Visakhapatnam',
  'Other',
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Non-binary / Other' },
  { value: 'prefer_not', label: 'Prefer not to say' },
];

export const DEPARTMENTS = [
  'IT Administration',
  'Maintenance',
  'Human Resources',
  'Operations',
  'Service',
  'External Consulting',
  'Other',
];

export const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'admin', label: 'Admin' },
];

const SignUpSchema = Yup.object({
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
  city: Yup.string(),
  employeeId: Yup.string(),
  department: Yup.string(),
  workLocation: Yup.string(),
  businessUnit: Yup.string(),
  managerName: Yup.string(),
  role: Yup.string().required('Role is required'),
});

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  employeeId: '',
  department: '',
  workLocation: '',
  businessUnit: '',
  managerName: '',
  role: 'user',
  password: '',
  confirmPassword: '',
};

interface UseCreateUserOptions {
  onSuccess?: () => void;
  onClose?: () => void;
}

const useCreateUser = (options: UseCreateUserOptions = {}) => {
  const { onSuccess, onClose } = options;
  const notify = useNotification();
  const [authAction, { isLoading }] = useAuthActionMutation();

  const formik = useFormik({
    initialValues,
    validationSchema: SignUpSchema,
    onSubmit: async (values: typeof initialValues) => {
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
          city: values.city || null,
        }).unwrap();

        notify.success('User created successfully');
        formik.resetForm();
        onSuccess?.();
        onClose?.();
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        notify.error(error?.data?.message || error?.message || 'Failed to create user');
      }
    },
  });

  return {
    formik,
    isLoading,
    CITY_OPTIONS,
    GENDER_OPTIONS,
    DEPARTMENTS,
    ROLES,
  };
};

export default useCreateUser;
