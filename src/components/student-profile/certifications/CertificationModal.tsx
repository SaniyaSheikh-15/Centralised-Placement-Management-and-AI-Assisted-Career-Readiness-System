'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Certification } from '@/types/student-profile';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cert: Omit<Certification, 'id'> & { id?: string }) => void;
  editingCert?: Certification | null;
}

export default function CertificationModal({ isOpen, onClose, onSubmit, editingCert = null }: CertificationModalProps) {
  const [formData, setFormData] = useState({ name: '', organization: '', date: '', link: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingCert) {
      setFormData({ name: editingCert.name, organization: editingCert.organization, date: editingCert.date, link: editingCert.link });
    } else {
      setFormData({ name: '', organization: '', date: '', link: '' });
    }
    setErrors({});
  }, [editingCert, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Certification name is required';
    if (!formData.organization.trim()) errs.organization = 'Organization is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ ...(editingCert ? { id: editingCert.id } : {}), name: formData.name.trim(), organization: formData.organization.trim(), date: formData.date, link: formData.link.trim() });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-[var(--border-card)] bg-[var(--bg-card)] sm:max-w-md">
        <DialogHeader><DialogTitle>{editingCert ? 'Edit Certification' : 'Add Certification'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Certification Name *</Label>
            <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. AWS Cloud Practitioner" autoFocus className={errors.name ? 'border-[var(--color-danger)]' : ''} />
            {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Issuing Organization *</Label>
            <Input value={formData.organization} onChange={(e) => handleChange('organization', e.target.value)} placeholder="e.g. Amazon Web Services" className={errors.organization ? 'border-[var(--color-danger)]' : ''} />
            {errors.organization && <p className="text-xs text-[var(--color-danger)]">{errors.organization}</p>}
          </div>
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input type="month" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Credential / Verification URL</Label>
            <Input type="url" value={formData.link} onChange={(e) => handleChange('link', e.target.value)} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingCert ? 'Update Certification' : 'Add Certification'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
