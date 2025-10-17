import { useNavigate } from 'react-router-dom';
import { useTenantNavigation } from './useTenantNavigation';

export const useTenantNavigate = () => {
  const navigate = useNavigate();
  const { getTenantPath } = useTenantNavigation();

  const tenantNavigate = (to: string, options?: any) => {
    const tenantTo = getTenantPath(to);
    navigate(tenantTo, options);
  };

  return tenantNavigate;
};
