import { Suspense } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-4">Loading users...</div>}>
      {children}
    </Suspense>
  );
}
