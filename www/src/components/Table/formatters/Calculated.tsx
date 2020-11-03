import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { MONO_FONT } from "../../../Themes";

export default function Calculated({ value }: CustomCellProps) {
  return <span style={{ fontFamily: MONO_FONT }}>{value}</span>;
}
