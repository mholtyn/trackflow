import { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";

interface LabelstaffProfile {
  bio: string | null;
  location: string | null;
  contact_email: string;
  position: string | null;
  social_links: Record<string, string> | null;
}

export default function LabelstaffProfilePage() {
  const [profile, setProfile] = useState<LabelstaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data (replace with real API call)
  useEffect(() => {
    async function fetchProfile() {
      try {
        // TODO: podmień na fetch z backendu
        const data: LabelstaffProfile = {
          bio: "Sample bio for John Doe",
          location: "Warsaw, Poland",
          contact_email: "john.doe@example.com",
          position: "Agent",
          social_links: {
            twitter: "https://twitter.com/johndoe",
            linkedin: "https://linkedin.com/in/johndoe",
          },
        };
        setProfile(data);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (key: keyof LabelstaffProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleSocialLinksChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setProfile((prev) => prev && { ...prev, social_links: parsed });
      setError(null);
    } catch {
      setError("Invalid JSON in social links");
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      // TODO: wywołaj API do zapisu profilu
      alert("Saved profile (mock)");
    } catch {
      setError("Failed to save profile");
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error && !profile) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>Labelstaff Profile</h1>

      <label style={{ fontWeight: "bold", marginTop: 16 }}>Bio</label>
      <textarea
        value={profile.bio ?? ""}
        onChange={(e) => handleChange("bio", e.target.value)}
        style={{ width: "100%", height: 80, padding: 8 }}
      />

      <label style={{ fontWeight: "bold", marginTop: 16 }}>Location</label>
      <Input
        value={profile.location ?? ""}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <label style={{ fontWeight: "bold", marginTop: 16 }}>Contact Email</label>
      <Input
        type="email"
        value={profile.contact_email}
        onChange={(e) => handleChange("contact_email", e.target.value)}
      />

      <label style={{ fontWeight: "bold", marginTop: 16 }}>Position</label>
      <Input
        value={profile.position ?? ""}
        onChange={(e) => handleChange("position", e.target.value)}
      />

      <label style={{ fontWeight: "bold", marginTop: 16 }}>
        Social Links (JSON)
      </label>
      <textarea
        value={JSON.stringify(profile.social_links ?? {}, null, 2)}
        onChange={(e) => handleSocialLinksChange(e.target.value)}
        style={{ width: "100%", height: 100, padding: 8 }}
      />

      {error && (
        <div style={{ color: "red", marginTop: 8 }}>
          {error}
        </div>
      )}

      <Button
        variant="default"
        size="md"
        onClick={handleSave}
        style={{ marginTop: 24 }}
      >
        Save
      </Button>
    </div>
  );
}