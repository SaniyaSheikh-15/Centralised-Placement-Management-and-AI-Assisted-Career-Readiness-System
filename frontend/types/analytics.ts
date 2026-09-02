export interface PlacementOfficerAnalytics {
  overview: {
    totalStudents: number;
    eligibleStudents: number;
    applications: number;
    studentsPlaced: number;
    placementRate: number;
    activeDrives: number;
  };

  hiringUpdates: {
    companyId: string;
    companyName: string;
    selectedStudents: number;
  }[];

  placementScenario: {
    placementRate: {
      label: string;
      value: number;
    }[];

    departmentWise: {
      department: string;
      totalStudents: number;
      placedStudents: number;
      placementRate: number;
    }[];

    yearWise: {
      year: number;
      totalStudents: number;
      placedStudents: number;
      placementRate: number;
    }[];

    companyWise: {
      companyId: string;
      companyName: string;
      selectedStudents: number;
    }[];

    salaryDistribution: {
      range: string;
      students: number;
    }[];

    ctcStatistics: {
      average: number | null;
      highest: number | null;
      lowest: number | null;
      median: number | null;
    };

    offersByRole: {
      jobRoleId: string;
      roleTitle: string;
      offers: number;
    }[];
  };

  eligibleStudents: {
    studentId: string;
    studentName: string;
    department: string;
    branch: string;
    cgpa: number | null;
    eligibleDrives: number;
    applications: number;
    interviewStatus: string | null;
    placementStatus: string | null;
  }[];

  hiringTrends: {
    monthlyHiring: {
      month: string;
      hired: number;
    }[];

    applicationsVsSelections: {
      month: string;
      applications: number;
      selections: number;
    }[];

    selectionRate: {
      month: string;
      rate: number;
    }[];

    companyRecruitment: {
      companyId: string;
      companyName: string;
      selectedStudents: number;
    }[];
  };

  insights: {
    type: "positive" | "warning" | "info";
    message: string;
  }[];

  generatedAt: string;
}