import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface TenantContextType {
  tenant: string | null;
  isValidTenant: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isValidTenant: false,
});

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<string | null>(null);
  const [isValidTenant, setIsValidTenant] = useState<boolean>(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const possibleTenant = pathSegments[0];

    if (possibleTenant && !['error', 'logout'].includes(possibleTenant)) {
      // Get allowed tenants from env
      const allowedTenants =
        import.meta.env.VITE_ALLOWED_TENANTS?.split(',').map((t) => t.trim()) ||
        [];
      const isValid = allowedTenants.includes(possibleTenant);

      setTenant(possibleTenant);
      setIsValidTenant(isValid);

      // Redirect to 404 if invalid tenant
      if (!isValid) {
        window.location.href = '/error/404';
        return;
      }

      (window as any).tenantId = possibleTenant;
    } else {
      setTenant(null);
      setIsValidTenant(false);
    }
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, isValidTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
