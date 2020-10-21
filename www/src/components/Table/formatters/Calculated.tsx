import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { MONO_FONT } from "Theme";
import * as math from "mathjs";

export default function Calculated({ row, column }: CustomCellProps) {
  const { config } = column as any;
  const eq = config.equation;
  let value = "NAN";
  try {
    value = math.evaluate(eq, row);
  } catch (e) {}

  return <span style={{ fontFamily: MONO_FONT }}>{value}</span>;
}
