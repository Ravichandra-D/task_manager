const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { tasks } = require('../data/store');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const VALID_STAGES = ['todo', 'in_progress', 'done'];

// All task routes require auth
router.use(authMiddleware);

// GET /api/tasks — get all tasks for logged-in user
router.get('/', (req, res) => {
  const userTasks = tasks
    .filter(t => t.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ tasks: userTasks });
});

// POST /api/tasks — create a new task
router.post('/', (req, res) => {
  const { title, description = '', stage = 'todo' } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Task title is required.' });
  }
  if (title.trim().length > 100) {
    return res.status(400).json({ error: 'Title must be 100 characters or fewer.' });
  }
  if (!VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: `Stage must be one of: ${VALID_STAGES.join(', ')}` });
  }

  const task = {
    id: uuidv4(),
    userId: req.user.id,
    title: title.trim(),
    description: description.trim(),
    stage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(task);

  res.status(201).json({ message: 'Task created.', task });
});

// GET /api/tasks/:id — get single task
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id && t.userId === req.user.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  res.json({ task });
});

// PUT /api/tasks/:id — update task
router.put('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const { title, description, stage } = req.body;
  const task = tasks[taskIndex];

  if (title !== undefined) {
    if (title.trim().length === 0) return res.status(400).json({ error: 'Title cannot be empty.' });
    if (title.trim().length > 100) return res.status(400).json({ error: 'Title must be 100 characters or fewer.' });
    task.title = title.trim();
  }
  if (description !== undefined) {
    task.description = description.trim();
  }
  if (stage !== undefined) {
    if (!VALID_STAGES.includes(stage)) {
      return res.status(400).json({ error: `Stage must be one of: ${VALID_STAGES.join(', ')}` });
    }
    task.stage = stage;
  }
  task.updatedAt = new Date().toISOString();

  res.json({ message: 'Task updated.', task });
});

// DELETE /api/tasks/:id — delete task
router.delete('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted.' });
});

module.exports = router;
