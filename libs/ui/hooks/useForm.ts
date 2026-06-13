import { FormikConfig, FormikValues, useFormik } from 'formik';

export function useForm<T extends FormikValues = FormikValues>(config: FormikConfig<T>) {
  return useFormik<T>(config);
}
