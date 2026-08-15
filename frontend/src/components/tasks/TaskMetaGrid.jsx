import React from 'react';
import TaskAssigneeCard from './TaskAssigneeCard';
import TaskStatusCard from './TaskStatusCard';
import TaskPriorityCard from './TaskPriorityCard';
import TaskDueDateCard from './TaskDueDateCard';
import TaskClientCard from './TaskClientCard';

export const TaskMetaGrid = ({ task }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TaskAssigneeCard assignee={task?.assignee} />
      <TaskStatusCard status={task?.status} />
      <TaskPriorityCard priority={task?.priority} />
      <TaskDueDateCard dueDate={task?.dueDate} status={task?.status} />
      <div className="sm:col-span-2">
        <TaskClientCard client={task?.externalClient} />
      </div>
    </div>
  );
};

export default TaskMetaGrid;
