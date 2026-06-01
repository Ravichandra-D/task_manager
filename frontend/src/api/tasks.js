import api from './client';

export const getTasks = async () => {
  const res = await api.get('/tasks');
  return res.data.tasks;
};

export const createTask = async (task) => {
  const res = await api.post('/tasks', task);
  return res.data.task;
};

export const updateTask = async (id, updates) => {
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data.task;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
