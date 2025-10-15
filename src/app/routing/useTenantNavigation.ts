import { useParams } from 'react-router-dom';
import { useTenant } from '../../_metronic/helpers/tenantContext';

export const useTenantNavigation = () => {
  const { clientId } = useParams<{ clientId?: string }>();
  const { tenant } = useTenant();

  const getTenantPath = (path: string): string => {
    const currentTenant = clientId || tenant;
    
    if (!currentTenant) {
      console.warn('No tenant context found for path:', path);
      return path;
    }

    // Remove any existing tenant prefix to avoid duplicates
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const pathWithoutTenant = cleanPath.replace(new RegExp(`^/${currentTenant}`), '');
    
    return `/${currentTenant}${pathWithoutTenant}`;
  };

  const navigateTo = (path: string) => {
    const tenantPath = getTenantPath(path);
    window.location.href = tenantPath;
  };

  return { getTenantPath, navigateTo, currentTenant: clientId || tenant };
};