import { type ReactNode, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkspaceMyRole } from "@/hooks/useWorkspaceMyRole";

interface AdminRouteGuardProps {
  children: ReactNode;
}

/**
 * Protects label admin routes: only users with admin role in the workspace may see the content.
 * Redirects non-admins and non-members to the workspace page (not admin).
 */
export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { data: membership, isLoading, isError } = useWorkspaceMyRole(workspaceId);

  useEffect(() => {
    if (!workspaceId) {
      navigate("/labelstaff/labels", { replace: true });
      return;
    }
    if (isLoading) return;
    if (isError || !membership || membership.role !== "admin") {
      navigate(`/labelstaff/labels/${workspaceId}`, { replace: true });
    }
  }, [workspaceId, isLoading, isError, membership, navigate]);

  if (!workspaceId) return null;
  if (isLoading) {
    return (
      <div className="max-w-[720px] mx-auto p-6 text-slate-500">
        Loading…
      </div>
    );
  }
  if (isError || !membership || membership.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
