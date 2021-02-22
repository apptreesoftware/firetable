import React, { useContext } from "react";
import { FormatterProps } from "react-data-grid";
import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Tooltip,
} from "@material-ui/core";
import CopyCellsIcon from "assets/icons/CopyCells";
import DeleteIcon from "@material-ui/icons/DeleteForever";

import { SnackContext } from "contexts/SnackContext";
import { useConfirmation } from "components/ConfirmationDialog/Context";
import { useFiretableContext } from "contexts/FiretableContext";
import useKeyPress from "hooks/useKeyPress";
import template from "lodash/template";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      ".final-column-cell": {
        ".rdg .rdg-cell&": {
          backgroundColor: "var(--header-background-color)",
          borderColor: "var(--header-background-color)",
          color: theme.palette.text.disabled,
        },

        ".rdg-row:hover &": { color: theme.palette.text.primary },
      },
    },
  })
);

export default function FinalColumn({ row }: FormatterProps<any, any>) {
  useStyles();

  const { requestConfirmation } = useConfirmation();
  const { tableActions, tableState } = useFiretableContext();
  const shiftPress = useKeyPress("Shift");
  const snack = useContext(SnackContext);
  const rowCopyEnabled =
    tableState?.config?.tableConfig?.doc?.rowCopyEnabled ?? false;
  const rowDeleteEnabled =
    (tableState?.config?.tableConfig?.doc?.rowDeleteEnabled ?? false) &&
    row.delete_disabled !== true;

  const handleDelete = async () => {
    row.ref.delete().then(
      (r) => {
        console.log("r", r);
      },
      (error) => {
        if (error.code === "permission-denied") {
          snack.open({
            severity: "error",
            message: "You don't have permissions to delete this row",
            duration: 3000,
            position: { vertical: "top", horizontal: "center" },
          });
        }
      }
    );
  };
  return (
    <Grid container spacing={1}>
      {rowCopyEnabled && (
        <Grid item>
          <Tooltip title="Duplicate row">
            <IconButton
              size="small"
              color="inherit"
              onClick={() => {
                const clonedRow = { ...row };
                // remove metadata
                delete clonedRow.ref;
                delete clonedRow.rowHeight;
                delete clonedRow._ft_updatedAt;
                delete clonedRow._ft_updatedBy;
                delete clonedRow._ft_createdAt;
                Object.keys(clonedRow).forEach((key) => {
                  if (clonedRow[key] === undefined) {
                    delete clonedRow[key];
                  }
                });
                for (const [_k, col] of Object.entries(
                  tableState?.columns ?? {}
                )) {
                  if (col.config.ignoreInCopy) {
                    delete clonedRow[col.key];
                  }
                  if (col.config.copyFormat) {
                    const compiled = template(col.config.copyFormat);
                    clonedRow[col.key] = compiled(clonedRow);
                  }
                }
                if (tableActions) tableActions?.row.add(clonedRow);
              }}
              aria-label="Duplicate row"
            >
              <CopyCellsIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}

      {rowDeleteEnabled && !row._delete_disabled_ === true && (
        <Grid item>
          <Tooltip title="Delete row">
            {shiftPress ? (
              <IconButton
                size="small"
                color="inherit"
                onClick={handleDelete}
                aria-label="Delete row"
              >
                <DeleteIcon />
              </IconButton>
            ) : (
              // <Confirmation
              //   message={{
              //     title: "Delete Row",
              //     body: "Are you sure you want to delete this row?",
              //     confirm: "Delete",
              //   }}
              // >
              <IconButton
                size="small"
                color="inherit"
                onClick={() => {
                  requestConfirmation({
                    title: "Delete Row",
                    body: "Are you sure you want to delete this row?",
                    confirm: "Delete",
                    handleConfirm: handleDelete,
                  });
                }}
                aria-label="Delete row"
              >
                <DeleteIcon />
              </IconButton>
              // </Confirmation>
            )}
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}
