import React from 'react';
import { PageHeader, EmptyState, Button } from '../components/ui';
import { Plus } from 'lucide-react';
import useDashboard from '../hooks/useDashboard';
import StatsGrid from '../components/dashboard/StatsGrid';
import StatusOverview from '../components/dashboard/StatusOverview';
import PriorityOverview from '../components/dashboard/PriorityOverview';
import RecentTasksTable from '../components/dashboard/RecentTasksTable';
import UpcomingTasksCard from '../components/dashboard/UpcomingTasksCard';
import MyTasksCard from '../components/dashboard/MyTasksCard';

import useAuth from '../hooks/useAuth';

export const DashboardPage = () => {
  const { data, isLoading, error, refetch } = useDashboard();
  const { user: currentUser } = useAuth();

  if (error) {
    return (
      <div className="py-12">
        <EmptyState
          iconName="AlertCircle"
          title="Failed to load dashboard"
          description={error.message || 'An error occurred while loading dashboard statistics.'}
          actionLabel="Retry Connection"
          onActionClick={() => refetch()}
        />
      </div>
    );
  }

  const summary = data?.summary || {};
  const statusDistribution = data?.statusDistribution || [];
  const priorityDistribution = data?.priorityDistribution || [];
  const recentTasks = data?.recentTasks || [];
  const upcomingTasks = data?.upcomingTasks || [];
  const myTasks = data?.myTasks || [];

  // Check if there is absolutely no data in the database
  const isEmpty = !isLoading && summary.totalTasks === 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Overview of tasks, team progress, and upcoming work"
        breadcrumbs={['Workspace', 'Analytics']}
      />

      {isEmpty ? (
        <div className="py-12">
          <EmptyState
            iconName="ClipboardList"
            title="No task data available"
            description="Create your first task to get started on project progress tracking."
            actionLabel="Create Task"
            onActionClick={() => alert('Task creation modal coming in Phase 12')}
          />
        </div>
      ) : (
        <>
          {/* Top Statistics Grid */}
          <StatsGrid summary={summary} loading={isLoading} role={currentUser?.role} />

          {/* Core distribution maps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatusOverview
              distribution={statusDistribution}
              totalTasks={summary.totalTasks}
              loading={isLoading}
            />
            <PriorityOverview
              distribution={priorityDistribution}
              totalTasks={summary.totalTasks}
              loading={isLoading}
            />
          </div>

          {/* Recent tasks listings */}
          <RecentTasksTable tasks={recentTasks} loading={isLoading} />

          {/* Deadlines and assigned tasks grid */}
          <div className={`grid gap-6 ${currentUser?.role === 'ADMIN' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <UpcomingTasksCard tasks={upcomingTasks} loading={isLoading} />
            {currentUser?.role !== 'ADMIN' && (
              <MyTasksCard tasks={myTasks} loading={isLoading} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
