'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code2, Briefcase, Award, FolderKanban, Star } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ProfessionalSummaryCard() {
  const { profile } = useStudentProfile();

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <Briefcase className="h-4 w-4 text-[var(--accent-primary)]" />
          Professional Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Technical Skills */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <Code2 className="h-3.5 w-3.5" /> Technical Skills ({profile.technicalSkills.length})
          </div>
          {profile.technicalSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.technicalSkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                  {skill.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">No skills added yet</p>
          )}
        </div>

        <Separator className="bg-[var(--border-card)]" />

        {/* Projects */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <FolderKanban className="h-3.5 w-3.5" /> Projects ({profile.projects.length})
          </div>
          {profile.projects.length > 0 ? (
            <div className="space-y-1">
              {profile.projects.map((proj) => (
                <p key={proj.id} className="text-sm font-medium text-[var(--text-primary)]">• {proj.name}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">No projects added yet</p>
          )}
        </div>

        <Separator className="bg-[var(--border-card)]" />

        {/* Certifications */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <Award className="h-3.5 w-3.5" /> Certifications ({profile.certifications.length})
          </div>
          {profile.certifications.length > 0 ? (
            <div className="space-y-1">
              {profile.certifications.map((cert) => (
                <p key={cert.id} className="text-sm font-medium text-[var(--text-primary)]">• {cert.name}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">No certifications added yet</p>
          )}
        </div>

        <Separator className="bg-[var(--border-card)]" />

        {/* Achievements */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
            <Star className="h-3.5 w-3.5" /> Achievements ({profile.achievements.length})
          </div>
          {profile.achievements.length > 0 ? (
            <div className="space-y-1">
              {profile.achievements.map((ach) => (
                <p key={ach.id} className="text-sm font-medium text-[var(--text-primary)]">• {ach.title}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-[var(--text-muted)]">No achievements added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
