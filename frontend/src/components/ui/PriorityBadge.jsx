import React from 'react';
import Badge from './Badge';

export const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    LOW: { variant: 'default', label: 'Low' },
    MEDIUM: { variant: 'info', label: 'Medium' },
    HIGH: { variant: 'warning', label: 'High' },
    URGENT: { variant: 'danger', label: 'Urgent' }
  };

  const config = priorityConfig[priority] || { variant: 'secondary', label: priority };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
