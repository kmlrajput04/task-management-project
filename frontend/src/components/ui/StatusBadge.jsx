import React from 'react';
import Badge from './Badge';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { variant: 'default', label: 'Pending' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    BLOCKED: { variant: 'danger', label: 'Blocked' }
  };

  const config = statusConfig[status] || { variant: 'secondary', label: status };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
