import { FC } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const Error404: FC = () => {
  // Get tenant from URL and check if it's valid
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const currentTenant = pathSegments[0];

  // Get allowed tenants from env
  const allowedTenants =
    import.meta.env.VITE_ALLOWED_TENANTS?.split(',').map((t: string) =>
      t.trim()
    ) || [];

  // Check if current tenant is valid
  const isValidTenant =
    currentTenant &&
    !['error', 'logout', 'auth'].includes(currentTenant) &&
    allowedTenants.includes(currentTenant);

  // Determine where to redirect
  const getHomePath = () => {
    if (isValidTenant) {
      return `/${currentTenant}/dashboard`;
    }
    return '/dashboard'; // Fallback for no tenant
  };

  return (
    <>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2hx text-gray-900 mb-4">Oops!</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className="fw-semibold fs-6 text-gray-500 mb-7">
        We can't find that page.
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className="mb-3">
        <img
          src={toAbsoluteUrl('media/auth/404-error.png')}
          className="mw-100 mh-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl('media/auth/404-error-dark.png')}
          className="mw-100 mh-300px theme-dark-show"
          alt=""
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link - Only show if we have a valid tenant */}
      {isValidTenant && (
        <div className="mb-0">
          <Link to={getHomePath()} className="btn btn-sm btn-primary">
            Return Home
          </Link>
        </div>
      )}
      {/* end::Link */}
    </>
  );
};

export { Error404 };
