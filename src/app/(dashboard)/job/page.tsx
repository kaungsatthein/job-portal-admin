"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable } from "@/components/data-table";
import { jobPostingColumns } from "@/components/job-posting-columns";
import { useJobPostings } from "@/api-config/queries/job-postings";

const Job = () => {
  const { data, isPending, isError, error } = useJobPostings();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim().toLowerCase());
  };

  const jobPostings = data?.data ?? [];

  const filteredJobPostings = useMemo(() => {
    if (!searchTerm) return jobPostings;

    return jobPostings.filter((posting) => {
      const tokens = [
        posting.title,
        posting.location,
        posting.company?.name,
        posting.status,
      ];

      return tokens.some((token) =>
        token?.toLowerCase().includes(searchTerm)
      );
    });
  }, [jobPostings, searchTerm]);

  const errorMessage =
    (error as any)?.response?.data?.message || error?.message || null;

  return (
    <div className="p-3 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Job Postings</h1>
        <span className="text-muted-foreground text-sm">
          Review and manage all job postings across companies
        </span>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <SearchInput
          className="min-w-xs"
          placeholder="Search by title, company, or location..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button className="ml-2" type="submit" disabled={isPending}>
          Search
        </Button>
      </form>

      <Card className="p-4">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading job postings...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Failed to fetch job postings: {errorMessage}
          </div>
        ) : (
          <DataTable
            data={filteredJobPostings}
            columns={jobPostingColumns}
            total={filteredJobPostings.length}
            isPending={isPending}
          />
        )}
      </Card>
    </div>
  );
};

export default Job;
