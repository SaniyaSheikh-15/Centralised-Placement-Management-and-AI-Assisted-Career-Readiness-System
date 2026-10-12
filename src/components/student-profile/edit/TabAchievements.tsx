'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import type { Achievement } from '@/types/student-profile';

export default function TabAchievements() {
  const { editDraft, addAchievement, updateAchievement, deleteAchievement } = useStudentProfile();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingAch, setDeletingAch] = useState<Achievement | null>(null);

  const [form, setForm] = useState({ title: '', description: '', date: '' });

  const resetForm = () => { setForm({ title: '', description: '', date: '' }); setEditingId(null); setShowForm(false); };

  const handleEdit = (ach: Achievement) => {
    setForm({ title: ach.title, description: ach.description, date: ach.date });
    setEditingId(ach.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      updateAchievement(editingId, form);
    } else {
      addAchievement(form);
    }
    resetForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Achievements ({editDraft.achievements.length})</p>
        {!showForm && <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Achievement</Button>}
      </div>

      {/* Inline Form */}
      {showForm && (
        <Card className="border-[var(--accent-primary)] bg-[var(--bg-card)]">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="achTitle">Title <span className="text-[var(--color-danger)]">*</span></Label>
                  <Input id="achTitle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. SIH 2025 National Finalist" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achDate">Date</Label>
                  <Input id="achDate" type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="achDesc">Description</Label>
                <Textarea id="achDesc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the achievement..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Achievement</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {editDraft.achievements.length > 0 ? (
        <div className="space-y-3">
          {editDraft.achievements.map((ach) => (
            <Card key={ach.id} className="group border-[var(--border-card)] bg-[var(--bg-card)] transition-all hover:border-[rgba(22,131,255,0.25)]">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-subtle)]">
                  <Star className="h-5 w-5 text-[var(--color-warning)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{ach.title}</p>
                  {ach.date && <p className="text-xs text-[var(--text-muted)] mt-0.5">{ach.date}</p>}
                  {ach.description && <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">{ach.description}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(ach)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)]" onClick={() => setDeletingAch(ach)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <p className="text-sm italic text-[var(--text-muted)]">No achievements added yet.</p>
      ) : null}

      <DeleteConfirmModal isOpen={!!deletingAch} title="Delete Achievement" message={`Remove "${deletingAch?.title}"?`} onConfirm={() => { if (deletingAch) deleteAchievement(deletingAch.id); setDeletingAch(null); }} onCancel={() => setDeletingAch(null)} />
    </div>
  );
}
