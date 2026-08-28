'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, RefreshCw } from 'lucide-react';
import { validateResumeFile } from '@/features/student-profile/utils/profileValidation';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ResumeUploader() {
  const { profile, setResume, deleteResume } = useStudentProfile();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasResume = profile.resume.uploadedResume !== null;

  const handleFile = useCallback((file: File) => {
    const validation = validateResumeFile(file);
    if (!validation.valid) { setError(validation.message); return; }
    setError('');
    setUploading(true);
    setProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setUploading(false);
          setResume(file);
          setPreviewUrl(URL.createObjectURL(file));
        }, 400);
      } else {
        setProgress(Math.round(current));
      }
    }, 200);
  }, [setResume]);

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }, [handleFile]);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ''; }, [handleFile]);

  const handleDownload = useCallback(() => {
    if (profile.resume.uploadedResume) {
      const url = URL.createObjectURL(profile.resume.uploadedResume);
      const a = document.createElement('a');
      a.href = url; a.download = profile.resume.fileName; a.click();
      URL.revokeObjectURL(url);
    }
  }, [profile.resume]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-4">
      <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileInput} className="hidden" />

      {!hasResume && !uploading && (
        <div
          className={`flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-all ${dragOver ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]' : 'border-[var(--border-card)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-subtle)]'}`}
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-[var(--text-muted)] opacity-50" />
          <div className="text-base text-[var(--text-secondary)]">
            Drag & drop your resume here, or <span className="font-semibold text-[var(--accent-primary)]">browse files</span>
          </div>
          <div className="text-sm text-[var(--text-muted)]">PDF files only · Max 5 MB</div>
        </div>
      )}

      {uploading && (
        <Card className="border-[var(--border-card)] bg-[var(--bg-card)]">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-3">
              <Upload className="h-5 w-5 text-[var(--accent-primary)]" />
              <span className="font-semibold text-[var(--text-primary)]">Uploading resume...</span>
              <span className="ml-auto font-bold text-[var(--accent-primary)]">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)] animate-slide-in-left">
          ⚠️ {error}
        </div>
      )}

      {hasResume && !uploading && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 max-md:flex-col max-md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-danger-subtle)] text-xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{profile.resume.fileName}</p>
              <p className="text-xs text-[var(--text-muted)]">{formatFileSize(profile.resume.fileSize)} · Uploaded {formatDate(profile.resume.uploadDate)}</p>
            </div>
            <div className="flex shrink-0 gap-2 max-md:w-full">
              <Button variant="secondary" size="sm" onClick={handleDownload}><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Replace</Button>
            </div>
          </div>
          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4">
              <iframe src={previewUrl} title="Resume Preview" className="h-[500px] w-full rounded-lg border-none bg-white max-md:h-[350px]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
