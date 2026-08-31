export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    title: 'Scan Complete',
    message: 'Uncle Chips Spicy Treat scan completed with 82% compliance.',
    type: 'warning',
    read: false,
    timestamp: '2026-08-28T14:35:00',
  },
  {
    id: 'notif_002',
    title: 'Report Generated',
    message: 'Compliance report RPT-2026-0842 is ready for download.',
    type: 'success',
    read: false,
    timestamp: '2026-08-28T14:36:00',
  },
  {
    id: 'notif_003',
    title: 'New Rule Update',
    message: 'FSSAI labelling regulations updated. 2 rules modified.',
    type: 'info',
    read: true,
    timestamp: '2026-08-27T09:00:00',
  },
  {
    id: 'notif_004',
    title: 'High Compliance Score',
    message: 'Fortune Sunlite Oil achieved 96% compliance — excellent!',
    type: 'success',
    read: true,
    timestamp: '2026-08-26T09:52:00',
  },
  {
    id: 'notif_005',
    title: 'Review Required',
    message: 'Clinic Plus Shampoo scan has 3 items needing manual review.',
    type: 'warning',
    read: true,
    timestamp: '2026-08-27T10:20:00',
  },
];
