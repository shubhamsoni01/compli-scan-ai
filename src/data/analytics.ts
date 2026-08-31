export const analyticsData = {
  stats: {
    totalScans: 1248,
    complianceRate: 70.2,
    potentialIssues: 241,
    needsReview: 131,
    trends: {
      totalScans: 12.5,
      complianceRate: 3.8,
      potentialIssues: -5.2,
      needsReview: -1.4,
    },
  },

  complianceTrend: [
    { month: 'Mar', rate: 62 },
    { month: 'Apr', rate: 65 },
    { month: 'May', rate: 63 },
    { month: 'Jun', rate: 68 },
    { month: 'Jul', rate: 72 },
    { month: 'Aug', rate: 70 },
  ],

  categoryDistribution: [
    { category: 'Food', count: 485, percentage: 38.9 },
    { category: 'Cosmetics', count: 312, percentage: 25.0 },
    { category: 'Edible Oil', count: 198, percentage: 15.9 },
    { category: 'Household', count: 168, percentage: 13.5 },
    { category: 'Other', count: 85, percentage: 6.8 },
  ],

  commonIssues: [
    { issue: 'Consumer Care Missing', count: 89, percentage: 36.9 },
    { issue: 'Allergen Info Missing', count: 62, percentage: 25.7 },
    { issue: 'Ingredients Unclear', count: 45, percentage: 18.7 },
    { issue: 'Language Compliance', count: 28, percentage: 11.6 },
    { issue: 'Nutritional Info Gap', count: 17, percentage: 7.1 },
  ],

  monthlyScans: [
    { month: 'Mar', scans: 142 },
    { month: 'Apr', scans: 178 },
    { month: 'May', scans: 195 },
    { month: 'Jun', scans: 210 },
    { month: 'Jul', scans: 248 },
    { month: 'Aug', scans: 275 },
  ],
};
