'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';
import { getBranches } from '@/lib/student-profile-api';
import { maskPhone, maskAadhaar, maskPAN } from '@/features/student-profile/utils/profileValidation';
import { useEffect, useState } from 'react';


const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];
const INCOME_RANGES = ['Below 1 Lakh', '1-3 Lakhs', '3-5 Lakhs', '5-8 Lakhs', '8-12 Lakhs', 'Above 12 Lakhs'];

  type Branch = {
    branch_id: string;
    branch_code: string;
    branch_name: string;
    department: string | null;
  };


export default function TabPersonal() {
 const {
  editDraft,
  updatePersonalInfo,
  updateAcademicInfo,
} = useStudentProfile();
const p = editDraft.personalInfo;

const [branches, setBranches] = useState<Branch[]>([]);
useEffect(() => {
  const loadBranches = async () => {
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error("Failed to load branches:", error);
    }
  };

  loadBranches();
}, []);
  return (
    <div className="space-y-6">
      {/* ─── Core Identity ──────────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Core Identity</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="fullName" value={p.fullName} onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="dob" type="date" value={p.dateOfBirth} onChange={(e) => updatePersonalInfo({ dateOfBirth: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={p.gender ?? undefined} onValueChange={(v: string | null) => updatePersonalInfo({ gender: v ?? '' })}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
  <Label>
    Branch <span className="text-[var(--color-danger)]">*</span>
  </Label>

  <Select
  value={p.branchId || ''}
    onValueChange={(branchId: string | null) => {
      const selectedBranch = branches.find(
        (branch) => branch.branch_id === branchId
      );

      updatePersonalInfo({
        branchId: branchId ?? '',
        branch: selectedBranch?.branch_name ?? '',
      });

      updateAcademicInfo({
        department: selectedBranch?.department ?? '',
      });
    }}
  >
    <SelectTrigger>
  <SelectValue placeholder="Select branch">
    {branches.find(
      (branch) => branch.branch_id === p.branchId
    )?.branch_name}
  </SelectValue>
</SelectTrigger>

    <SelectContent>
      {branches.map((branch) => (
        <SelectItem
          key={branch.branch_id}
          value={branch.branch_id}
        >
          {branch.branch_name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="phone" value={p.phone} onChange={(e) => updatePersonalInfo({ phone: maskPhone(e.target.value) })} placeholder="10-digit number" maxLength={10} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altPhone">Alt Phone</Label>
            <Input id="altPhone" value={p.altPhone} onChange={(e) => updatePersonalInfo({ altPhone: maskPhone(e.target.value) })} placeholder="Alternate number" maxLength={10} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-[var(--color-danger)]">*</span></Label>
            <Input id="email" type="email" value={p.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="altEmail">Alt Email</Label>
            <Input id="altEmail" type="email" value={p.altEmail} onChange={(e) => updatePersonalInfo({ altEmail: e.target.value })} placeholder="Alternate email" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="permanentAddress">Permanent Address</Label>
            <Textarea id="permanentAddress" value={p.permanentAddress} onChange={(e) => updatePersonalInfo({ permanentAddress: e.target.value })} rows={3} placeholder="Permanent address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="presentAddress">Present Address</Label>
            <Textarea id="presentAddress" value={p.presentAddress} onChange={(e) => updatePersonalInfo({ presentAddress: e.target.value })} rows={3} placeholder="Present / hostel address" />
          </div>
        </div>
      </fieldset>

      {/* ─── Family & Identity ──────────────────── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Family & Identity Details</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father&apos;s Name</Label>
            <Input id="fatherName" value={p.fatherName} onChange={(e) => updatePersonalInfo({ fatherName: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherName">Mother&apos;s Name</Label>
            <Input id="motherName" value={p.motherName} onChange={(e) => updatePersonalInfo({ motherName: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fatherOccupation">Father&apos;s Occupation</Label>
            <Input id="fatherOccupation" value={p.fatherOccupation} onChange={(e) => updatePersonalInfo({ fatherOccupation: e.target.value })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abcId">ABC ID</Label>
            <Input id="abcId" value={p.abcId} onChange={(e) => updatePersonalInfo({ abcId: e.target.value })} placeholder="ABC-XXXX-XXXXX" />
          </div>
        </div>
      </fieldset>
    </div>
  );
}