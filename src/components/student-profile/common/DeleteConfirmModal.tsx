'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Delete',
  message = 'Are you sure? This action cannot be undone.',
  confirmLabel = 'Confirm Delete',
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md border-[var(--border-card)] bg-[var(--bg-card)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--color-danger)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="flex items-center gap-4 rounded-lg border border-red-500/20 bg-[var(--color-danger-subtle)] p-4">
              <Trash2 className="h-6 w-6 shrink-0 text-[var(--color-danger)]" />
              <span className="text-sm leading-relaxed text-[var(--text-secondary)]">{message}</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="border-[var(--border-card)] bg-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
