'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import DeleteConfirmModal from '@/components/student-profile/common/DeleteConfirmModal';
import type { Internship } from '@/types/student-profile';

export default function TabInternships() {
  const { editDraft, addInternship, updateInternship, deleteInternship } = useStudentProfile();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingInternship, setDeletingInternship] = useState<Internship | null>(null);

  const [form, setForm] = useState({ organization: '', role: '', duration: '', description: '' });

  const resetForm = () => { setForm({ organization: '', role: '', duration: '', description: '' }); setEditingId(null); setShowForm(false); };

  const handleEdit = (intern: Internship) => {
    setForm({ organization: intern.organization, role: intern.role, duration: intern.duration, description: intern.description });
    setEditingId(intern.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organization.trim() || !form.role.trim()) return;
    if (editingId) {
      updateInternship(editingId, form);
    } else {
      addInternship(form);
    }
    resetForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Internships ({editDraft.internships.length})</p>
        {!showForm && <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Internship</Button>}
      </div>

      {/* Inline Form */}
      {showForm && (
        <Card className="border-[var(--accent-primary)] bg-[var(--bg-card)]">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org">Organization <span className="text-[var(--color-danger)]">*</span></Label>
                  <Input id="org" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g. TCS Digital" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role <span className="text-[var(--color-danger)]">*</span></Label>
                  <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Full Stack Intern" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. Jun 2025 – Aug 2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe your responsibilities and achievements..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button type="submit">{editingId ? 'Update' : 'Add'} Internship</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {editDraft.internships.length > 0 ? (
        <div className="space-y-3">
          {editDraft.internships.map((intern) => (
            <Card key={intern.id} className="group border-[var(--border-card)] bg-[var(--bg-card)] transition-all hover:border-[rgba(22,131,255,0.25)]">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary-subtle)]">
                  <Briefcase className="h-5 w-5 text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{intern.role}</p>
                  <p className="text-sm text-[var(--accent-primary)]">{intern.organization}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{intern.duration}</p>
                  {intern.description && <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">{intern.description}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(intern)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)]" onClick={() => setDeletingInternship(intern)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <p className="text-sm italic text-[var(--text-muted)]">No internships added yet.</p>
      ) : null}

      <DeleteConfirmModal isOpen={!!deletingInternship} title="Delete Internship" message={`Remove "${deletingInternship?.role} at ${deletingInternship?.organization}"?`} onConfirm={() => { if (deletingInternship) deleteInternship(deletingInternship.id); setDeletingInternship(null); }} onCancel={() => setDeletingInternship(null)} />
    </div>
  );
}
