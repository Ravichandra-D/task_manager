import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Button, Alert, Spinner } from '../components/UI';

const STAGES = [
  { key: 'todo', label: 'Todo', icon: '📋', color: 'var(--todo)', bg: 'var(--todo-bg)', border: 'var(--todo-border)' },
  { key: 'in_progress', label: 'In Progress', icon: '🔄', color: 'var(--progress)', bg: 'var(--progress-bg)', border: 'var(--progress-border)' },
  { key: 'done', label: 'Done', icon: '✅', color: 'var(--done)', bg: 'var(--done-bg)', border: 'var(--done-border)' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (taskData) => {
    const task = await createTask(taskData);
    setTasks(prev => [task, ...prev]);
  };

  const handleEdit = async (taskData) => {
    const updated = await updateTask(editingTask.id, taskData);
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleStageChange = async (id, stage) => {
    const updated = await updateTask(id, { stage });
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tasksByStage = (stage) => tasks.filter(t => t.stage === stage);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
            TaskFlow
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Hey, <strong style={{ color: 'var(--text)' }}>{user?.name}</strong>
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Page title + create button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 4 }}>My Tasks</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={() => { setEditingTask(null); setFormOpen(true); }} size="md">
            + New Task
          </Button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 36,
        }}>
          {STAGES.map(s => (
            <div key={s.key} style={{
              background: 'var(--surface)', border: `1px solid ${s.border}`,
              borderRadius: 'var(--radius)', padding: '16px 20px',
            }}>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: s.color }}>
                {tasksByStage(s.key).length}
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 24 }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spinner size={32} />
          </div>
        ) : (
          /* Kanban columns */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, alignItems: 'start'
          }}>
            {STAGES.map(stage => (
              <div key={stage.key}>
                {/* Column header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 16, padding: '10px 16px',
                  background: stage.bg, border: `1px solid ${stage.border}`,
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: stage.color }}>
                    {stage.icon} {stage.label}
                  </span>
                  <span style={{
                    background: stage.border, color: stage.color,
                    borderRadius: 100, padding: '2px 9px', fontSize: 12, fontWeight: 600
                  }}>
                    {tasksByStage(stage.key).length}
                  </span>
                </div>

                {/* Tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {tasksByStage(stage.key).length === 0 ? (
                    <div style={{
                      border: `2px dashed var(--border)`, borderRadius: 'var(--radius)',
                      padding: '32px 20px', textAlign: 'center',
                      color: 'var(--text-faint)', fontSize: 13
                    }}>
                      No tasks here yet
                    </div>
                  ) : (
                    tasksByStage(stage.key).map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => { setEditingTask(t); setFormOpen(true); }}
                        onDelete={handleDelete}
                        onStageChange={handleStageChange}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task form modal */}
      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        initialTask={editingTask}
      />
    </div>
  );
}
