import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useFormWithSessionStorage, useNotification, useFieldError } from '@sprintpulse/hooks';
import { SignInSchema, UserRole } from '@sprintpulse/interfaces';
import { constants } from '@sprintpulse/utils';

const useSignIn = () => {
  const reqError = useFieldError();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const notify = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormWithSessionStorage('signIn', {
    initialValues: { email: '', password: '' },
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values.email, values.password);
        if (result.data.adminRequestPending) {
          notify.warning(result.message);
        }
        const { role } = result.data.user;
        let destination = constants.UserPath.DASHBOARD;
        if (role === UserRole.ADMIN) {
          destination = constants.AdminPath.DASHBOARD;
        } else if (role === UserRole.CONSULTANT) {
          destination = constants.ConsultantPath.PEOPLE_ACCESS;
        }
        navigate(destination, { replace: true });
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string };
        const message = error?.data?.message || error?.message || 'Invalid email or password';
        if (message.toLowerCase().includes('pending admin approval')) {
          notify.warning(message);
        } else {
          notify.error(message);
        }
      }
    },
  });

  return { formik, isLoading, showPassword, setShowPassword, reqError, navigate };
};

export default useSignIn;
