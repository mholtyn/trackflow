import { useEffect, useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLabelstaffProfile } from "@/hooks/useLabelstaffProfile";
import { useUpdateLabelstaffProfile } from "@/hooks/useUpdateLabelstaffProfile";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import type {
  LabelStaffProfilePublic,
  LabelStaffProfileUpdate,
  UserUpdate,
} from "@/client";

const sectionStyle =
  "bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden";
const labelStyle = "font-bold block mb-1 text-sm text-slate-800";
const fieldStyle = "mb-4";
const textareaStyle =
  "w-full min-h-[80px] px-4 py-2 rounded border-2 border-black shadow-md transition focus:outline-none focus:shadow-sm";

function toFormProfile(
  p: LabelStaffProfilePublic | null
): LabelStaffProfileUpdate {
  if (!p)
    return {
      bio: null,
      location: null,
      contact_email: null,
      position: null,
      social_links: null,
    };
  return {
    bio: p.bio ?? null,
    location: p.location ?? null,
    contact_email: p.contact_email ?? null,
    position: p.position ?? null,
    social_links: p.social_links ?? null,
  };
}

function toAccountForm(user: {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  gender?: string | null;
} | null): UserUpdate {
  if (!user)
    return {
      email: null,
      username: null,
      first_name: null,
      last_name: null,
      gender: null,
    };
  return {
    email: user.email ?? null,
    username: user.username ?? null,
    first_name: user.first_name ?? null,
    last_name: user.last_name ?? null,
    gender: (user.gender as UserUpdate["gender"]) ?? null,
  };
}

const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "—" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function LabelstaffProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: profile, isLoading: profileLoading } = useLabelstaffProfile();
  const updateProfile = useUpdateLabelstaffProfile();
  const updateUser = useUpdateUser();

  const [accountForm, setAccountForm] = useState<UserUpdate>(() =>
    toAccountForm(user ?? null)
  );
  const [form, setForm] = useState<LabelStaffProfileUpdate>(() =>
    toFormProfile(profile ?? null)
  );

  useEffect(() => {
    setAccountForm(toAccountForm(user ?? null));
  }, [user]);

  useEffect(() => {
    setForm(toFormProfile(profile ?? null));
  }, [profile]);

  const handleAccountChange = (field: keyof UserUpdate, value: string | null) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (
    field: keyof LabelStaffProfileUpdate,
    value: string | Record<string, unknown> | null
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAccount = () => {
    updateUser.mutate(accountForm, { onSuccess: () => {}, onError: () => {} });
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
      <h1 className="text-2xl font-head font-bold">Label Staff Profile</h1>

      {/* Account */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Account
        </h2>
        <div className="p-5">
          <div className={fieldStyle}>
            <label className={labelStyle}>Email</label>
            <Input
              type="email"
              value={accountForm.email ?? ""}
              onChange={(e) => handleAccountChange("email", e.target.value)}
            />
          </div>
          <div className={fieldStyle}>
            <label className={labelStyle}>Username</label>
            <Input
              value={accountForm.username ?? ""}
              onChange={(e) => handleAccountChange("username", e.target.value)}
            />
          </div>
          <div className={fieldStyle}>
            <label className={labelStyle}>First name</label>
            <Input
              value={accountForm.first_name ?? ""}
              onChange={(e) =>
                handleAccountChange("first_name", e.target.value)
              }
            />
          </div>
          <div className={fieldStyle}>
            <label className={labelStyle}>Last name</label>
            <Input
              value={accountForm.last_name ?? ""}
              onChange={(e) =>
                handleAccountChange("last_name", e.target.value)
              }
            />
          </div>
          <div className={fieldStyle}>
            <label className={labelStyle}>Gender</label>
            <select
              value={accountForm.gender ?? ""}
              onChange={(e) =>
                handleAccountChange(
                  "gender",
                  e.target.value || null
                )
              }
              className="w-full px-4 py-2 rounded border-2 border-black shadow-md transition focus:outline-none focus:shadow-sm"
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {updateUser.isError && (
            <p className="mb-4 text-red-600 text-sm">
              Failed to save account. Please try again.
            </p>
          )}
          {updateUser.isSuccess && (
            <p className="mb-4 text-green-700 text-sm">Account saved.</p>
          )}
          <Button
            variant="default"
            size="md"
            onClick={handleSaveAccount}
            disabled={updateUser.isPending}
          >
            {updateUser.isPending ? "Saving…" : "Save account"}
          </Button>
        </div>
      </section>

      {/* Label staff profile form */}
      <section className={sectionStyle}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Label staff profile
        </h2>
        <div className="p-5">
          <div className={fieldStyle}>
            <label className={labelStyle}>Position</label>
            <Input
              value={form.position ?? ""}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </div>

          <div className={fieldStyle}>
            <label className={labelStyle}>Bio</label>
            <textarea
              value={form.bio ?? ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              className={`${textareaStyle} min-h-[80px]`}
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
              onChange={(e) =>
                handleChange("contact_email", e.target.value)
              }
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
              className={`${textareaStyle} min-h-[100px] font-mono text-sm`}
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
        </div>
      </section>
    </div>
  );
}
