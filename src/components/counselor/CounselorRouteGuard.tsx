import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasValidCounselorAccessSession } from "@/features/counselor/accessSession";

const CounselorRouteGuard = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  if (!hasValidCounselorAccessSession()) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/counselor/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return <>{children}</>;
};

export default CounselorRouteGuard;
