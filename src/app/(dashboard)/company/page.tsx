"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, RefreshCcw, Search } from "lucide-react";
import { useCompanies } from "@/api-config/queries/company";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable } from "@/components/data-table";
import { companyColumns } from "@/components/company/company-columns";

const Company = () => {
  const { data, isPending, isError, error } = useCompanies();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim().toLowerCase());
  };

  const companies = data?.data ?? [];

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) {
      return companies;
    }

    return companies.filter((company) => {
      const tokens = [
        company.name,
        company.industry?.name,
        company.status,
        company.recruiters?.map((recruiter) => recruiter.name).join(" "),
      ];

      return tokens.some((token) => token?.toLowerCase().includes(searchTerm));
    });
  }, [companies, searchTerm]);

  const errorMessage =
    (error as any)?.response?.data?.message || error?.message || null;

  return (
    <div className="p-3 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Companies</h1>
        <span className="text-muted-foreground text-sm">
          Review, approve, or remove companies across the platform
        </span>
      </div>

      <form className="flex gap-2" onSubmit={handleSearch}>
        <SearchInput
          className="min-w-xs"
          placeholder="Search by company, industry, or recruiter..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button className="ml-2" type="submit" disabled={isPending}>
          <Search />
          <span>Search</span>
        </Button>
        <Button variant="outline" onClick={() => setSearchInput("")}>
          <RefreshCcw />
          <span>Reset</span>
        </Button>
      </form>

      <Card className="p-4">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading companies...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Failed to fetch companies: {errorMessage}
          </div>
        ) : (
          <DataTable
            data={filteredCompanies}
            columns={companyColumns}
            total={filteredCompanies.length}
            isPending={isPending}
          />
        )}
      </Card>
    </div>
  );
};

export default Company;
