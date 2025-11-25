"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "@/api-config/services/company";
import { useUpdateCompany } from "@/api-config/queries/company";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "close", label: "Close" },
  { value: "pending", label: "Pending" },
];

interface CompanyStatusProps {
  company: Company;
}

export const CompanyStatus = ({ company }: CompanyStatusProps) => {
  const [status, setStatus] = useState(company.status);
  const [isLocalPending, setIsLocalPending] = useState(false);
  const { mutateAsync: updateCompany, isPending: isUpdating } =
    useUpdateCompany();

  useEffect(() => {
    setStatus(company.status);
  }, [company.id, company.status]);

  const handleStatusChange = async (nextStatus: string) => {
    if (nextStatus === status) {
      return;
    }
    const previousStatus = status;
    setStatus(nextStatus);
    setIsLocalPending(true);

    try {
      await updateCompany({
        companyId: company.id,
        payload: { status: nextStatus },
      });
    } catch (mutationError) {
      console.error("Failed to update company status:", mutationError);
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
