import { Typography as MUITypography } from '@mui/material';
import { useStyles } from './styles';

export interface HeadingProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline';
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  color?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error'
    | 'text.disabled'
    | 'text.secondary'
    | (string & {});
  noWrap?: boolean;
  gutterBottom?: boolean;
  paragraph?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  sx?: Record<string, unknown>;
  fontWeight?: number | string;
  fontSize?: string | number;
  fontFamily?: string;
  component?: React.ElementType;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  mx?: number | string;
  my?: number | string;
  p?: number | string;
  px?: number | string;
  py?: number | string;
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
  textAlign?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
}

const Typography: React.FC<HeadingProps> = ({
  text,
  children,
  className,
  variant = 'body1',
  align = 'inherit',
  color = 'initial',
  noWrap = false,
  gutterBottom = false,
  paragraph = false,
  onClick,
  sx,
  fontWeight,
  fontSize,
  fontFamily,
  component,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  ...props
}) => {
  const { cx, classes } = useStyles();

  const combinedSx = {
    ...sx,
    fontWeight,
    ...(fontSize && { fontSize }),
    ...(fontFamily && { fontFamily }),
    ...(mt !== undefined && { mt }),
    ...(mb !== undefined && { mb }),
    ...(ml !== undefined && { ml }),
    ...(mr !== undefined && { mr }),
    ...(mx !== undefined && { mx }),
    ...(my !== undefined && { my }),
    ...(p !== undefined && { p }),
    ...(px !== undefined && { px }),
    ...(py !== undefined && { py }),
    ...(pt !== undefined && { pt }),
    ...(pb !== undefined && { pb }),
    ...(pl !== undefined && { pl }),
    ...(pr !== undefined && { pr }),
  };

  return (
    <MUITypography
      variant={variant}
      align={align}
      color={color as any}
      noWrap={noWrap}
      gutterBottom={gutterBottom}
      paragraph={paragraph}
      onClick={onClick}
      className={cx(classes.root, className)}
      sx={combinedSx}
      {...(component ? { component } : {})}
      {...props}
    >
      {text || children}
    </MUITypography>
  );
};

export default Typography;
