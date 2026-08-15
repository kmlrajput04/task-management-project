import React from 'react';
import { Card, EmptyState } from '../ui';

export const TaskDescriptionCard = ({ description }) => {
  return (
    <Card title="Description" padding="md" className="min-h-[160px]">
      {description ? (
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      ) : (
        <EmptyState
          iconName="FileText"
          title="No description provided"
          description="This task does not contain any details description yet."
        />
      )}
    </Card>
  );
};

export default TaskDescriptionCard;
