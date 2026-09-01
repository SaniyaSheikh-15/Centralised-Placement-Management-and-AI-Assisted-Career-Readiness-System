'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

const DEGREES = ['B.Tech', 'B.E.', 'BCA', 'B.Sc', 'M.Tech', 'MCA'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];

export default function TabAcademic() {
  const { editDraft, updateAcademicInfo } = useStudentProfile();
  const a = editDraft.academicInfo;

  return (
    <div className="space-y-6">
      {/* ─── Enrollment ─────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Enrollment</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="enrollNo">University Enrollment No. <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="enrollNo" value={a.universityEnrollmentNo} onChange={(e) => updateAcademicInfo({ universityEnrollmentNo: e.target.value })} placeholder="e.g. BATU2022CSE0451" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="college">College <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="college" value={a.college} onChange={(e) => updateAcademicInfo({ college: e.target.value })} placeholder="College name" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={a.department} onChange={(e) => updateAcademicInfo({ department: e.target.value })} placeholder="Department" />
          </div>
          <div className="space-y-2">
            <Label>Degree</Label>
            <Select value={a.degree ?? undefined} onValueChange={(v: string | null) => updateAcademicInfo({ degree: v ?? '' })}>
              <SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger>
              <SelectContent>
                {DEGREES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Academic Year</Label>
            <Select value={a.academicYear ?? undefined} onValueChange={(v: string | null) => updateAcademicInfo({ academicYear: v ?? '' })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      {/* ─── Schooling & Aggregate ──────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Schooling & Aggregate</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sscPct">SSC Percentage</Label>
            <Input id="sscPct" type="number" step="0.01" min="0" max="100" value={a.sscPercentage} onChange={(e) => updateAcademicInfo({ sscPercentage: e.target.value })} placeholder="e.g. 92.4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sscYear">SSC Passing Year</Label>
            <Input id="sscYear" type="number" min="2010" max="2035" value={a.sscPassingYear} onChange={(e) => updateAcademicInfo({ sscPassingYear: e.target.value })} placeholder="e.g. 2019" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hscPct">HSC / Diploma Percentage</Label>
            <Input id="hscPct" type="number" step="0.01" min="0" max="100" value={a.hscDiplomaPercentage} onChange={(e) => updateAcademicInfo({ hscDiplomaPercentage: e.target.value })} placeholder="e.g. 88.6" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hscYear">HSC / Diploma Passing Year</Label>
            <Input id="hscYear" type="number" min="2010" max="2035" value={a.hscDiplomaPassingYear} onChange={(e) => updateAcademicInfo({ hscDiplomaPassingYear: e.target.value })} placeholder="e.g. 2021" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="btechAgg">B.Tech Aggregate (%)</Label>
            <Input id="btechAgg" type="number" step="0.01" min="0" max="100" value={a.btechAggregate} onChange={(e) => updateAcademicInfo({ btechAggregate: e.target.value })} placeholder="e.g. 78.32" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cgpa">Current CGPA <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="cgpa" type="number" step="0.01" min="0" max="10" value={a.cgpaCurrent} onChange={(e) => updateAcademicInfo({ cgpaCurrent: e.target.value })} placeholder="e.g. 8.42" />
          </div>
        </div>
      </fieldset>

      {/* ─── Backlogs ───────────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Backlogs</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Live Backlogs?</Label>
            <Select value={a.hasLiveBacklogs ?? undefined} onValueChange={(v: string | null) => updateAcademicInfo({ hasLiveBacklogs: v ?? '' })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {a.hasLiveBacklogs === 'Yes' && (
            <div className="space-y-2">
              <Label htmlFor="backlogDetails">Backlog Details</Label>
              <Textarea id="backlogDetails" value={a.backlogDetails} onChange={(e) => updateAcademicInfo({ backlogDetails: e.target.value })} rows={3} placeholder="Describe backlogs (subjects, semester, etc.)" />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
}
