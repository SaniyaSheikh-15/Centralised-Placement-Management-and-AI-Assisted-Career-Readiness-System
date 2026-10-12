import { MinimalPage } from "@/components/layout/minimal-page";
import { ApplicationsPanel } from "@/components/placement/applications-panel";

export default function ApplicationsPage() {
  return (
    <MinimalPage
      eyebrow="My Applications"
      title="Track every application, status change, and next step in one place."
    >
      <ApplicationsPanel />
    </MinimalPage>
  );
}
