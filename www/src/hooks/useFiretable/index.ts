import { functions } from "../../firebase";
import useTable from "./useTable";
import useTableConfig from "./useTableConfig";
import { useEffect } from "react";

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
    search: Function;
  };
};

export interface TableAction {
  actionName: string;
  action: string;
  includeTableData?: boolean;
}

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
    try {
      const callable = functions.httpsCallable("performFiretableBulkAction");
      await callable({
        tableId: tableState.path,
        actionId: tableAction.action,
        includeTableData: tableAction.includeTableData ?? false,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const filterTable = (filters: FireTableFilter[]) => {
    tableActions.dispatch({ filters });
  };

  const searchTable = (search: string) => {
    tableActions.setSearch(search);
  };

  const setOrder = (orderBy: FiretableOrderBy) => {
    tableActions.dispatch({ orderBy });
  };

  useEffect(() => {
    if (tableConfig.doc?.orderBy) {
      const orderComp = tableConfig.doc.orderBy.split(",");
      if (
        orderComp.length === 2 &&
        (orderComp[1] == "asc" || orderComp[1] == "desc")
      ) {
        setOrder([{ key: orderComp[0], direction: orderComp[1] }]);
      }
    }
  }, [tableConfig.doc]);

  const state: FiretableState = {
    orderBy: tableState.orderBy ?? tableConfig.doc?.orderBy,
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
      search: searchTable,
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
