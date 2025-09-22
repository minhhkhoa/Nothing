"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { chartData1 } from "./data-chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ChartDemo1() {
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="h-[400px] w-full mx-auto"
      >
        <BarChart
          accessibilityLayer
          data={chartData1}
          barSize={70} //- độ rộng từng cột
          barCategoryGap="15%" //- khoảng cách giữa các nhóm
          barGap={5} //- khoảng cách giữa các bar trong nhóm
        >
          {/* lưới background */}
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />

          {/* chart tooltip */}
          <ChartTooltip content={<ChartTooltipContent />} />

          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            fill="var(--color-desktop)"
            radius={4}
            width={20}
          />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
