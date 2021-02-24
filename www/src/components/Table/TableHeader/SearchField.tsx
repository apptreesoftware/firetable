import React, { useEffect, useState } from "react";
import { useFiretableContext } from "../../../contexts/FiretableContext";
import { CircularProgress, IconButton, TextField } from "@material-ui/core";
import { useDebounce } from "use-debounce";
import ClearIcon from "@material-ui/icons/Clear";

export default function SearchField() {
  const { tableActions, tableState } = useFiretableContext();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1500);
  const [loading, setLoading] = useState(tableState?.loadingRows ?? false);
  useEffect(() => {
    tableActions?.table.search(search);
  }, [debouncedSearch]);

  useEffect(() => {
    setLoading(tableState?.loadingRows ?? false);
  }, [tableState?.loadingRows]);

  return (
    <>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        InputProps={{
          endAdornment: loading ? (
            <CircularProgress size="36px" />
          ) : (
            <IconButton
              onClick={() => {
                setLoading(true);
                setSearch("");
              }}
            >
              <ClearIcon />
            </IconButton>
          ),
        }}
        onChange={(event) => {
          setLoading(true);
          setSearch(event.target.value);
        }}
      />
    </>
  );
}
