import type { ReactNode } from 'react';

export interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
  id?: string;
}

const TabPanel = ({ children, value, index, id }: TabPanelProps) => (
  <div
    role='tabpanel'
    hidden={value !== index}
    id={id || `tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
  >
    {value === index && <>{children}</>}
  </div>
);

export default TabPanel;
