import {
  ListItemText as MUIListItemText,
  ListItemTextProps as MUIListItemTextProps,
} from '@mui/material';
import { useStyles } from './styles';

export interface DSListItemTextProps extends MUIListItemTextProps {
  className?: string;
}

const ListItemText: React.FC<DSListItemTextProps> = ({ className, ...props }) => {
  const { classes } = useStyles();
  return (
    <MUIListItemText className={`${classes.root}${className ? ` ${className}` : ''}`} {...props} />
  );
};

export default ListItemText;
