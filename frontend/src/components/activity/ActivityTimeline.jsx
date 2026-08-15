import React from 'react';
import { Card, EmptyState } from '../ui';
import ActivityItem from './ActivityItem';

export const ActivityTimeline = ({ activities = [] }) => {
  return (
    <Card title="Activity Log" padding="md" className="h-full">
      {activities.length === 0 ? (
        <EmptyState
          iconName="Activity"
          title="No activity recorded"
          description="There is no history captured for this task."
        />
      ) : (
        <div className="relative space-y-0.5">
          {activities.map((log) => (
            <ActivityItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default ActivityTimeline;
