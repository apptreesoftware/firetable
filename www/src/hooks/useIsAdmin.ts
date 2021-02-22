import firetableContext from "contexts/FiretableContext";
import { useContext, useEffect, useState } from "react";

export default function useIsAdmin() {
  const { userRoles } = useContext(firetableContext);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(userRoles?.includes("ADMIN") ?? false);
  }, [userRoles]);
  return isAdmin;
}
