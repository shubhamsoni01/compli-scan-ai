import { mockScanHistory, type ScanRecord } from '@/data/scanHistory';
import { type ProductCategory } from '@/data/products';
import { type ScanStatus } from '@/data/scanHistory';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getHistory(filters?: {
  category?: ProductCategory | 'all';
  status?: ScanStatus | 'all';
  search?: string;
}): Promise<ScanRecord[]> {
  await delay(400);

  let results = [...mockScanHistory];

  if (filters?.category && filters.category !== 'all') {
    results = results.filter((r) => r.category === filters.category);
  }

  if (filters?.status && filters.status !== 'all') {
    results = results.filter((r) => r.status === filters.status);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.productName.toLowerCase().includes(searchLower) ||
        r.brand.toLowerCase().includes(searchLower)
    );
  }

  return results;
}

export async function getScanById(scanId: string): Promise<ScanRecord | undefined> {
  await delay(200);
  return mockScanHistory.find((s) => s.id === scanId);
}
