import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";

import CssBaseline from "@mui/material/CssBaseline";
import logo from "./logo1.jpg";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

import Book from "./book";
import EditMember from "./EditMember";
import { jwtDecode } from "jwt-decode";
import { red } from "@mui/material/colors";

const jwt_decode = jwtDecode;

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Album() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          // alert('authen success')
        } else {
          alert("โปรดเข้าสู้ระบบอีกครั้ง");
          localStorage.removeItem("token");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/";
  };

  const handleOpen = () => {
    window.location = "/addbook";
  };

  const handleOpenpopup = () => {
    // เปิด Popup

    if (Role === "admin") {
      setEditMemberOpen(true);
    } else {
      alert("คุณไม่ได้รับอนุญาต");
    }
  };

  const handleclosepopup = () => {
    // เปิด Popup
    setEditMemberOpen(false);
  };

  const [username, setUsername] = useState("");
  const [Role, setRole] = useState("");

  useEffect(() => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem("token"); // แทน 'your_token_key' ด้วยคีย์ที่คุณใช้เก็บ token
    console.log(token);

    if (token) {
      // Decode token เพื่อดึงข้อมูล
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);

      // ดึง username จาก decodedToken
      const user = decodedToken.username;
      const Role = decodedToken.Role;

      // เซ็ต state เพื่อแสดงผลบนหน้าเว็บ
      setUsername(user);
      setRole(Role);
    }
  }, []);
  const [isEditMemberOpen, setEditMemberOpen] = useState(false);

  const userRole = Role;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          bgcolor: "green", // สีเขียว
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="primary" // สีข้อความ
              gutterBottom
              sx={{
                fontWeight: "bold", // ตัวหนา
                fontFamily: "cursive", // ตัวหนังสือ
                background: "linear-gradient(to right, #ff7e5f, #feb47b)", // พื้นหลัง
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                height: "167px", // ความสูง
              }}
            >
              READ&BOOK เว็บอ่าน E BOOK ฟรี
            </Typography>
            <Typography
              align="left"
              sx={{
                padding: 1,
                fontSize: "1rem",
                marginLeft: "-680px",
                marginTop: "-145px",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "300px", marginRight: "10px" }}
              />
            </Typography>
          </Typography>
          {/* ... ส่วนอื่น ๆ ... */}
        </Container>
      </Box>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap display={"flex"}>
            E BOOK
            <Button
              variant="contained"
              color="error"
              display={"flex"}
              onClick={handleOpen}
              sx={{ padding: 1, fontSize: "1rem", marginLeft: "1300px" }}
            >
              addbook <AddTwoToneIcon />
            </Button>
          </Typography>
          {userRole === "admin" && (
            <Button
              variant="contained"
              color="error"
              display="auto"
              onClick={handleOpenpopup}
              align="center"
              sx={{
                padding: 1,
                fontSize: "1rem",
                margin: "30px",
                backgroundColor: "#4CAF50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Edit member
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            ></Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              ยินดีต้อนรับคุณ
              <Typography
                variant="h5"
                align="center"
                color="error"
                paragraph
                sx={{ fontWeight: "bold" }}
              >
                {username} ยศ {Role}
              </Typography>{" "}
              นี้คือเว็บที่ออกแบบมาเพื่อคนชอบอ่านหนังสือบนเว็บไซต์ E BOOK
              ใช้ฟรีไม่เสียตัง
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Book />
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
      <EditMember open={isEditMemberOpen} onClose={handleclosepopup} />
    </ThemeProvider>
  );
}
