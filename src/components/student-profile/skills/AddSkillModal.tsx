'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TechnicalSkill } from '@/types/student-profile';

const COMMON_SKILLS = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP',
  'React.js', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'Linux', 'CI/CD', 'REST API', 'GraphQL',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV',
  'HTML', 'CSS', 'Sass', 'TailwindCSS', 'Bootstrap',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
  'SQL', 'NoSQL', 'Data Structures', 'Algorithms',
];

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (skill: { name: string; proficiency: TechnicalSkill['proficiency'] }) => void;
  editingSkill?: TechnicalSkill | null;
}

export default function AddSkillModal({ isOpen, onClose, onSubmit, editingSkill = null }: AddSkillModalProps) {
  const [name, setName] = useState(editingSkill?.name || '');
  const [proficiency, setProficiency] = useState<TechnicalSkill['proficiency']>(editingSkill?.proficiency || 'Beginner');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!editingSkill;

  const filteredSuggestions = useMemo(() => {
    if (!name.trim()) return [];
    return COMMON_SKILLS.filter(
      (s) => s.toLowerCase().includes(name.toLowerCase()) && s.toLowerCase() !== name.toLowerCase()
    ).slice(0, 6);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Skill name is required'); return; }
    setError('');
    onSubmit({ name: name.trim(), proficiency });
    setName(''); setProficiency('Beginner');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-[var(--border-card)] bg-[var(--bg-card)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative space-y-2">
            <Label>Skill Name</Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="e.g. React.js, Python, Docker..."
              autoFocus
              disabled={isEditing}
              className={error ? 'border-[var(--color-danger)]' : ''}
            />
            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-[200px] overflow-y-auto rounded-lg border border-[var(--border-card)] bg-[var(--bg-secondary)]">
                {filteredSuggestions.map((s) => (
                  <button key={s} type="button" onClick={() => { setName(s); setShowSuggestions(false); }}
                    className="block w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-primary-subtle)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Proficiency Level</Label>
            <Select value={proficiency} onValueChange={(v) => setProficiency(v as TechnicalSkill['proficiency'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Update Skill' : 'Add Skill'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
