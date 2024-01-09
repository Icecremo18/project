import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { TextField } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Audio } from "react-loader-spinner";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { useEffect } from "react";


function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");

  const [load, setload] = React.useState(false);

  setTimeout(() => {
    setload(false); // Hide loading animation
    // Your redirect logic here
  }, 1000);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      username: data.get("username"),
      password: data.get("password"),
    };

    fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          localStorage.setItem("token", data.token);
          setload(true);

          // Move setTimeout here to control when to hide the loading animation
          
            Swal.fire({
              position: "center",
              icon: "success",
              title: "เข้าสูระบบสำเร็จ",
              showConfirmButton: false,
              timer: 1500
            });

            setTimeout(() => {
              setload(false);
              window.location = "/album";
            }, 1000);
          
        } else {
          setload(true);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "โปรดใส่ username หรือ password ใหม่ ",
            showConfirmButton: false,
            timer: 1500
          });
          // Move setTimeout here for consistency
          setTimeout(() => {
            setload(false);
            setOpenAlert(true);
            setAlertSeverity("error");
            setAlertMessage("Login failed");
          }, 1000);
          
        }
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors here if needed
      });
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);

    console.log(openAlert);
  };
  const Swal = require('sweetalert2')
  
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        {openAlert && (
          <Alert severity={alertSeverity} onClose={handleCloseAlert}>
            {alertMessage}
          </Alert>
        )}
      </Stack>

      {load ? (
  <p>
    
 
  </p>
) : (
  <div>
    {/* เนื้อหาที่ต้องการแสดงเมื่อไม่ได้โหลด */}
  </div>
)}

      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
