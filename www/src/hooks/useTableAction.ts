import { TableAction } from "../components/TableSettingsDialog";
import { useEffect } from "react";
import { db } from "../firebase";
import { FiretableState, tablePath } from "./useFiretable";
import { useSnackContext } from "../contexts/snackContext";

const useTableAction = (
  tableAction: TableAction,
  tableState: FiretableState
) => {
  const snack = useSnackContext();
  useEffect(() => {
    console.log(`Perform action :${JSON.stringify(tableAction)}`);
    try {
      snack.open({ message: "Performing action" });
      const uri = new URL(tableAction.webhookUrl);
      db.collection(tablePath(tableState.tablePath))
        .get()
        .then(async (snapshot) => {
          await fetch(uri.toString(), {
            method: "POST",
            body: JSON.stringify({
              rows: snapshot.docs.map((d) => {
                return {
                  _id: d.id,
                  ...d.data(),
                };
              }),
              collectionName: tableState.tablePath,
            }),
            headers: { "content-type": "application/json" },
          });
        });
    } catch (e) {
      console.error(e);
    }
  });
};

export default useTableAction;
