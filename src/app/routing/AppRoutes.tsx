// src/app/routing/AppRoutes.tsx
import { FC } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import { ErrorsPage } from '../modules/errors/ErrorsPage';
import { Logout, AuthPage, useAuth } from '../modules/auth';
import { App } from '../App';
import { TenantRoutes } from './TenantRoutes';

const { BASE_URL } = import.meta.env;

const AppRoutes: FC = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter basename={BASE_URL}>
        {' '}
        {/* ← Add this wrapper */}
        <Routes>
          <Route element={<App />}>
            <Route path="error/*" element={<ErrorsPage />} />
            <Route path="logout" element={<Logout />} />

            {/* Root path - show error or client selection */}
            <Route path="/" element={<Navigate to="/error/404" />} />

            {/* Tenant-specific routes */}
            <Route
              path=":clientId/*"
              element={<TenantWrapper currentUser={currentUser} />}
            />

            {/* Catch all - show 404 */}
            <Route path="*" element={<Navigate to="/error/404" />} />
          </Route>
        </Routes>
      {/* ← Add this wrapper */}
    </BrowserRouter>
  );
};

const TenantWrapper: FC<{ currentUser: any }> = ({ currentUser }) => {
  return (
    <TenantRoutes>
      {currentUser ? (
        <>
          <Route path="/*" element={<PrivateRoutes />} />
          <Route index element={<Navigate to="dashboard" />} />
        </>
      ) : (
        <>
          <Route path="auth/*" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="auth" />} />
        </>
      )}
    </TenantRoutes>
  );
};

export { AppRoutes };
