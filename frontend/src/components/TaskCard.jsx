import { useState } from 'react';
import { StageBadge, Button, Modal } from './UI';

export default function TaskCard({ task, onEdit, onDelete, onStageChange }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const NEXT_STAGES = {
    todo: 'in_progress',
    in_progress: 'done',
    done: null
  };
  const PREV_STAGES = {
    todo: null,
    in_progress: 'todo',
    done: 'in_progress'
  };

  return (
    <>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'fadeIn 0.3s ease',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <h3 style={{
            fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            color: 'var(--text)', lineHeight: 1.4, flex: 1,
            textDecoration: task.stage === 'done' ? 'line-through' : 'none',
            opacity: task.stage === 'done' ? 0.6 : 1,
          }}>
            {task.title}
          </h3>
          <StageBadge stage={task.stage} />
        </div>

        {/* Description */}
        {task.description && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            {fmtDate(task.createdAt)}
          </span>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {/* Quick stage buttons */}
            {PREV_STAGES[task.stage] && (
              <button
                onClick={() => onStageChange(task.id, PREV_STAGES[task.stage])}
                title="Move back"
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', borderRadius: 6,
                  padding: '4px 8px', fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >←</button>
            )}
            {NEXT_STAGES[task.stage] && (
              <button
                onClick={() => onStageChange(task.id, NEXT_STAGES[task.stage])}
                title="Move forward"
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', borderRadius: 6,
                  padding: '4px 8px', fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >→</button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onEdit(task)}
              style={{ padding: '4px 10px', fontSize: 12, color: 'var(--text-muted)' }}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(true)}
              style={{ padding: '4px 10px', fontSize: 12 }}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Task?">
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>
          Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>"{task.title}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteConfirm(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
