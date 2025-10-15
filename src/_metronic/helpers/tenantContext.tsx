// src/app/context/tenantContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface TenantContextType {
  tenant: string | null;
}

const TenantContext = createContext<TenantContextType>({ tenant: null });

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const possibleTenant = pathSegments[0];

    // Only set tenant if we have a valid client ID in the URL
    // Don't set tenant for root path or invalid paths
    if (possibleTenant && !['error', 'logout'].includes(possibleTenant)) {
      setTenant(possibleTenant);
      (window as any).tenantId = possibleTenant;
    } else {
      setTenant(null);
      (window as any).tenantId = null;
    }
  }, []);

  return (
    <TenantContext.Provider value={{ tenant }}>
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
