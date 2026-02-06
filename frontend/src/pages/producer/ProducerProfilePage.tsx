import { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProducerProfile } from "@/hooks/useProducerProfile";
import { useUpdateProducerProfile } from "@/hooks/useUpdateProducerProfile";
import type { ProducerProfilePublic, ProducerProfileUpdate } from "@/client";

const sectionStyle =
  "bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-6";
const labelStyle = "font-bold block mb-1 text-sm text-slate-800";
const fieldStyle = "mb-4";

function toFormProfile(p: ProducerProfilePublic | null): ProducerProfileUpdate {
  if (!p)
    return {
      artist_name: null,
      music_genre: null,
      bio: null,
      location: null,
      contact_email: null,
      social_links: null,
    };
  return {
    artist_name: p.artist_name ?? null,
    music_genre: p.music_genre ?? null,
    bio: p.bio ?? null,
    location: p.location ?? null,
    contact_email: p.contact_email ?? null,
    social_links: p.social_links ?? null,
  };
}

export default function ProducerProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useProducerProfile();
  const updateProfile = useUpdateProducerProfile();

  const [form, setForm] = useState<ProducerProfileUpdate>(() =>
    toFormProfile(profile ?? null)
  );

  useEffect(() => {
    setForm(toFormProfile(profile ?? null));
  }, [profile]);

  const handleChange = (
    field: keyof ProducerProfileUpdate,
    value: string | string[] | Record<string, unknown> | null
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile.mutate(form, {
      onSuccess: () => {},
      onError: () => {},
    });
  };

  const isLoading = userLoading || profileLoading;
  if (isLoading)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-slate-500">
        Loading profile…
      </div>
    );

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-head font-bold">Producer Profile</h1>

      {/* User info */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold mb-4 border-b-2 border-black pb-2">
          Account
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium text-slate-600">Username:</span>{" "}
            {user?.username ?? "—"}
          </li>
          <li>
            <span className="font-medium text-slate-600">User ID:</span>{" "}
            <span className="font-mono text-slate-700">{user?.id ?? "—"}</span>
          </li>
          <li>
            <span className="font-medium text-slate-600">Created:</span>{" "}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "—"}
          </li>
          <li>
            <span className="font-medium text-slate-600">Type:</span>{" "}
            {user?.user_type ?? "—"}
          </li>
        </ul>
      </section>

      {/* Producer profile form */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold mb-4 border-b-2 border-black pb-2">
          Artist profile
        </h2>

        <div className={fieldStyle}>
          <label className={labelStyle}>Artist name</label>
          <Input
            value={form.artist_name ?? ""}
            onChange={(e) => handleChange("artist_name", e.target.value)}
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle}>
            Music genres (comma separated)
          </label>
          <Input
            value={(form.music_genre ?? []).join(", ")}
            onChange={(e) =>
              handleChange(
                "music_genre",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle}>Bio</label>
          <textarea
            value={form.bio ?? ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full min-h-[80px] px-4 py-2 rounded border-2 shadow-md transition focus:outline-none focus:shadow-sm border-slate-300"
            placeholder="Short bio"
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle}>Location</label>
          <Input
            value={form.location ?? ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle}>Contact email</label>
          <Input
            type="email"
            value={form.contact_email ?? ""}
            onChange={(e) => handleChange("contact_email", e.target.value)}
          />
        </div>

        <div className={fieldStyle}>
          <label className={labelStyle}>Social links (JSON)</label>
          <textarea
            value={JSON.stringify(form.social_links ?? {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(
                  "social_links",
                  typeof parsed === "object" && parsed !== null
                    ? (parsed as Record<string, unknown>)
                    : null
                );
              } catch {
                // keep previous on invalid JSON
              }
            }}
            className="w-full min-h-[100px] px-4 py-2 rounded border-2 shadow-md transition focus:outline-none focus:shadow-sm border-slate-300 font-mono text-sm"
          />
        </div>

        {updateProfile.isError && (
          <p className="mb-4 text-red-600 text-sm">
            Failed to save. Please try again.
          </p>
        )}
        {updateProfile.isSuccess && (
          <p className="mb-4 text-green-700 text-sm">Profile saved.</p>
        )}

        <Button
          variant="default"
          size="md"
          onClick={handleSave}
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? "Saving…" : "Save profile"}
        </Button>
      </section>
    </div>
  );
}
