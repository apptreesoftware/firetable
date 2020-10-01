import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { TableAction } from "../TableSettingsDialog";
import { ArrowDropDown } from "@material-ui/icons";

export default function TableHeaderActionButton({
  tableActions,
  actionHandler,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const actions = tableActions as TableAction[];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (action) => {
    actionHandler(action);
    handleClose();
  };

  const actionMenuItems =
    actions?.map((a) => {
      return (
        <MenuItem onClick={() => handleSelection(a)}>{a.actionName}</MenuItem>
      );
    }) ?? [];

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Actions <ArrowDropDown />
      </Button>
      <Menu
        id="table-action-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actionMenuItems}
      </Menu>
    </div>
  );
}
