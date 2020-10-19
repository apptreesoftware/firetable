import React from "react";

import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import { isCollectionGroup } from "../../util/fns";
import AddIcon from "@material-ui/icons/Add";

import Filters from "./Filters";
import ImportCSV from "./ImportCSV";
import ExportCSV from "./ExportCSV";

import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { useFiretableContext } from "contexts/firetableContext";
import { FieldType } from "constants/fields";
import MigrateButton from "./MigrateButton";
import HiddenFields from "./HidenFields";
import TableHeaderActionButton from "./TableHeaderActionButton";
import { useSnackContext } from "../../contexts/snackContext";
import useIsAdmin from "hooks/useIsAdmin";
export const TABLE_HEADER_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: `calc(100% - ${DRAWER_COLLAPSED_WIDTH}px)`,
      margin: 0,
      padding: theme.spacing(0, 3, 0, 1),
      minHeight: TABLE_HEADER_HEIGHT,

      overflowX: "auto",
      whiteSpace: "nowrap",

      userSelect: "none",

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingRight: theme.spacing(1),
      },
    },
    collectionName: { textTransform: "uppercase" },

    spacer: { minWidth: theme.spacing(8) },

    formControl: {
      minWidth: 120,
      margin: theme.spacing(0, 0, 0, -1),
    },
    inputBaseRoot: { borderRadius: theme.shape.borderRadius },
    select: {
      paddingTop: "6px !important",
      paddingBottom: "7px !important",
    },
  })
);

interface ITableHeaderProps {
  rowHeight: number;
  updateConfig: Function;
}

/**
 * TODO: Make this properly mobile responsive, not just horizontally scrolling
 */
export default function TableHeader({
  rowHeight,
  updateConfig,
}: ITableHeaderProps) {
  const classes = useStyles();
  const { tableActions, tableState } = useFiretableContext();
  const snack = useSnackContext();
  const isAdmin = useIsAdmin();
  if (!tableState || !tableState.columns) return <></>;
  const { columns } = tableState;

  const needsMigration = Array.isArray(columns) && columns.length !== 0;
  const tempColumns = needsMigration ? columns : Object.values(columns);

  return (
    <Grid
      container
      alignItems="center"
      spacing={2}
      wrap="nowrap"
      className={classes.root}
    >
      <MigrateButton needsMigration={needsMigration} columns={tempColumns} />
      {!isCollectionGroup() && (
        <Grid item>
          <Button
            onClick={() => {
              const initialVal = tempColumns.reduce((acc, currCol) => {
                if (currCol.type === FieldType.checkbox) {
                  return { ...acc, [currCol.key]: false };
                } else {
                  return acc;
                }
              }, {});
              tableActions?.row.add(initialVal);
            }}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Row
          </Button>
        </Grid>
      )}

      {/* Spacer */}
      <Grid item />

      <Grid item>
        <HiddenFields />
      </Grid>
      <Grid item>
        <Filters />
      </Grid>

      <Grid item xs className={classes.spacer} />

      <Grid item>
        <Typography variant="overline" component="label" htmlFor="rowHeight">
          Height
        </Typography>
      </Grid>

      <Grid item>
        <TextField
          select
          variant="filled"
          className={classes.formControl}
          value={rowHeight ?? 43}
          onChange={(event) => {
            updateConfig("rowHeight", event.target.value);
          }}
          inputProps={{
            name: "rowHeight",
            id: "rowHeight",
          }}
          margin="dense"
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.inputBaseRoot },
          }}
          SelectProps={{
            classes: { root: classes.select },
            displayEmpty: true,
          }}
          hiddenLabel
        >
          <MenuItem value={43}>Tall</MenuItem>
          <MenuItem value={65}>Grande</MenuItem>
          <MenuItem value={100}>Venti</MenuItem>
          <MenuItem value={150}>Trenta</MenuItem>
        </TextField>
      </Grid>

      <Grid item />

      {isAdmin && !isCollectionGroup() && (
        <Grid item>
          <ImportCSV />
        </Grid>
      )}
      {isAdmin && (
        <Grid item>
          <ExportCSV />
        </Grid>
      )}

      <Grid item>
        <TableHeaderActionButton
          tableActions={tableState.tableActions}
          actionHandler={async (action) => {
            snack.open({ message: `Performing action ${action.actionName}` });
            await tableActions?.table?.performAction(action);
            snack.open({
              message: `${action.actionName} complete`,
              duration: 1000,
            });
          }}
        />
      </Grid>
      {/* <Settings /> */}
    </Grid>
  );
}
