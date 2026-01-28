import { useState } from "react";
import { Button } from "@/components/retroui/Button";

interface Membership {
  id: string;
  username: string;
  role: string;
}

export default function LabelAdminSettingsPage() {
  // Dummy label data
  const [labelName, setLabelName] = useState("Awesome Label");
  const [labelDescription, setLabelDescription] = useState("Label description here");

  // Dummy memberships
  const [memberships, setMemberships] = useState<Membership[]>([
    { id: "1", username: "user_one", role: "admin" },
    { id: "2", username: "user_two", role: "agent" },
  ]);

  const handleSave = () => {
    // TODO: Wywołać API do zapisania zmian
    alert("Saved!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Label Admin Settings</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="labelName">Label Name</label>
        <input
          id="labelName"
          type="text"
          className="w-full border border-gray-400 rounded px-3 py-2"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="labelDescription">Description</label>
        <textarea
          id="labelDescription"
          className="w-full border border-gray-400 rounded px-3 py-2"
          value={labelDescription}
          onChange={(e) => setLabelDescription(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Memberships</h2>
      <table className="w-full mb-6 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map(({ id, username, role }) => (
            <tr key={id}>
              <td className="border border-gray-300 px-4 py-2">{username}</td>
              <td className="border border-gray-300 px-4 py-2">{role}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setMemberships((prev) => prev.filter((m) => m.id !== id));
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
          {memberships.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                No members yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Button variant="default" size="md" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
}