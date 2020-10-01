import useTable from "./useTable";
import useTableConfig from "./useTableConfig";
import { TableAction } from "../../components/TableSettingsDialog";
import { db } from "../../firebase";

export type FiretableActions = {
  // TODO: Stricter types here
  column: {
    add: Function;
    resize: (index: number, width: number) => void;
    rename: Function;
    remove: Function;
    update: Function;
    reorder: Function;
  };
  row: { add: Function; delete: Function; more: Function };
  table: {
    set: Function;
    filter: Function;
    updateConfig: Function;
    orderBy: Function;
    performAction: Function;
  };
};

export type FiretableState = {
  orderBy: FiretableOrderBy;
  tablePath: string;
  config: { rowHeight: number; tableConfig: any; webhooks: any };
  columns: any[];
  rows: { [key: string]: any }[];
  queryLimit: number;
  filters: FireTableFilter[];
  loadingRows: boolean;
  loadingColumns: boolean;
  tableActions: TableAction[];
};
export type FireTableFilter = {
  key: string;
  operator: "==" | "<" | ">" | ">=" | "<=" | string;
  value: string | number | boolean | string[];
};
export type FiretableOrderBy = { key: string; direction: "asc" | "desc" }[];
const useFiretable = (
  collectionName?: string,
  filters?: FireTableFilter[],
  orderBy?: FiretableOrderBy
) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName,
    filters,
    orderBy,
  });

  /** set collection path of table */
  const setTable = (collectionName: string, filters: FireTableFilter[]) => {
    if (collectionName !== tableState.path || filters !== tableState.filters) {
      configActions.setTable(collectionName);
      tableActions.setTable(collectionName, filters);
    }
  };

  const performTableAction = async (tableAction: TableAction) => {
    console.log(`Perform action :${JSON.stringify(tableAction)}`);
    try {
      const uri = new URL(tableAction.webhookUrl);
      const snapshot = await db.collection(tablePath(tableState.path)).get();
      await fetch(uri.toString(), {
        method: "POST",
        body: JSON.stringify({
          rows: snapshot.docs.map((d) => {
            return {
              _id: d.id,
              ...d.data(),
            };
          }),
          collectionName: tableState.path,
        }),
        headers: { "content-type": "application/json" },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filterTable = (filters: FireTableFilter[]) => {
    tableActions.dispatch({ filters });
  };
  const setOrder = (orderBy: FiretableOrderBy) => {
    tableActions.dispatch({ orderBy });
  };
  const state: FiretableState = {
    orderBy: tableState.orderBy,
    tablePath: tableState.path,
    filters: tableState.filters,
    columns: tableConfig.columns,
    config: {
      rowHeight: tableConfig.rowHeight,
      webhooks: tableConfig.doc?.webhooks,
      tableConfig,
    },
    rows: tableState.rows,
    queryLimit: tableState.limit,
    loadingRows: tableState.loading,
    loadingColumns: tableConfig.loading,
    tableActions: tableConfig.doc?.tableActions,
  };
  const actions: FiretableActions = {
    column: {
      add: configActions.addColumn,
      resize: configActions.resize,
      rename: configActions.rename,
      update: configActions.updateColumn,
      remove: configActions.remove,
      reorder: configActions.reorder,
    },
    row: {
      add: tableActions.addRow,
      delete: tableActions.deleteRow,
      more: tableActions.moreRows,
    },
    table: {
      updateConfig: configActions.updateConfig,
      set: setTable,
      orderBy: setOrder,
      filter: filterTable,
      performAction: performTableAction,
    },
  };

  return { tableState: state, tableActions: actions };
};

export function tablePath(path: string) {
  const prefix = process.env.REACT_APP_DATA_PATH_PREFIX;
  if (prefix) {
    return `${prefix}/${path}`;
  }
  return path;
}

export default useFiretable;
