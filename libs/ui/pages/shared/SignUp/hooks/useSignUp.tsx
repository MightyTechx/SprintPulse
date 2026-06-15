import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormWithSessionStorage, useNotification } from '@sprintpulse/hooks';
import { SignUpSchema } from '@sprintpulse/interfaces';
import { constants } from '@sprintpulse/utils';
import { useAuthActionMutation } from '@sprintpulse/services';

export const STEPS = [
  {
    label: 'Personal',
    fields: [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'gender',
      'cityZone',
      'zipcode',
      'workLocation',
    ],
  },
  {
    label: 'Work Details',
    fields: ['employeeId', 'department', 'managerEmail', 'reasonForAccess', 'role'],
  },
  { label: 'Security', fields: ['password', 'confirmPassword', 'agreeToTerms'] },
];

const useSignUp = () => {
  const navigate = useNavigate();
  const [authAction, { isLoading }] = useAuthActionMutation();
  const notify = useNotification();
  const [submitted, setSubmitted] = useState(false);
  const [step2Touched, setStep2Touched] = useState({ password: false, confirmPassword: false });
  const [step2Submitted, setStep2Submitted] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const emailDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('signUpStep');
      return saved !== null ? Math.min(parseInt(saved, 10), STEPS.length - 1) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('signUpStep', String(step));
    } catch {
      /* ignore */
    }
  }, [step]);

  const checkEmail = (email: string) => {
    if (emailDebounce.current) clearTimeout(emailDebounce.current);
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailExists(false);
      return;
    }
    emailDebounce.current = setTimeout(async () => {
      try {
        const res = await authAction({ action: 'check-availability', email }).unwrap();
        setEmailExists(res.data?.emailExists ?? false);
      } catch {
        setEmailExists(false);
      }
    }, 600);
  };

  const checkPhone = (phone: string) => {
    if (phoneDebounce.current) clearTimeout(phoneDebounce.current);
    if (!phone || phone.length < 7) {
      setPhoneExists(false);
      return;
    }
    phoneDebounce.current = setTimeout(async () => {
      try {
        const res = await authAction({ action: 'check-availability', phone }).unwrap();
        setPhoneExists(res.data?.phoneExists ?? false);
      } catch {
        setPhoneExists(false);
      }
    }, 600);
  };

  const formik = useFormWithSessionStorage('signUp', {
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      cityZone: '',
      zipcode: '',
      workLocation: '',
      employeeId: '',
      department: '',
      managerEmail: '',
      reasonForAccess: '',
      password: '',
      confirmPassword: '',
      role: 'consultant',
      agreeToTerms: false,
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      try {
        const result = await authAction({ action: 'signup', ...values }).unwrap();
        const redirectDelay = 2000;
        notify.success(result.message, redirectDelay);
        setSubmitted(true);
        sessionStorage.removeItem('signUpStep');
        setTimeout(() => navigate(constants.Path.SIGNIN, { replace: true }), redirectDelay);
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        notify.error(error?.data?.message || error?.message || 'Sign up failed');
      }
    },
  });

  const handleNext = async () => {
    const { fields } = STEPS[step];
    const nextStep = step + 1;
    const touches = fields.reduce<Record<string, boolean>>((acc, f) => ({ ...acc, [f]: true }), {});
    formik.setTouched({ ...formik.touched, ...touches }, false);
    const errors = await formik.validateForm();
    const hasError = fields.some((f) => (errors as Record<string, unknown>)[f]);
    if (!hasError && !emailExists && !phoneExists) {
      setStep2Touched({ password: false, confirmPassword: false });
      setStep2Submitted(false);
      setStep(() => nextStep);
    }
  };

  const initials =
    [formik.values.firstName?.[0], formik.values.lastName?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase() || '?';

  return {
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
  };
};

export default useSignUp;
