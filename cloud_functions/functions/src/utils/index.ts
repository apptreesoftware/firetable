import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const getEventTypeOnWrite = (
  change: functions.Change<functions.firestore.DocumentSnapshot>
) => {
  if (!change.before.exists && change.after.exists) {
    return "CREATE";
  } else if (change.before.exists && change.after.exists) {
    return "UPDATE";
  } else if (change.before.exists && !change.after.exists) {
    return "DELETE";
  }
  return;
};
