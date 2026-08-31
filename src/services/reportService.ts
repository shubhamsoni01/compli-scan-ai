import { mockReports, reportStats, type Report } from '@/data/reports';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getReports(): Promise<Report[]> {
  await delay(300);
  return [...mockReports];
}

export async function getReportStats() {
  await delay(200);
  return { ...reportStats };
}

export async function downloadReport(reportId: string): Promise<void> {
  await delay(500);
  console.log(`Downloading report ${reportId}...`);
  // In production, this would trigger a file download
}

export async function shareReport(reportId: string): Promise<string> {
  await delay(300);
  return `https://compliscan.ai/reports/shared/${reportId}`;
}
