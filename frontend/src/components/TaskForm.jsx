import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Select, Button, Alert } from './UI';

const STAGE_OPTIONS = [
  { value: 'todo', label: '📋 Todo' },
  { value: 'in_progress', label: '🔄 In Progress' },
  { value: 'done', label: '✅ Done' },
];

export default function TaskForm({ open, onClose, onSubmit, initialTask = null }) {
  const isEdit = !!initialTask;
  const [form, setForm] = useState({ title: '', description: '', stage: 'todo' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialTask
        ? { title: initialTask.title, description: initialTask.description || '', stage: initialTask.stage }
        : { title: '', description: '', stage: 'todo' }
      );
      setErrors({});
      setApiError('');
    }
  }, [open, initialTask]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length > 100) e.title = 'Title must be 100 characters or fewer';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      await onSubmit({ title: form.title.trim(), description: form.description.trim(), stage: form.stage });
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {apiError && <Alert type="error">{apiError}</Alert>}
        <Input
          id="task-title" label="Title *" placeholder="What needs to be done?"
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          error={errors.title} maxLength={100} autoFocus
        />
        <Textarea
          id="task-desc" label="Description (optional)" placeholder="Add more details..."
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <Select
          id="task-stage" label="Stage"
          value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
        >
          {STAGE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
