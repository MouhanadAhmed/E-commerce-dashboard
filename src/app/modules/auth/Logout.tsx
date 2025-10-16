import { useEffect } from "react";
import { Navigate, Routes } from "react-router-dom";
import { useAuth } from "./core/Auth";
import { useTenantNavigation } from "../../routing/useTenantNavigation";

export function Logout() {
  const { logout } = useAuth();
  const { getTenantPath } = useTenantNavigation();
  useEffect(() => {
    logout();
    document.location.reload();
  }, [logout]);

  return (
    <Routes>
      <Navigate to={getTenantPath('/auth/login')} />
    </Routes>
  );
}
