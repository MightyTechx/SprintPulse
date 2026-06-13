import {
  FormControl,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useStyles } from './styles';

export interface DSSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DSSelectProps {
  options?: DSSelectOption[];
  label?: string;
  labelId?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  value?: string | number | (string | number)[];
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  onFocus?: (event: any) => void;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  children?: React.ReactNode;
  id?: string;
  name?: string;
  sx?: Record<string, unknown>;
  renderValue?: (value: unknown) => React.ReactNode;
  input?: React.ReactElement;
  MenuProps?: Record<string, unknown>;
}

const Select: React.FC<DSSelectProps> = ({
  options,
  label,
  labelId,
  variant = 'outlined',
  helperText,
  errorText,
  error,
  fullWidth = true,
  className,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  required,
  multiple,
  placeholder,
  size = 'medium',
  children,
  id,
  name,
  sx,
  renderValue,
  input,
  MenuProps,
  ...rest
}) => {
  const { cx, classes } = useStyles();

  return (
    <FormControl
      variant={variant}
      fullWidth={fullWidth}
      error={error || Boolean(errorText)}
      required={required}
      className={cx(classes.root, className)}
      sx={sx as any}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MUISelect
        label={label}
        labelId={labelId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        multiple={multiple}
        displayEmpty={Boolean(placeholder)}
        size={size}
        id={id}
        name={name}
        renderValue={renderValue}
        input={input}
        MenuProps={MenuProps as any}
        {...rest}
      >
        {children}
        {!children && placeholder && (
          <MenuItem value='' disabled>
            {placeholder}
          </MenuItem>
        )}
        {!children &&
          options?.map((option) => (
            <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </MenuItem>
          ))}
      </MUISelect>
      {(helperText || errorText) && <FormHelperText>{errorText || helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
