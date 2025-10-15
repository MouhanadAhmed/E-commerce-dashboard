// src/app/routing/TenantRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, useParams, useLocation } from 'react-router-dom';
import { useTenant } from '../../_metronic/helpers/tenantContext';

interface TenantRoutesProps {
  children: React.ReactNode;
}

export const TenantRoutes: React.FC<TenantRoutesProps> = ({ children }) => {
  const { clientId } = useParams<{ clientId?: string }>();
  const { tenant } = useTenant();
  const location = useLocation();

  useEffect(() => {
    if (clientId) {
      (window as any).tenantId = clientId;
    } else if (tenant) {
      (window as any).tenantId = tenant;
    }
  }, [clientId, tenant]);

  // Debug: log current path and tenant
  console.log('Current path:', location.pathname);
  console.log('Tenant context:', tenant);
  console.log('URL param clientId:', clientId);

  return <Routes>{children}</Routes>;
};
