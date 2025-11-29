"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Building2,
  Layers3,
  Loader2,
  Users,
} from "lucide-react";
import { useCompanies } from "@/api-config/queries/company";
import { useIndustries } from "@/api-config/queries/industry";
import { useJobPostings } from "@/api-config/queries/job-postings";
import { useUsers } from "@/api-config/queries/user";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Company } from "@/api-config/services/company";
import type { Industry } from "@/api-config/services/industry";
import type { JobPosting } from "@/api-config/services/job-postings";

const numberFormatter = new Intl.NumberFormat("en-US");

const formatPercentage = (value: number, total: number) => {
  if (!total) return "0%";
  const percent = Math.round((value / total) * 100);
  return `${percent}%`;
};

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: T[] }).data) ?? [];
  }

  return [];
};

const DashboardPage = () => {
  const {
    data: companyResponse,
    isPending: companiesPending,
    isError: companiesError,
    error: companiesErrorDetails,
  } = useCompanies();
  const {
    data: industryResponse,
    isPending: industriesPending,
    isError: industriesError,
    error: industriesErrorDetails,
  } = useIndustries();
  const {
    data: jobResponse,
    isPending: jobsPending,
    isError: jobsError,
    error: jobsErrorDetails,
  } = useJobPostings();
  const {
    data: userResponse,
    isPending: usersPending,
    isError: usersError,
    error: usersErrorDetails,
  } = useUsers({ page: 1, limit: 100 });

  const companies = toArray<Company>(companyResponse?.data);
  const industries = toArray<Industry>(industryResponse?.data);
  const jobPostings = toArray<JobPosting>(jobResponse?.data);
  const usersPayload = userResponse?.data;
  const users = usersPayload?.data ?? [];
  const totalUsers = usersPayload?.pagination?.total ?? users.length;

  const companyStatusCounts = useMemo(() => {
    return companies.reduce<Record<string, number>>((acc, company) => {
      const key = (company.status ?? "unknown").toLowerCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [companies]);

  const jobStatusCounts = useMemo(() => {
    return jobPostings.reduce<Record<string, number>>((acc, posting) => {
      const key = (posting.status ?? "unknown").toLowerCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [jobPostings]);

  const userStatusCounts = useMemo(() => {
    return users.reduce<Record<string, number>>((acc, user) => {
      const key = (user.status ?? "UNKNOWN").toUpperCase();
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }, [users]);

  const openCompanies = companyStatusCounts["open"] ?? 0;
  const closedCompanies = companyStatusCounts["close"] ?? 0;
  const pendingCompanies = companyStatusCounts["pending"] ?? 0;

  const openJobs = jobStatusCounts["open"] ?? 0;
  const closedJobs = jobStatusCounts["close"] ?? 0;
  const pendingJobs = jobStatusCounts["pending"] ?? 0;

  const activeUsers = userStatusCounts["ACTIVE"] ?? 0;
  const deletedUsers = userStatusCounts["DELETE"] ?? 0;

  const industriesWithCompanies = useMemo(() => {
    const mapped = new Set(
      companies.map((company) => company.industryId).filter(Boolean)
    );
    return mapped.size;
  }, [companies]);

  const uniqueHiringCompanies = useMemo(() => {
    const ids = jobPostings
      .map((posting) => posting.companyId)
      .filter(Boolean) as string[];
    return new Set(ids).size;
  }, [jobPostings]);

  const metricCards = useMemo(() => {
    return [
      {
        label: "Companies",
        description: `${openCompanies} open • ${pendingCompanies} pending`,
        value: companies.length,
        change: `${formatPercentage(
          openCompanies,
          Math.max(companies.length, 1)
        )} open`,
        trend:
          openCompanies >= closedCompanies
            ? ("up" as const)
            : ("down" as const),
        icon: Building2,
      },
      {
        label: "Industries",
        description: `${industriesWithCompanies} seeded with partners`,
        value: industries.length,
        change:
          industriesWithCompanies && industries.length
            ? `${formatPercentage(
                industriesWithCompanies,
                industries.length
              )} active`
            : "0% active",
        trend:
          industriesWithCompanies >= industries.length / 2
            ? ("up" as const)
            : ("down" as const),
        icon: Layers3,
      },
      {
        label: "Jobs",
        description: `${openJobs} open • ${pendingJobs} pending`,
        value: jobPostings.length,
        change: `${formatPercentage(
          openJobs,
          Math.max(jobPostings.length, 1)
        )} open`,
        trend: openJobs >= closedJobs ? ("up" as const) : ("down" as const),
        icon: Briefcase,
      },
      {
        label: "Users",
        description: `${activeUsers} active • ${deletedUsers} archived`,
        value: totalUsers,
        change:
          users.length > 0
            ? `${formatPercentage(
                activeUsers,
                Math.max(users.length, 1)
              )} on this sample`
            : "Awaiting sync",
        trend:
          activeUsers >= deletedUsers ? ("up" as const) : ("down" as const),
        icon: Users,
      },
    ];
  }, [
    openCompanies,
    pendingCompanies,
    companies.length,
    closedCompanies,
    industriesWithCompanies,
    industries.length,
    openJobs,
    pendingJobs,
    jobPostings.length,
    closedJobs,
    activeUsers,
    deletedUsers,
    totalUsers,
    users.length,
  ]);

  const chartData = useMemo(() => {
    return [
      {
        label: "Companies",
        value: companies.length,
        change: `${formatPercentage(
          openCompanies,
          Math.max(companies.length, 1)
        )} open`,
        color: "var(--chart-1)",
      },
      {
        label: "Industries",
        value: industries.length,
        change:
          industriesWithCompanies && industries.length
            ? `${formatPercentage(
                industriesWithCompanies,
                industries.length
              )} active`
            : "0% active",
        color: "var(--chart-2)",
      },
      {
        label: "Jobs",
        value: jobPostings.length,
        change: `${formatPercentage(
          openJobs,
          Math.max(jobPostings.length, 1)
        )} open`,
        color: "var(--chart-3)",
      },
      {
        label: "Users",
        value: totalUsers,
        change:
          users.length > 0
            ? `${formatPercentage(
                activeUsers,
                Math.max(users.length, 1)
              )} active sample`
            : "Awaiting sync",
        color: "var(--chart-4)",
      },
    ];
  }, [
    companies.length,
    industries.length,
    industriesWithCompanies,
    jobPostings.length,
    totalUsers,
    openCompanies,
    openJobs,
    users.length,
    activeUsers,
  ]);

  const chartValues = chartData.map((item) => item.value);
  const chartMax = chartValues.length ? Math.max(...chartValues) : 1;

  const industryFocus = useMemo(() => {
    const jobsByCompany = jobPostings.reduce<Map<string, number>>(
      (acc, posting) => {
        if (!posting.companyId) return acc;
        acc.set(posting.companyId, (acc.get(posting.companyId) ?? 0) + 1);
        return acc;
      },
      new Map()
    );

    const statsMap = new Map<
      string,
      { name: string; companies: number; jobs: number }
    >();

    industries.forEach((industry) => {
      statsMap.set(industry.id, {
        name: industry.name,
        companies: 0,
        jobs: 0,
      });
    });

    companies.forEach((company) => {
      const industryId = company.industryId ?? "unassigned";
      const fallbackName =
        company.industry?.name ??
        industries.find((industry) => industry.id === industryId)?.name ??
        "Unassigned";
      const entry =
        statsMap.get(industryId) ??
        ({
          name: fallbackName,
          companies: 0,
          jobs: 0,
        } as { name: string; companies: number; jobs: number });
      entry.companies += 1;
      entry.jobs +=
        jobsByCompany.get(company.id) ?? company.jobPostings?.length ?? 0;
      statsMap.set(industryId, entry);
    });

    return Array.from(statsMap.values())
      .filter((entry) => entry.companies > 0)
      .sort((a, b) => b.jobs - a.jobs || b.companies - a.companies)
      .slice(0, 4);
  }, [companies, industries, jobPostings]);

  const industryMaxJobs = industryFocus.length
    ? Math.max(...industryFocus.map((entry) => entry.jobs || 0))
    : 1;

  const activityFeed = useMemo(() => {
    return [
      {
        title: `${pendingCompanies} companies awaiting review`,
        body: `${numberFormatter.format(
          openCompanies
        )} active • ${numberFormatter.format(closedCompanies)} paused`,
        time: "Synced moments ago",
        accent: "var(--chart-1)",
      },
      {
        title: `${pendingJobs + closedJobs} jobs need attention`,
        body: `${numberFormatter.format(
          openJobs
        )} listings are open across ${numberFormatter.format(
          uniqueHiringCompanies
        )} companies`,
        time: "Auto-refresh",
        accent: "var(--chart-2)",
      },
      {
        title: `${numberFormatter.format(activeUsers)} active talent profiles`,
        body: `${numberFormatter.format(
          deletedUsers
        )} archived during the latest sync window`,
        time: "Today",
        accent: "var(--chart-4)",
      },
    ];
  }, [
    pendingCompanies,
    openCompanies,
    closedCompanies,
    pendingJobs,
    closedJobs,
    openJobs,
    uniqueHiringCompanies,
    activeUsers,
    deletedUsers,
  ]);

  const isLoading =
    companiesPending || industriesPending || jobsPending || usersPending;

  const errorEntry = [
    { isError: companiesError, error: companiesErrorDetails },
    { isError: industriesError, error: industriesErrorDetails },
    { isError: jobsError, error: jobsErrorDetails },
    { isError: usersError, error: usersErrorDetails },
  ].find((entry) => entry.isError);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Syncing dashboard insights...
      </div>
    );
  }

  if (errorEntry?.error) {
    const message = getApiErrorMessage(
      errorEntry.error,
      "Unable to load dashboard data."
    );
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-sm text-destructive">{message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Marketplace overview</h1>
        <p className="text-muted-foreground text-sm">
          Live insight into companies, industries, jobs, and users across the
          platform.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon =
            metric.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <Card key={metric.label} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{metric.label}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </div>
                <span className="rounded-full bg-muted p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-3xl font-semibold">
                    {numberFormatter.format(metric.value)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Snapshot updated with live data
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    metric.trend === "up"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200"
                  }`}
                >
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Category performance</CardTitle>
            <CardDescription>
              Company, industry, job, and user movement from the latest pull
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex h-64 items-end gap-6 rounded-xl bg-muted/40 p-6">
              {chartData.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div className="flex w-full items-end justify-center rounded-xl bg-background/80 p-2">
                    <div
                      className="w-10 rounded-lg"
                      style={{
                        height: `${
                          chartMax
                            ? Math.max((item.value / chartMax) * 100, 5)
                            : 5
                        }%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold">
                      {numberFormatter.format(item.value)}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Hiring signal
                </p>
                <p className="text-foreground text-sm">
                  {formatPercentage(
                    openCompanies,
                    Math.max(companies.length, 1)
                  )}{" "}
                  of companies currently have open roles, with{" "}
                  {numberFormatter.format(pendingCompanies)} waiting for
                  approval.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Talent engagement
                </p>
                <p className="text-foreground text-sm">
                  Active users now represent{" "}
                  {users.length > 0
                    ? formatPercentage(activeUsers, Math.max(users.length, 1))
                    : "0%"}{" "}
                  of the synced list, keeping application volume steady.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Industry focus</CardTitle>
            <CardDescription>
              Where most hiring activity happens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {industryFocus.map((industry, index) => (
              <div
                key={industry.name}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{industry.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {industry.companies} companies · {industry.jobs} roles
                  </p>
                </div>
                <div className="flex h-2 flex-1 items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          industryMaxJobs
                            ? Math.min(
                                (industry.jobs / industryMaxJobs) * 100,
                                100
                              )
                            : 0
                        }%`,
                        backgroundColor: `var(--chart-${(index % 4) + 1})`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formatPercentage(
                      industry.jobs,
                      Math.max(jobPostings.length, 1)
                    )}
                  </span>
                </div>
              </div>
            ))}
            {!industryFocus.length && (
              <p className="text-sm text-muted-foreground">
                Assign companies to industries to unlock this view.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Operational activity</CardTitle>
            <CardDescription>
              Approval, job refresh, and user sentiment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border p-4"
              >
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.accent }}
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-sm">{item.body}</p>
                </div>
                <p className="text-muted-foreground text-xs font-semibold">
                  {item.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick context</CardTitle>
            <CardDescription>Snapshot for the leadership sync</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Companies
              </p>
              <p className="text-lg font-semibold text-primary">
                {numberFormatter.format(openCompanies)} active partners with{" "}
                {numberFormatter.format(pendingCompanies)} new submissions
                awaiting a green light.
              </p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Jobs
              </p>
              <p className="text-foreground">
                {numberFormatter.format(openJobs)} open roles across{" "}
                {numberFormatter.format(uniqueHiringCompanies)} companies;{" "}
                {numberFormatter.format(pendingJobs)} listings still in review.
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Users
              </p>
              <p>
                {numberFormatter.format(activeUsers)} active users in the latest
                sync, giving us{" "}
                {users.length > 0
                  ? formatPercentage(activeUsers, Math.max(users.length, 1))
                  : "0%"}{" "}
                engagement coverage.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
