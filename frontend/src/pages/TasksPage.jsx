import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader, EmptyState, Button, Pagination } from '../components/ui';
import { Plus, RefreshCw, LayoutGrid, CheckSquare } from 'lucide-react';
import { taskService } from '../services/task.service';
import useAuth from '../hooks/useAuth';
import TaskToolbar from '../components/tasks/TaskToolbar';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskTable from '../components/tasks/TaskTable';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';

export const TasksPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Tab State
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'created', 'all'

  // Local filter states
  const [searchVal, setSearchVal] = useState('');
  const [statusVal, setStatusVal] = useState('');
  const [priorityVal, setPriorityVal] = useState('');
  const [assigneeVal, setAssigneeVal] = useState('');
  const [creatorVal, setCreatorVal] = useState('');
  const [sortVal, setSortVal] = useState('createdAt');
  const [orderVal, setOrderVal] = useState('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  // Modal open control states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Query all tasks to perform client-side filtering and pagination
  const { data: tasksResponse, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['tasks-list', 'full'],
    queryFn: async () => {
      const res = await taskService.getAllTasks({ limit: 100 });
      return res; // returns pagination response payload
    }
  });

  const rawTasks = tasksResponse?.data || [];

  // Reset page to 1 when filters or tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchVal, statusVal, priorityVal, assigneeVal, creatorVal, sortVal, orderVal, activeTab]);

  // Set default active tab for Admins
  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      setActiveTab('created');
    }
  }, [currentUser]);

  // Tab split filters
  const assignedTasks = rawTasks.filter((t) => t.assignedToId === currentUser?.id);
  const createdTasks = rawTasks.filter((t) => t.createdById === currentUser?.id);

  // Get tasks list corresponding to the active tab
  const getTabBaseTasks = () => {
    switch (activeTab) {
      case 'assigned':
        return assignedTasks;
      case 'created':
        return createdTasks;
      case 'all':
      default:
        return rawTasks;
    }
  };

  // Filter tasks based on toolbar controls
  const filteredTasks = getTabBaseTasks()
    .filter((t) => {
      if (!searchVal.trim()) return true;
      const term = searchVal.toLowerCase();
      return (
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    })
    .filter((t) => {
      if (!statusVal) return true;
      return t.status === statusVal;
    })
    .filter((t) => {
      if (!priorityVal) return true;
      return t.priority === priorityVal;
    })
    .filter((t) => {
      if (!assigneeVal) return true;
      return t.assignedToId === assigneeVal;
    })
    .filter((t) => {
      if (!creatorVal) return true;
      return t.createdById === creatorVal;
    });

  // Sort tasks locally before pagination
  filteredTasks.sort((a, b) => {
    let fieldA = a[sortVal];
    let fieldB = b[sortVal];

    if (sortVal === 'title') {
      fieldA = (a.title || '').toLowerCase();
      fieldB = (b.title || '').toLowerCase();
    } else if (sortVal === 'dueDate' || sortVal === 'createdAt' || sortVal === 'updatedAt') {
      fieldA = a[sortVal] ? new Date(a[sortVal]).getTime() : 0;
      fieldB = b[sortVal] ? new Date(b[sortVal]).getTime() : 0;
    }

    if (fieldA < fieldB) return orderVal === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return orderVal === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate local pagination slice
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleResetFilters = () => {
    setSearchVal('');
    setStatusVal('');
    setPriorityVal('');
    setAssigneeVal('');
    setCreatorVal('');
    setSortVal('createdAt');
    setOrderVal('desc');
  };

  if (error) {
    return (
      <div className="py-12">
        <EmptyState
          iconName="AlertCircle"
          title="Failed to load tasks"
          description={error.message || 'An error occurred while fetching tasks from the backend.'}
          actionLabel="Retry Connection"
          onActionClick={handleRefresh}
        />
      </div>
    );
  }

  // Active styles for tab button
  const tabClass = (tabId) => `
    relative py-2.5 px-4 text-xs font-bold transition-all border-b-2 outline-none whitespace-nowrap
    ${activeTab === tabId
      ? 'border-blue-500 text-blue-400 font-extrabold'
      : 'border-transparent text-slate-400 hover:text-slate-200'
    }
  `;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Tasks Board"
        description="Manage, search, filter, and track team tasks"
        breadcrumbs={['Workspace', 'Tasks List']}
      />

      {/* Segmented Tab Headers */}
      <div className="flex border-b border-slate-800/80 overflow-x-auto scrollbar-none">
        {currentUser?.role !== 'ADMIN' && (
          <button onClick={() => setActiveTab('assigned')} className={tabClass('assigned')}>
            Assigned to Me
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/10 font-bold">
              {assignedTasks.length}
            </span>
          </button>
        )}
        {currentUser?.role !== 'MEMBER' && (
          <button onClick={() => setActiveTab('created')} className={tabClass('created')}>
            Assigned by Me (Created)
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/10 font-bold">
              {createdTasks.length}
            </span>
          </button>
        )}
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER') && (
          <button onClick={() => setActiveTab('all')} className={tabClass('all')}>
            All Workspace Tasks
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-400 border border-slate-700/80 font-bold">
              {rawTasks.length}
            </span>
          </button>
        )}
      </div>

      {/* Task Toolbar */}
      <TaskToolbar
        searchValue={searchVal}
        onSearchChange={setSearchVal}
        onRefresh={handleRefresh}
        isRefreshing={isLoading || isFetching}
        onCreateClick={() => setIsCreateOpen(true)}
        showCreate={currentUser?.role !== 'MEMBER'}
      />

      {/* Advanced filtering panel */}
      <TaskFilters
        filters={{ status: statusVal, priority: priorityVal, assignee: assigneeVal, creator: creatorVal, sort: sortVal, order: orderVal }}
        onFilterChange={({ status, priority, assignee, creator, sort, order }) => {
          if (status !== undefined) setStatusVal(status);
          if (priority !== undefined) setPriorityVal(priority);
          if (assignee !== undefined) setAssigneeVal(assignee);
          if (creator !== undefined) setCreatorVal(creator);
          if (sort !== undefined) setSortVal(sort);
          if (order !== undefined) setOrderVal(order);
        }}
        onReset={handleResetFilters}
        showAssigneeFilter={currentUser?.role !== 'MEMBER'}
      />

      {/* List content table */}
      <div className="relative">
        <TaskTable
          tasks={paginatedTasks}
          loading={isLoading}
          onResetFilters={handleResetFilters}
          onEditTask={(task) => setEditingTask(task)}
          canEdit={currentUser?.role !== 'MEMBER'}
        />
      </div>

      {/* Bottom Pagination controls */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          disabled={isLoading}
        />
      )}

      {/* Modal Overlays */}
      <CreateTaskModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </div>
  );
};

export default TasksPage;
