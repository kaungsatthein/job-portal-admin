"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobPosting } from "@/api-config/services/job-postings";
import { useUpdateJobPosting } from "@/api-config/queries/job-postings";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
  { value: "pending", label: "Pending" },
];

interface JobPostingStatusProps {
  jobPosting: JobPosting;
}

export const JobPostingStatus = ({ jobPosting }: JobPostingStatusProps) => {
  const [status, setStatus] = useState(jobPosting.status);
  const [isLocalPending, setIsLocalPending] = useState(false);
  const { mutateAsync: updateJobPosting, isPending: isUpdating } =
    useUpdateJobPosting();

  useEffect(() => {
    setStatus(jobPosting.status);
  }, [jobPosting.status]);

  const handleStatusChange = async (nextStatus: string) => {
    if (nextStatus === status) return;

    const previousStatus = status;
    setStatus(nextStatus);
    setIsLocalPending(true);

    try {
      await updateJobPosting({
        jobPostingId: jobPosting.id,
        payload: { status: nextStatus },
      });
    } catch (mutationError) {
      console.error("Failed to update job status:", mutationError);
      setStatus(previousStatus);
    } finally {
      setIsLocalPending(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating || isLocalPending}
    >
      <SelectTrigger className="w-[120px] justify-between">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
