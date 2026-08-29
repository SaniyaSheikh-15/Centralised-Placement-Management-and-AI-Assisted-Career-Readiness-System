'use client';

import { useState, useRef, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, Download, RefreshCw, FileText, Upload } from 'lucide-react';
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
          className={`flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-all ${
            dragOver
              ? 'border-[#1683FF] bg-[rgba(22,131,255,0.10)]'
              : 'border-[#1A2B42] bg-[#0A1524] hover:border-[#1683FF]'
          }`}
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="h-12 w-12 text-[#1683FF]" />
          <div className="text-base text-[#94A3B8]">
            Drag & drop your resume here, or <span className="font-semibold text-[#1683FF]">Browse files</span>
          </div>
          <div className="text-sm text-[#64748B]">Supports PDF up to 5MB</div>
        </div>
      )}

      {/* Empty state below drag zone */}
      {!hasResume && !uploading && (
        <div className="flex flex-col items-center rounded-xl border border-[#1A2B42] bg-[#0E1B2E] px-8 py-10 text-center">
          <FileText className="mb-3 h-12 w-12 text-[#64748B]" />
          <h3 className="mb-1 text-base font-semibold text-[#F1F5F9]">No resume uploaded yet</h3>
          <p className="mb-5 max-w-md text-xs text-[#64748B]">
            Upload your resume in a .PDF file to showcase your qualifications to recruiters.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D6FE0]"
          >
            <Upload className="h-4 w-4" />
            Upload PDF
          </button>
        </div>
      )}

      {uploading && (
        <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-6">
          <div className="mb-3 flex items-center gap-3">
            <UploadCloud className="h-5 w-5 text-[#1683FF]" />
            <span className="font-semibold text-[#F1F5F9]">Uploading resume...</span>
            <span className="ml-auto font-bold text-[#1683FF]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-[#EF4444] animate-slide-in-left">
          ⚠️ {error}
        </div>
      )}

      {hasResume && !uploading && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-4 max-md:flex-col max-md:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[#F1F5F9]">{profile.resume.fileName}</p>
              <p className="text-xs text-[#64748B]">{formatFileSize(profile.resume.fileSize)} · Uploaded {formatDate(profile.resume.uploadDate)}</p>
            </div>
            <div className="flex shrink-0 gap-2 max-md:w-full">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A2B42] bg-[#0E1B2E] px-3 py-1.5 text-sm font-medium text-[#F1F5F9] transition-colors hover:bg-[#1A2B42]"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F1F5F9]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </button>
            </div>
          </div>
          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-4">
              <iframe src={previewUrl} title="Resume Preview" className="h-[500px] w-full rounded-lg border-none bg-white max-md:h-[350px]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
