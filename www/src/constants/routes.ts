export enum routes {
  home = "/",
  auth = "/auth",
  googleAuth = "/googleAuth",
  completeAuth = "/completeAuth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",

  table = "/table",
  tableGroup = "/tableGroup",

  tableWithId = "/table/:id",
  tableGroupWithId = "/tableGroup/:id",
  grid = "/grid",
  gridWithId = "/grid/:id",
  editor = "/editor",
}

export default routes;
