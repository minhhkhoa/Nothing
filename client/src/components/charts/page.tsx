import React from "react";
import { ChartDemo1 } from "./example-chart";
import { ChartAreaInteractive } from "./area-chart";
import { ChartRadarDots } from "./radachart";

export default function ChartComponent() {
  return (
    <div className="mb-5">
      <ChartDemo1 />
      <ChartAreaInteractive />
      <div className="mt-5 px-5">
        <ChartRadarDots />
      </div>
    </div>
  );
}
