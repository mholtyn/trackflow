import { type ReactNode } from "react";
import { Button } from "@/components/retroui/Button";
import { useNavigate, Outlet, Link } from "react-router-dom";

interface ProducerLayoutProps {
  children?: ReactNode;
}

export function ProducerLayout({ children }: ProducerLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: replace with real logout logic (e.g. clear auth, redirect)
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
          Trackflow Producer
        </div>

        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/producer/submissions" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="md" asChild>
              <span>Submissions</span>
            </Button>
          </Link>
          <Link to="/producer/tracks" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="md" asChild>
              <span>Tracks</span>
            </Button>
          </Link>
          <Link to="/producer/profile" style={{ textDecoration: "none" }}>
            <Button variant="outline" size="md" asChild>
              <span>Profile</span>
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