import React from 'react';
import { Modal } from '../ui';
import TaskForm from './TaskForm';
import useCreateTask from '../../hooks/useCreateTask';

export const CreateTaskModal = ({ open, onClose }) => {
  const { mutateAsync: createTask, isPending } = useCreateTask();

  const handleSubmit = async (data) => {
    await createTask(data);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Task"
      size="lg"
      closeOnOverlayClick={!isPending}
    >
      <TaskForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={isPending}
      />
    </Modal>
  );
};

export default CreateTaskModal;
