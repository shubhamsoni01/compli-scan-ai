import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastProvider } from '@/components/ui/Toast';
import { recordVisit } from '@/services/api';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  useEffect(() => {
    // Record anonymous visitor session in MongoDB
    recordVisit();
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
