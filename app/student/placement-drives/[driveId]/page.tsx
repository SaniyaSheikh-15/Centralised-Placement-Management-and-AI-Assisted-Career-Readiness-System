import { PlacementDriveDetailsPanel } from "@/components/placement/placement-drive-details-panel";

interface PageProps {
  params: Promise<{ driveId: string }>;
}

export default async function DriveDetailsPage({ params }: PageProps) {
  const { driveId } = await params;
  return <PlacementDriveDetailsPanel driveId={driveId} />;
}
