import { ApplicationDetailsPanel } from "@/components/placement/application-details-panel";

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ApplicationDetailsPage({ params }: PageProps) {
  const { applicationId } = await params;
  return <ApplicationDetailsPanel applicationId={applicationId} />;
}
