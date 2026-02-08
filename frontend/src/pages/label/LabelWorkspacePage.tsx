import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/retroui/Button";
import { useLabelSubmissions } from "@/hooks/useLabelSubmissions";
import { useLabelSubmissionEvents } from "@/hooks/useLabelSubmissionEvents";
import {
  useStartReview,
  useShortlist,
  useAccept,
  useReject,
} from "@/hooks/useLabelSubmissionTransitions";
import type { SubmissionEventPublic } from "@/client";

const sectionStyle =
  "bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden";
const cardStyle =
  "block w-full text-left px-5 py-4 border-b-2 border-black last:border-b-0 bg-white hover:bg-[#f8f8f8] transition cursor-pointer";
const cardStyleSelected =
  "block w-full text-left px-5 py-4 border-b-2 border-black last:border-b-0 bg-[#e8f4ff] border-l-4 border-l-blue-600 cursor-pointer";

function eventActorLabel(e: SubmissionEventPublic): string {
  if (e.labelstaff_profile_id) return "Label staff";
  if (e.producer_profile_id) return "Producer";
  return "System";
}

export default function LabelWorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: submissions = [], isLoading, isError } = useLabelSubmissions(workspaceId);
  const { data: allEvents = [] } = useLabelSubmissionEvents(workspaceId);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const startReview = useStartReview(workspaceId);
  const shortlist = useShortlist(workspaceId);
  const accept = useAccept(workspaceId);
  const reject = useReject(workspaceId);

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId) ?? null;
  const eventsForSelected = useMemo(
    () =>
      selectedSubmissionId
        ? allEvents
            .filter((e) => e.submission_id === selectedSubmissionId)
            .sort(
              (a, b) =>
                new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
            )
        : [],
    [allEvents, selectedSubmissionId]
  );

  const runTransition = (
    mutation: { mutate: (id: string) => void; isPending: boolean },
    id: string
  ) => {
    if (mutation.isPending) return;
    mutation.mutate(id);
  };

  if (!workspaceId)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-red-600">
        Missing workspace.
      </div>
    );

  if (isLoading)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-slate-500">
        Loading submissions…
      </div>
    );

  if (isError)
    return (
      <div className="max-w-[720px] mx-auto p-6 text-red-600">
        Failed to load submissions.
      </div>
    );

  return (
    <div className="max-w-[960px] mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-head font-bold">Workspace</h1>
        {/* Admin link: show to all; restrict to admin when GET .../memberships/me exists */}
        <Link to={`/labelstaff/labels/${workspaceId}/admin`}>
          <Button variant="outline" size="sm">
            Admin
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      {/* Submissions list */}
      <section className={`${sectionStyle} flex-1 min-w-0`}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          Submissions
        </h2>
        <div>
          {submissions.length === 0 ? (
            <p className="px-5 py-6 text-slate-600 text-sm">
              No submissions in this workspace yet.
            </p>
          ) : (
            submissions.map((s) => (
              <button
                key={s.id}
                type="button"
                className={
                  s.id === selectedSubmissionId ? cardStyleSelected : cardStyle
                }
                onClick={() => setSelectedSubmissionId(s.id)}
              >
                <span className="font-medium">{s.title}</span>
                <span className="text-slate-600 text-sm ml-2">— {s.status}</span>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Detail + actions + history */}
      <section className={`${sectionStyle} flex-1 min-w-0`}>
        <h2 className="text-lg font-semibold border-b-2 border-black bg-[#f3f3f3] px-5 py-3">
          {selectedSubmission
            ? `Actions & history — ${selectedSubmission.title}`
            : "Actions & history"}
        </h2>
        <div className="p-5">
          {selectedSubmission ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Status: <strong>{selectedSubmission.status}</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      selectedSubmission.status === "IN_REVIEW"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => runTransition(startReview, selectedSubmission.id)}
                    disabled={startReview.isPending}
                  >
                    {startReview.isPending ? "…" : "Start review"}
                  </Button>
                  <Button
                    variant={
                      selectedSubmission.status === "SHORTLISTED"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => runTransition(shortlist, selectedSubmission.id)}
                    disabled={shortlist.isPending}
                  >
                    {shortlist.isPending ? "…" : "Shortlist"}
                  </Button>
                  <Button
                    variant={
                      selectedSubmission.status === "ACCEPTED"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => runTransition(accept, selectedSubmission.id)}
                    disabled={accept.isPending}
                  >
                    {accept.isPending ? "…" : "Accept"}
                  </Button>
                  <Button
                    variant={
                      selectedSubmission.status === "REJECTED"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => runTransition(reject, selectedSubmission.id)}
                    disabled={reject.isPending}
                  >
                    {reject.isPending ? "…" : "Reject"}
                  </Button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mt-4 mb-2">
                History
              </h3>
              <ul className="list-none p-0 text-sm">
                {eventsForSelected.length === 0 ? (
                  <li className="text-slate-500">No events yet.</li>
                ) : (
                  eventsForSelected.map((e) => (
                    <li key={e.id} className="mb-2">
                      <span className="text-slate-500">
                        [{e.event_date.slice(0, 10)}]
                      </span>{" "}
                      {eventActorLabel(e)} → <strong>{e.status}</strong>
                    </li>
                  ))
                )}
              </ul>
            </>
          ) : (
            <p className="text-slate-600 text-sm">
              Select a submission to see actions and history.
            </p>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
