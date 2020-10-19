import { functions } from "./../firebase/index";
import { useEffect, useReducer, useState } from "react";

const searchReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};

function useConnectService(opts: {
  tableId: string;
  action: string;
  rowData: any;
  resultsKey: string;
}) {
  const emptyResults: any[] = [];

  const updateQuery = async (search: string) => {
    searchDispatch({ loading: true, force: false, prevSearch: search });
    const results = await performSearch({
      tableId: opts.tableId,
      action: opts.action,
      rowData: opts.rowData,
      searchText: search,
      resultsKey: opts.resultsKey,
    });
    searchDispatch({ results: results, loading: false });
  };
  const [searchState, searchDispatch] = useReducer(searchReducer, {
    search: "",
    prevSearch: "",
    force: false,
    results: emptyResults,
    loading: false,
  });

  useEffect(() => {
    if (searchState.force || searchState.prevSearch !== searchState.search) {
      updateQuery(searchState.search);
    }
  }, [searchState]);

  return [searchState, searchDispatch];
}

async function performSearch(opts: {
  action: string;
  tableId: string;
  rowData: any;
  searchText: string;
  resultsKey: string;
}): Promise<any[]> {
  try {
    const callable = functions.httpsCallable("performFiretableSearchAction");
    const results = await callable({
      tableId: opts.tableId,
      rowData: opts.rowData,
      actionId: opts.action,
      query: opts.searchText,
    });

    return results.data[opts.resultsKey];
  } catch (e) {
    console.error("Service returned invalid result", e);
    return [];
  }
}

export default useConnectService;
