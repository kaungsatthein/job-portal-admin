"use client";

import * as React from "react";
import type { TooltipProps } from "recharts";
import { Tooltip as RechartsTooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export const ChartContainer = ({
  config,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) => {
  const cssVariables = Object.entries(config).reduce(
    (acc, [key, value]) => {
      if (value?.color) {
        acc[`--color-${key}` as const] = value.color;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border/60 bg-background/60 p-4", // default container styling
        className
      )}
      style={{ ...cssVariables, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

interface ChartTooltipContentProps extends TooltipProps<number, string> {
  hideLabel?: boolean;
  formatter?: (value?: number | string) => string;
}

const defaultFormatter = (value?: number | string) =>
  typeof value === "number" ? new Intl.NumberFormat("en-US").format(value) : value?.toString() ?? "";

export const ChartTooltipContent = ({
  active,
  payload,
  label,
  hideLabel,
  formatter = defaultFormatter,
}: ChartTooltipContentProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-background/95 p-3 text-sm shadow-md">
      {!hideLabel && label && <p className="mb-2 font-medium">{label}</p>}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  item.color || (item.dataKey ? `var(--color-${String(item.dataKey)})` : "var(--chart-1)"),
              }}
            />
            <span className="text-muted-foreground">
              {item.name || (typeof item.dataKey === "string" ? item.dataKey : "Value")}
            </span>
            <span className="font-semibold">{formatter(item.value as number | string)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartTooltip = (props: TooltipProps<number, string>) => {
  return (
    <RechartsTooltip
      {...props}
      wrapperClassName={cn("!outline-none", props.wrapperClassName)}
      contentStyle={{ background: "transparent", border: "none", padding: 0 }}
    />
  );
};
