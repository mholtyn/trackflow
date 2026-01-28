import { useState } from "react";
import { TrackList } from "@/components/tracks/TrackList";
import { Button } from "@/components/retroui/Button";

interface Track {
  id: string;
  title: string;
  tempo: number;
  genre: string[];
  key?: string | null;
}

const dummyTracks: Track[] = [
  { id: "1", title: "First Track", tempo: 120, genre: ["Pop"], key: "C" },
  { id: "2", title: "Second Track", tempo: 95, genre: ["Hip-Hop", "Rap"], key: null },
];

export default function ProducerTracksPage() {
  const [tracks, setTracks] = useState<Track[]>(dummyTracks);

  const handleEdit = (id: string) => {
    alert(`Edit track ${id} - TODO`);
  };

  const handleDelete = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>My Tracks</h1>
      <TrackList tracks={tracks} onEdit={handleEdit} onDelete={handleDelete} />
      <Button
        variant="default"
        size="md"
        style={{ marginTop: 16 }}
        onClick={() => alert("Add track - TODO")}
      >
        Add Track
      </Button>
    </div>
  );
}