import React from 'react';
import { Modal } from '../ui';
import TaskForm from './TaskForm';
import useUpdateTask from '../../hooks/useUpdateTask';

export const EditTaskModal = ({ open, onClose, task }) => {
  const { mutateAsync: updateTask, isPending } = useUpdateTask();

  const handleSubmit = async (data) => {
    if (!task?.id) return;
    await updateTask({ id: task.id, data });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Task"
      size="lg"
      closeOnOverlayClick={!isPending}
    >
      {task && (
        <TaskForm
          mode="edit"
          initialData={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={isPending}
        />
      )}
    </Modal>
  );
};

export default EditTaskModal;
