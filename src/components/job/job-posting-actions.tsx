"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { JobPosting } from "@/api-config/services/job-postings";
import { Button } from "@/components/ui/button";
import { useDeleteJobPosting } from "@/api-config/queries/job-postings";

interface JobPostingActionsProps {
  jobPosting: JobPosting;
}

export const JobPostingActions = ({ jobPosting }: JobPostingActionsProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: deleteJobPosting, isPending: isDeleting } =
    useDeleteJobPosting();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    try {
      await deleteJobPosting(jobPosting.id);
    } catch (copyError) {
      console.error("Failed to delete job posting:", copyError);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 p-0"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open job actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open ? (
        <div className="bg-popover text-popover-foreground absolute right-0 top-8 z-10 w-52 rounded-md border shadow-md">
          <p className="text-muted-foreground border-b px-3 py-2 text-xs font-semibold">
            Actions
          </p>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-muted disabled:opacity-60"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete job posting
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
};
