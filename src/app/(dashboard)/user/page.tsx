"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, RefreshCcw, Search } from "lucide-react";

import { useUsers } from "@/api-config/queries/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable } from "@/components/data-table";
import { userColumns } from "@/components/user/user-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const roleOptions = [
  { label: "All roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Recruiter", value: "recruiter" },
  { label: "Researcher", value: "researcher" },
];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const UserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Math.max(Number(searchParams.get("page")) || DEFAULT_PAGE, 1);
  const limit = Math.max(Number(searchParams.get("limit")) || DEFAULT_LIMIT, 1);
  const searchValue = searchParams.get("search") ?? "";
  const roleFilter = searchParams.get("role") ?? "";

  const [searchInput, setSearchInput] = useState(searchValue);

  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  const updateSearchParams = (
    updates: Record<string, string | number | null | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSearch = searchInput.trim();
    updateSearchParams({
      search: trimmedSearch || null,
      page: DEFAULT_PAGE,
    });
  };

  const handleRoleChange = (value: string) => {
    const nextRole = value === "all" ? null : value;
    updateSearchParams({
      role: nextRole,
      page: DEFAULT_PAGE,
    });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    updateSearchParams({
      search: null,
      role: null,
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
    });
  };

  const { data, isPending, isError, error, isFetching } = useUsers({
    page,
    limit,
    search: searchValue || undefined,
    role: roleFilter || undefined,
  });

  const users = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total ?? 0;
  const isTableLoading = isPending || isFetching;

  console.log("users :>> ", users);

  const errorMessage = error?.response?.data?.message || error?.message || null;

  return (
    <div className="p-3 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Users</h1>
        <span className="text-muted-foreground text-sm">
          Review platform users, their roles, and account status
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <form className="flex flex-1 gap-2 min-w-0" onSubmit={handleSearch}>
          <SearchInput
            className="min-w-xs"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            <Search className="size-4" />
            <span className="ml-2">Search</span>
          </Button>
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            <RefreshCcw className="size-4" />
            <span className="ml-2">Reset</span>
          </Button>
        </form>

        <div className="w-full flex gap-2 md:w-[220px]">
          <Label htmlFor="role-filter">Filter by role</Label>
          <Select value={roleFilter || ""} onValueChange={handleRoleChange}>
            <SelectTrigger id="role-filter">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading users...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Failed to fetch users: {errorMessage}
          </div>
        ) : (
          <DataTable
            data={users}
            columns={userColumns}
            total={total}
            isPending={isTableLoading}
          />
        )}
      </Card>
    </div>
  );
};

export default UserPage;
