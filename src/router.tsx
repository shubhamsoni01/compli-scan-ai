import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
const AppLayout = lazy(() => import('@/layouts/AppLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const LandingLayout = lazy(() => import('@/layouts/LandingLayout'));

// Pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ScanPage = lazy(() => import('@/pages/ScanPage'));
const ComplianceResultPage = lazy(() => import('@/pages/ComplianceResultPage'));
const DetailedResultPage = lazy(() => import('@/pages/DetailedResultPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const RulesPage = lazy(() => import('@/pages/RulesPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const DevelopmentPage = lazy(() => import('@/pages/DevelopmentPage'));
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function LazyFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-surface-500">Loading…</p>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LazyFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <LandingLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'development',
        element: (
          <SuspenseWrapper>
            <DevelopmentPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AppLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'scan',
        element: (
          <SuspenseWrapper>
            <ScanPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'result/:scanId',
        element: (
          <SuspenseWrapper>
            <ComplianceResultPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'result/:scanId/detail',
        element: (
          <SuspenseWrapper>
            <DetailedResultPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'history',
        element: (
          <SuspenseWrapper>
            <HistoryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reports',
        element: (
          <SuspenseWrapper>
            <ReportsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'rules',
        element: (
          <SuspenseWrapper>
            <RulesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'analytics',
        element: (
          <SuspenseWrapper>
            <AnalyticsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
