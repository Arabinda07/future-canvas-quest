import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface CounselorRouteGuardProps {
  children: React.ReactNode;
}

const CounselorRouteGuard = ({ children }: CounselorRouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ pathname: "/counselor/login", search: location.search });
    }
  }, [session, loading, navigate, location.search]);

  if (loading) return null;
  if (!session) return null;

  return <>{children}</>;
};

export default CounselorRouteGuard;
