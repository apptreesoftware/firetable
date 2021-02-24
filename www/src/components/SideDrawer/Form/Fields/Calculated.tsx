import React from "react";
import { IFieldProps } from "../utils";
import { createStyles, makeStyles, Typography } from "@material-ui/core";
import * as math from "mathjs";
import { MONO_FONT } from "../../../../Themes";

export interface ICalculatedProps extends IFieldProps {
  config: any;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      textAlign: "left",
      minHeight: 56,

      display: "flex",
      alignItems: "center",
    },
    label: {
      whiteSpace: "normal",
      width: "100%",
      overflow: "hidden",
      fontFamily: MONO_FONT,
      userSelect: "all",
    },
  })
);

export default function Calculated({ config, ...props }: ICalculatedProps) {
  const classes = useStyles();

  const values = props.control.getValues();
  let value = "NaN";
  try {
    value = math.evaluate(config.equation, values);
  } catch (e) {}

  return (
    <div className={classes.labelContainer}>
      <Typography variant="body1" className={classes.label}>
        {value}
      </Typography>
    </div>
  );
}