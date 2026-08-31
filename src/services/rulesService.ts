import { complianceRules, type ComplianceRule } from '@/data/complianceRules';
import { type ProductCategory } from '@/data/products';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRules(filters?: {
  category?: ProductCategory | 'all';
  authority?: string | 'all';
  status?: string | 'all';
  search?: string;
}): Promise<ComplianceRule[]> {
  await delay(300);

  let results = [...complianceRules];

  if (filters?.category && filters.category !== 'all') {
    results = results.filter((r) => r.applicableTo.includes(filters.category as ProductCategory));
  }

  if (filters?.authority && filters.authority !== 'all') {
    results = results.filter((r) => r.authority === filters.authority);
  }

  if (filters?.status && filters.status !== 'all') {
    results = results.filter((r) => r.status === filters.status);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.requirement.toLowerCase().includes(searchLower) ||
        r.ruleId.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export async function getRuleById(ruleId: string): Promise<ComplianceRule | undefined> {
  await delay(200);
  return complianceRules.find((r) => r.ruleId === ruleId);
}

export function getAuthorities(): string[] {
  const authorities = new Set(complianceRules.map((r) => r.authority));
  return Array.from(authorities);
}
