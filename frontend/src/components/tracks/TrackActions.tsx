import { Button } from "@/components/retroui/Button";

interface TrackActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function TrackActions({ onEdit, onDelete }: TrackActionsProps) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
      <Button variant="secondary" size="sm" onClick={onDelete}>Delete</Button>
    </div>
  );
}