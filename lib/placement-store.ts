import {
  ApplicationRecord,
  EligibilityResult,
  PlacementDrive
} from "@/types/placement";
import {
  applications as seedApplications,
  eligibilityByDrive,
  placementDrives as seedDrives
} from "@/data/mock-placement-data";

const driveStore: PlacementDrive[] = seedDrives.map((drive) => ({ ...drive }));
const applicationStore: ApplicationRecord[] = seedApplications.map((application) => ({
  ...application,
  timeline: application.timeline.map((item) => ({ ...item }))
}));

export function listDrives() {
  return driveStore;
}

export function getDrive(driveId: string) {
  return driveStore.find((drive) => drive.id === driveId);
}

export function getEligibility(driveId: string): EligibilityResult | undefined {
  return eligibilityByDrive[driveId];
}

export function listApplications() {
  return applicationStore;
}

export function getApplication(applicationId: string) {
  return applicationStore.find((application) => application.id === applicationId);
}

export function getApplicationByDrive(driveId: string) {
  return applicationStore.find((application) => application.driveId === driveId);
}

export function addApplication(application: ApplicationRecord) {
  applicationStore.unshift(application);
}

export function updateApplication(applicationId: string, patch: Partial<ApplicationRecord>) {
  const application = getApplication(applicationId);
  if (!application) {
    return undefined;
  }

  Object.assign(application, patch);
  return application;
}
