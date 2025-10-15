import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  LinkProps,
  NavLinkProps,
} from 'react-router-dom';
import { useTenantNavigation } from './useTenantNavigation';
import React from 'react';

export const Link: React.FC<LinkProps> = ({ to, ...props }) => {
  const { getTenantPath } = useTenantNavigation();

  const tenantTo = typeof to === 'string' ? getTenantPath(to) : to;

  return <RouterLink to={tenantTo} {...props} />;
};

export const NavLink: React.FC<NavLinkProps> = ({ to, ...props }) => {
  const { getTenantPath } = useTenantNavigation();

  const tenantTo = typeof to === 'string' ? getTenantPath(to) : to;

  return <RouterNavLink to={tenantTo} {...props} />;
};
