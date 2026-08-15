import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLoader, EmptyState, Skeleton, Card } from '../components/ui';
import useTask from '../hooks/useTask';
import useTaskActivity from '../hooks/useTaskActivity';
import TaskDetailsHeader from '../components/tasks/TaskDetailsHeader';
import TaskDescriptionCard from '../components/tasks/TaskDescriptionCard';
import TaskInfoCard from '../components/tasks/TaskInfoCard';
import CommentsSection from '../components/comments/CommentsSection';
import ActivityTimeline from '../components/activity/ActivityTimeline';

export const TaskDetailsPage = () => {
  const { id } = useParams();
  const { data: task, isLoading, error, refetch } = useTask(id);
  const { data: activities, isLoading: isLoadingActivity } = useTaskActivity(id);

  if (isLoading || isLoadingActivity) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="pb-6 border-b border-slate-800/80 mb-6 space-y-3">
          <Skeleton variant="text" className="w-24 h-3.5" />
          <Skeleton variant="text" className="w-72 h-7" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeletons */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="card" className="h-44" />
            <Skeleton variant="card" className="h-72" />
          </div>

          {/* Right Column Skeletons */}
          <div className="space-y-6">
            <Skeleton variant="card" className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="py-12">
        <EmptyState
          iconName="AlertCircle"
          title="Task not found"
          description={error?.message || `We couldn't retrieve the task details for ID ${id}.`}
          actionLabel="Retry Connection"
          onActionClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Task Header Controls */}
      <TaskDetailsHeader task={task} />

      {/* Main split viewport layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left main columns: details, comments */}
        <div className="lg:col-span-2 space-y-6">
          <TaskDescriptionCard description={task.description} />
          <CommentsSection taskId={task.id} />
        </div>

        {/* Right sidebar column: metadata, audit timeline logs */}
        <div className="space-y-6">
          <TaskInfoCard task={task} />
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
