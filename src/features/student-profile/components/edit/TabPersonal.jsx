import { useStudentProfile } from '../../context/StudentProfileContext';
import { maskPhone, maskAadhaar, maskPAN } from '../../utils/profileValidation';

/**
 * TabPersonal — Edit Tab 1
 * Renders Section 6.1 fields: Core Identity, Family, IDs, Branch.
 */

const GENDERS = ['Male', 'Female', 'Other'];
const CATEGORIES = ['Open', 'OBC', 'SC', 'ST', 'NT-VJ', 'Others'];
const INCOME_RANGES = ['< 1 Lakh', '1-3 Lakhs', '3-5 Lakhs', '5-8 Lakhs', '> 8 Lakhs'];
const BRANCHES = [
  'Civil Engineering',
  'Computer Science Engineering',
  'Electrical Engineering',
  'Electronics & Telecommunication Engineering',
  'Mechanical Engineering',
  'Artificial Intelligence and Data Science',
];

export default function TabPersonal() {
  const { editDraft, updatePersonalInfo } = useStudentProfile();
  const p = editDraft.personalInfo;

  const handleChange = (field, value) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Core Identity */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Core Identity
        </h4>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={p.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Enter full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input className="form-input" type="date" value={p.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select className="form-select" value={p.gender} onChange={(e) => handleChange('gender', e.target.value)}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <input className="form-input" type="file" accept="image/jpeg,image/png" onChange={(e) => handleChange('profilePhoto', e.target.files[0] || null)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" value={p.phone} onChange={(e) => handleChange('phone', maskPhone(e.target.value))} placeholder="10-digit mobile" maxLength={10} />
          </div>
          <div className="form-group">
            <label className="form-label">Alt. Phone *</label>
            <input className="form-input" value={p.altPhone} onChange={(e) => handleChange('altPhone', maskPhone(e.target.value))} placeholder="10-digit mobile" maxLength={10} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" value={p.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Alt. Email *</label>
            <input className="form-input" type="email" value={p.altEmail} onChange={(e) => handleChange('altEmail', e.target.value)} placeholder="email@example.com" />
          </div>
        </div>
        <div className="grid-2" style={{ marginTop: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label">Permanent Address *</label>
            <textarea className="form-textarea" value={p.permanentAddress} onChange={(e) => handleChange('permanentAddress', e.target.value)} placeholder="Full permanent address" rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Present Address *</label>
            <textarea className="form-textarea" value={p.presentAddress} onChange={(e) => handleChange('presentAddress', e.target.value)} placeholder="Full present address" rows={3} />
          </div>
        </div>
      </div>

      {/* Family & Identity Details */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Family & Identity Details
        </h4>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Father's Name *</label>
            <input className="form-input" value={p.fatherName} onChange={(e) => handleChange('fatherName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mother's Name *</label>
            <input className="form-input" value={p.motherName} onChange={(e) => handleChange('motherName', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Father's Occupation *</label>
            <input className="form-input" value={p.fatherOccupation} onChange={(e) => handleChange('fatherOccupation', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Annual Family Income *</label>
            <select className="form-select" value={p.annualFamilyIncome} onChange={(e) => handleChange('annualFamilyIncome', e.target.value)}>
              <option value="">Select income range</option>
              {INCOME_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Religion *</label>
            <input className="form-input" value={p.religion} onChange={(e) => handleChange('religion', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div className="radio-group">
              {CATEGORIES.map((c) => (
                <label key={c} className="radio-option">
                  <input type="radio" name="category" value={c} checked={p.category === c} onChange={(e) => handleChange('category', e.target.value)} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Government IDs */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Government / Institutional IDs
        </h4>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">PAN Number</label>
            <input className="form-input" value={p.panNumber} onChange={(e) => handleChange('panNumber', maskPAN(e.target.value))} placeholder="ABCDE1234F" maxLength={10} />
            <span className="form-helper">Format: ABCDE1234F (optional)</span>
          </div>
          <div className="form-group">
            <label className="form-label">Aadhaar Number *</label>
            <input className="form-input" value={p.aadhaarNumber} onChange={(e) => handleChange('aadhaarNumber', maskAadhaar(e.target.value))} placeholder="12-digit Aadhaar" maxLength={12} />
          </div>
          <div className="form-group">
            <label className="form-label">ABC ID</label>
            <input className="form-input" value={p.abcId} onChange={(e) => handleChange('abcId', e.target.value)} placeholder="Academic Bank of Credits ID" />
          </div>
        </div>
      </div>

      {/* Branch */}
      <div>
        <h4 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          Academic Branch
        </h4>
        <div className="form-group">
          <label className="form-label">Branch *</label>
          <div className="radio-group" style={{ flexDirection: 'column' }}>
            {BRANCHES.map((b) => (
              <label key={b} className="radio-option">
                <input type="radio" name="branch" value={b} checked={p.branch === b} onChange={(e) => handleChange('branch', e.target.value)} />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
