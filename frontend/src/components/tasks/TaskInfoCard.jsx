import React from 'react';
import { Card } from '../ui';
import TaskMetaGrid from './TaskMetaGrid';
import { formatRelativeDate } from '../../utils/date';

export const TaskInfoCard = ({ task }) => {
  return (
    <Card title="Task Metadata" padding="md" className="space-y-4">
      <TaskMetaGrid task={task} />

      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-500 font-medium">
        <div className="flex justify-between">
          <span>Created</span>
          <span>{task?.createdAt ? formatRelativeDate(task.createdAt) : ''}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Updated</span>
          <span>{task?.updatedAt ? formatRelativeDate(task.updatedAt) : ''}</span>
        </div>
      </div>
    </Card>
  );
};

export default TaskInfoCard;
