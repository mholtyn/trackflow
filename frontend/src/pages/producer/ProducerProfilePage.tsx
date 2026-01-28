import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface ProducerProfile {
  artist_name: string;
  music_genre: string[];
  bio?: string;
  location?: string;
  contact_email: string;
  social_links?: Record<string, string>;
}

const dummyProfile: ProducerProfile = {
  artist_name: "John Doe",
  music_genre: ["Pop", "Rock"],
  bio: "John Doe is an example artist bio.",
  location: "Warsaw, Poland",
  contact_email: "john.doe@example.com",
  social_links: {
    twitter: "https://twitter.com/johndoe",
    instagram: "https://instagram.com/johndoe",
  },
};

export default function ProducerProfilePage() {
  const [profile, setProfile] = useState<ProducerProfile>(dummyProfile);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof ProducerProfile, value: string) => {
    if (field === "music_genre") {
      setProfile((p) => ({ ...p, music_genre: value.split(",").map((s) => s.trim()) }));
    } else if (field === "social_links") {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "object" && parsed !== null) {
          setProfile((p) => ({ ...p, social_links: parsed }));
        }
      } catch {
        // ignore invalid JSON input
      }
    } else {
      setProfile((p) => ({ ...p, [field]: value }));
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      alert("Saved profile (dummy)");
      setSaving(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>Producer Profile</h1>

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Artist Name:
      </label>
      <input
        type="text"
        value={profile.artist_name}
        onChange={(e) => handleChange("artist_name", e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8, fontSize: 16 }}
      />

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Music Genres (comma separated):
      </label>
      <input
        type="text"
        value={profile.music_genre.join(", ")}
        onChange={(e) => handleChange("music_genre", e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8, fontSize: 16 }}
      />

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Bio:
      </label>
      <textarea
        value={profile.bio ?? ""}
        onChange={(e) => handleChange("bio", e.target.value)}
        style={{ width: "100%", marginBottom: 16, height: 80, padding: 8, fontSize: 16 }}
      />

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Location:
      </label>
      <input
        type="text"
        value={profile.location ?? ""}
        onChange={(e) => handleChange("location", e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8, fontSize: 16 }}
      />

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Contact Email:
      </label>
      <input
        type="email"
        value={profile.contact_email}
        onChange={(e) => handleChange("contact_email", e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8, fontSize: 16 }}
      />

      <label style={{ fontWeight: "700", display: "block", marginBottom: 4 }}>
        Social Links (JSON):
      </label>
      <textarea
        value={JSON.stringify(profile.social_links ?? {}, null, 2)}
        onChange={(e) => handleChange("social_links", e.target.value)}
        style={{ width: "100%", marginBottom: 16, height: 100, padding: 8, fontSize: 16 }}
      />

      <Button variant="default" size="md" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}