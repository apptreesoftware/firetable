import React, { useEffect, useState } from "react";
import Div100vh from "react-div-100vh";

import {
  makeStyles,
  createStyles,
  Grid,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";

import { googleProvider, auth } from "../firebase";
import useRouter from "hooks/useRouter";
import FiretableLogo from "assets/firetable-with-wordmark.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(3),

      margin: 0,
      width: "100%",
    },
    logo: { display: "block" },
  })
);

export default function CompleteAuthView() {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleAuth = async () => {
    setLoading(true);
    const params = new URLSearchParams(router.location.search);
    const token = params.get("t") as string;
    try {
      await auth.signInWithCustomToken(token);
      router.history.replace("/");
    } catch (e) {
      setErrorMsg(`Sign in failed: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <Grid
      container
      className={classes.root}
      spacing={4}
      direction="column"
      wrap="nowrap"
      justify="center"
      alignItems="center"
      component={Div100vh}
      style={{ minHeight: "100rvh" }}
    >
      <Grid item>
        <img
          src={FiretableLogo}
          alt="firetable"
          width={175}
          height={40}
          className={classes.logo}
        />
      </Grid>

      <Grid item>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="body1" color={errorMsg ? "error" : "primary"}>
            {errorMsg ? errorMsg : "Signing in..."}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
