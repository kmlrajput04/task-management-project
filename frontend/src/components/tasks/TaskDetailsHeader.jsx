import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button, ConfirmDialog } from '../ui';
import EditTaskModal from './EditTaskModal';
import useDeleteTask from '../../hooks/useDeleteTask';

export const TaskDetailsHeader = ({ task }) => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

  const handleDelete = async () => {
    if (!task?.id) return;
    await deleteTask(task.id);
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800/80 mb-6 gap-4 animate-fade-in">
      <div className="space-y-1.5">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-medium mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tasks</span>
        </button>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight">
            {task?.title || 'Loading task...'}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            #{task?.id?.substring(0, 8)}
          </span>
        </div>
      </div>

      {task && (
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Edit2}
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={Trash2}
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      )}

      {/* Overlays */}
      {task && (
        <EditTaskModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          task={task}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        confirmLabel="Delete Task"
        loading={isDeleting}
      />
    </div>
  );
};

export default TaskDetailsHeader;
