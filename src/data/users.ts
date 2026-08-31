export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  organization: string;
  joinedDate: string;
}

export const currentUser: User = {
  id: 'usr_001',
  name: 'Inspector Arjun',
  email: 'arjun.sharma@compliscan.in',
  avatar: '',
  role: 'Compliance Inspector',
  organization: 'Bureau of Indian Standards',
  joinedDate: '2025-06-15',
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: 'usr_002',
    name: 'Priya Mehta',
    email: 'priya.mehta@compliscan.in',
    avatar: '',
    role: 'Quality Analyst',
    organization: 'FSSAI Regional Office',
    joinedDate: '2025-08-20',
  },
];
