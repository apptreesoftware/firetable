import React, { useState } from "react";
import queryString from "query-string";

import { Typography, Button } from "@material-ui/core";

import AuthCard from "./AuthCard";

import { handleGoogleAuth } from "./utils";
import GoogleLogo from "assets/google-icon.svg";
import { useSnackContext } from "contexts/snackContext";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
export default function AppTreeSignIn() {
  const [loading, setLoading] = useState(false);
  const snack = useSnackContext();
  const parsedQuery = queryString.parse(window.location.search);

  return (
    <AuthCard height={280} loading={loading}>
      <Typography variant="h4">AppTree Data Portal</Typography>

      <Typography variant="body2">
        To protect your data, access to the AppTree IO data portal is enabled by
        the conversations you have with the app. Go back to your app to start a
        conversation and we’ll grant you access right when you need it.
      </Typography>
      <Button
        onClick={() => {
          setLoading(true);
        }}
        component="a"
        href="https://chat.apptreeio.com"
        color="primary"
        size="large"
        variant="outlined"
      >
        GO TO APPTREE IO
      </Button>
    </AuthCard>
  );
}
