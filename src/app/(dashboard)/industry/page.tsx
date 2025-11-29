"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  useCreateIndustry,
  useIndustries,
} from "@/api-config/queries/industry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { industryColumns } from "@/components/industry/industry-column";

const Industry = () => {
  const { data, isPending, isError, error } = useIndustries();
  const { mutateAsync: createIndustry, isPending: isCreating } =
    useCreateIndustry();
  const [industryName, setIndustryName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveIndustry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!industryName.trim()) {
      return;
    }
    try {
      await createIndustry({ name: industryName.trim() });
      setIndustryName("");
      setIsDialogOpen(false);
    } catch (mutationError) {
      console.error("Failed to create industry:", mutationError);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim().toLowerCase());
  };

  const industries = data?.data ?? [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredIndustries = useMemo(() => {
    if (!searchTerm) {
      return industries;
    }

    return industries.filter((industry) =>
      industry.name.toLowerCase().includes(searchTerm)
    );
  }, [industries, searchTerm]);

  return (
    <div className="p-3 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Industry Page</h1>
        <span className="text-muted-foreground text-sm">
          Manage your industry categories
        </span>
      </div>

      <div className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              <span>Add New Industry</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new industry</DialogTitle>
              <DialogDescription>
                Provide the industry name and optional description to add it to
                the catalog.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSaveIndustry}>
              <div className="space-y-4">
                <Label htmlFor="industry-name">Industry name</Label>
                <Input
                  id="industry-name"
                  placeholder="e.g. Information Technology"
                  value={industryName}
                  onChange={(event) => setIndustryName(event.target.value)}
                  disabled={isCreating}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Industry"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <form className="flex gap-2" onSubmit={handleSearch}>
          <SearchInput
            className="min-w-xs"
            placeholder="Search by industry name..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button className="ml-2" type="submit" disabled={isPending}>
            Search
          </Button>
          <Button variant="outline" onClick={() => setSearchInput("")}>
            <RefreshCcw />
            <span>Reset</span>
          </Button>
        </form>
      </div>

      <Card className="p-4">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading industries...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Failed to fetch industries: {error.message}
          </div>
        ) : (
          <DataTable
            data={filteredIndustries}
            columns={industryColumns}
            total={filteredIndustries.length}
            isPending={isPending}
          />
        )}
      </Card>
    </div>
  );
};

export default Industry;
