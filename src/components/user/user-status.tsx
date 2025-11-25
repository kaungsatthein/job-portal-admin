"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserStatusValue } from "@/api-config/services/user";
import { useUpdateUserStatus } from "@/api-config/queries/user";

const statusOptions: { value: UserStatusValue; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DELETE", label: "Deleted" },
];

interface UserStatusProps {
  user: User;
}

export const UserStatus = ({ user }: UserStatusProps) => {
  const [status, setStatus] = useState<UserStatusValue>(
    (user.status?.toUpperCase() as UserStatusValue) || "ACTIVE"
  );
  const [isLocalPending, setIsLocalPending] = useState(false);
  const { mutateAsync: updateStatus, isPending } = useUpdateUserStatus();

  useEffect(() => {
    setStatus((user.status?.toUpperCase() as UserStatusValue) || "ACTIVE");
  }, [user.status]);

  const handleChange = async (nextStatus: UserStatusValue) => {
    if (nextStatus === status) {
      return;
    }

    const previousStatus = status;
    setStatus(nextStatus);
    setIsLocalPending(true);

    try {
      await updateStatus({ userId: user.id, status: nextStatus });
    } catch (error) {
      console.error("Failed to update user status:", error);
      setStatus(previousStatus);
    } finally {
      setIsLocalPending(false);
    }
  };

  return (
    <Select
      value={status}
      onValueChange={(value) => handleChange(value as UserStatusValue)}
      disabled={isPending || isLocalPending}
    >
      <SelectTrigger className="w-[120px] justify-between">
        <SelectValue placeholder="Status" />
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
