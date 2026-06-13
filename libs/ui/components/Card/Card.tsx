import { Card as MUICard, CardHeader, CardContent, CardActions, Divider } from '@mui/material';
import { Typography, Box } from '@mui/material';
import type { SvgIconComponent } from '@mui/icons-material';
import { useStyles } from './styles';

export interface DSCardProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  sx?: any;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  raised?: boolean;
  variant?: 'elevation' | 'outlined';
  elevation?: number;
  /** Card variant: 'default' | 'status-card' | 'filter-card' | 'kpi-card' | 'getstatus' */
  cardVariant?: 'default' | 'status-card' | 'filter-card' | 'kpi-card' | 'getstatus';
  /** getstatus card props */
  value?: string | number;
  label?: string;
  sub?: string;
  icon?: SvgIconComponent;
  color?: string;
  colorIndex?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const Card: React.FC<DSCardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  className,
  sx,
  onClick,
  raised = false,
  variant = 'elevation',
  elevation = 1,
  cardVariant = 'default',
  value,
  label,
  sub,
  icon: Icon,
  color = '#6366f1',
  colorIndex = 0,
  trend,
  trendValue,
  ...rest
}) => {
  const { cx, classes } = useStyles();

  const getColorClass = () => {
    const index = colorIndex >= 0 && colorIndex <= 7 ? colorIndex : 0;
    return classes[`getstatus-card-${index}`] || classes['getstatus-card-0'];
  };

  const renderGetstatusCard = () => (
    <Box className={classes['getstatus-card-inner']}>
      <Box className={classes['getstatus-card-top']}>
        <Box className={classes['getstatus-card-content']}>
          {value !== undefined && (
            <Typography className={classes['getstatus-card-value']} sx={{ color }}>
              {value}
            </Typography>
          )}
          {label && (
            <Typography className={classes['getstatus-card-label']}>{label}</Typography>
          )}
        </Box>
        {Icon && (
          <Box
            className={classes['getstatus-card-icon-wrap']}
            sx={{
              background: `${color}15`,
              border: `2px solid ${color}25`,
              '&:hover': {
                background: `${color}25`,
                '&::after': { background: `${color}10` },
              },
              '&::after': { background: `${color}15` },
            }}
          >
            <Icon className={classes['getstatus-card-icon']} sx={{ color }} />
          </Box>
        )}
      </Box>

      {(sub || trend) && (
        <>
          <Divider className={classes['getstatus-card-divider']} sx={{ borderColor: `${color}20` }} />
          <Box className={classes['getstatus-card-footer']}>
            <Box
              className={classes['getstatus-card-sub-dot']}
              sx={{
                background: color,
                boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`,
              }}
            />
            <Typography className={classes['getstatus-card-sub']}>
              {sub}
              {trendValue && (
                <Box component='span' sx={{ ml: 1, color, fontWeight: 700 }}>
                  {trendValue}
                </Box>
              )}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );

  if (cardVariant === 'getstatus') {
    return (
      <MUICard
        className={cx(classes.root, classes['getstatus-card'], getColorClass(), className)}
        sx={{ display: 'flex', flexDirection: 'column', ...sx }}
        onClick={onClick}
        raised={raised}
        elevation={elevation}
        {...rest}
      >
        {renderGetstatusCard()}
      </MUICard>
    );
  }

  return (
    <MUICard
      className={cx(classes.root, classes[cardVariant], className)}
      sx={sx}
      onClick={onClick}
      raised={raised}
      variant={variant}
      elevation={elevation}
      {...rest}
    >
      {(title || subtitle || headerAction) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={headerAction}
          className={classes.header}
        />
      )}

      <CardContent className={classes.content}>{children}</CardContent>

      {footer && <CardActions className={classes.footer}>{footer}</CardActions>}
    </MUICard>
  );
};

export default Card;