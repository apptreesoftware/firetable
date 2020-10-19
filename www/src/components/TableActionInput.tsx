import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import { RemoveCircle } from "@material-ui/icons";
import { TableAction } from "../hooks/useFiretable";

const useStyles = makeStyles((Theme) =>
  createStyles({
    root: {},
    field: {
      width: "100%",
    },
    chipsContainer: {
      display: "flex",
      maxWidth: "100%",
      spacing: 4,
      padding: Theme.spacing(1),
    },
    chip: {
      margin: Theme.spacing(0.5),
    },
  })
);

const TableActionsInput = ({
  value,
  handleChange,
  label,
}: {
  value?: TableAction[];
  handleChange: any;
  label?: string;
}) => {
  const classes = useStyles();
  const [actions, setActions] = useState(value ?? []);
  const [newAction, setNewAction] = useState({
    actionName: "",
    action: "",
  });

  const handleAdd = () => {
    // setOptions([...options, newOption]);
    if (newAction.action && newAction.actionName) {
      const updatedActions = [...actions, newAction];
      handleChange(updatedActions);
      setNewAction({ actionName: "", action: "" });
      setActions(updatedActions);
    }
  };
  const handleRemove = (action) => {
    // setOptions([...options, newOption]);
    const updatedActions = actions.filter(
      (a) => a.actionName !== action.actionName
    );
    setActions(updatedActions);
    handleChange(updatedActions);
  };
  const rows = actions.map((action, i) => {
    return (
      <Grid
        container
        item
        justify={"space-between"}
        spacing={1}
        key={action.actionName}
      >
        <Grid item xs>
          <TextField
            fullWidth
            value={action.actionName}
            label="Name"
            disabled={true}
            id="actionName"
            variant="filled"
            onChange={(e) => {
              newAction.actionName = e.target.value;
              setNewAction(newAction);
            }}
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            value={action.action}
            disabled={true}
            label="Action"
            id="actionId"
            variant="filled"
            onChange={(e) => {
              newAction.action = e.target.value;
              setNewAction(newAction);
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            edge="end"
            aria-label="remove"
            onClick={(e: any) => {
              handleRemove(action);
            }}
          >
            {<RemoveCircle />}
          </IconButton>
        </Grid>
      </Grid>
    );
  });
  return (
    <Grid container direction="column" className={classes.root} spacing={1}>
      <Grid container item spacing={1} justify={"space-between"}>
        <Grid item xs>
          <TextField
            fullWidth
            label="Name"
            id="actionName"
            variant="filled"
            value={newAction.actionName}
            onChange={(e) => {
              setNewAction({
                actionName: e.target.value,
                action: newAction.action,
              });
            }}
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Action"
            id="action"
            variant="filled"
            value={newAction.action}
            onChange={(e) => {
              console.log(`TextField onChange: ${e.target.value}`);
              setNewAction({
                actionName: newAction.actionName,
                action: e.target.value,
              });
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            edge="end"
            aria-label="add new"
            onClick={(e: any) => {
              handleAdd();
            }}
          >
            {<AddIcon />}
          </IconButton>
        </Grid>
      </Grid>
      {rows}
    </Grid>
  );
};

export default TableActionsInput;
