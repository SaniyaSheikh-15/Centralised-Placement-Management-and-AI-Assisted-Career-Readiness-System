import { ApplicationStatus } from "@/types/placement";
import { StatusBadge } from "@/components/placement/status-badge";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return <StatusBadge status={status} tone="application" />;
}
