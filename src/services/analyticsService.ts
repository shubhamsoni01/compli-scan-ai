import { analyticsData } from '@/data/analytics';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAnalytics() {
  await delay(400);
  return { ...analyticsData };
}

export async function getComplianceTrend() {
  await delay(200);
  return [...analyticsData.complianceTrend];
}

export async function getCategoryDistribution() {
  await delay(200);
  return [...analyticsData.categoryDistribution];
}

export async function getCommonIssues() {
  await delay(200);
  return [...analyticsData.commonIssues];
}

export async function getMonthlyScans() {
  await delay(200);
  return [...analyticsData.monthlyScans];
}
