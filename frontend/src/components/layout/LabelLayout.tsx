import { type ReactNode } from "react";
import { Button } from "@/components/retroui/Button";
import { useNavigate, Outlet, Link } from "react-router-dom";

interface LabelLayoutProps {
  children?: ReactNode;
}

export function LabelLayout({ children }: LabelLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: replace with real logout logic (clear auth, redirect)
    alert("Logging out (dummy)");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "2px solid black",
          backgroundColor: "#f3f3f3",
        }}
      >
        <div style={{ fontWeight: "700", fontSize: 24, userSelect: "none" }}>
          Trackflow Labelstaff
        </div>

        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/labelstaff/profile" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="md" asChild>
              <span>Profile</span>
            </Button>
          </Link>
          <Link to="/labelstaff/labels" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="md" asChild>
              <span>Labels</span>
            </Button>
          </Link>
        </nav>

        <Button variant="secondary" size="md" onClick={handleLogout}>
          Logout
        </Button>
      </header>

      <main style={{ flexGrow: 1, padding: 24 }}>
        {children ?? <Outlet />}
      </main>
    </div>
  );
}