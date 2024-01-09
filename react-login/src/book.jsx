import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
const Swal = require('sweetalert2');



const jwt_decode = jwtDecode

function Book() {
  const [books, setBooks] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3333/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Retrieve user role from the token
      const token = localStorage.getItem("token");
      const decodedToken = jwt_decode(token);
      const userRole = decodedToken.Role;
  
      console.log(userRole);
  
      // Display confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });
  
      // Check if the user confirmed the deletion
      if (result.isConfirmed) {
        // Check if the user has 'admin' role
        if (userRole === 'admin') {
          // Send DELETE request to the server
          await axios.delete(`http://localhost:3333/books/${id}`);
  
          // Fetch updated book data
          const response = await axios.get('http://localhost:3333/books');
  
          // Update state with new data
          setBooks(response.data);
  
          // Display success message
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else {
          // User is not authorized to delete
          Swal.fire({
            icon: "error",
            title: "คุณไม่ได้รับอนุญาติให้ลบหนังสือ",
            text: " เพราะคุณไม่ไช้ admin",
            confirmButtonColor: "#d33", // Red color for the confirmation button
          });
        }
      }
    } catch (error) {
      // Handle errors
      console.error('Error deleting book:', error);
  
      // Display error message
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting the book.",
        icon: "error"
      });
    }
  };
  

  const displayPdfFromBuffer = (data) => {
    const dataArray = data.data;
    const uint8Array = new Uint8Array(dataArray);
    const arrayBuffer = uint8Array.buffer;
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, '_blank');
    
  };














  const [username, setUsername] = useState('');
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
      const Role = decodedToken.Role

      // เซ็ต state เพื่อแสดงผลบนหน้าเว็บ
      setUsername(user);
      setRole(Role);

    }
  }, []);



  const [open, setOpen] = useState(false); // เพิ่ม state สำหรับการเปิด/ปิด Dialog
  const [selectedBook, setSelectedBook] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลหนังสือที่ถูกเลือก
  const [editedBookName, setEditedBookName] = useState('');
  const [editedBookpublish, setEditedBookpublish] = useState('');
  const [editedBookwrite, setEditedBookwrite] = useState('');
  const [editedBookdetail, setEditedBookdetail] = useState(''); //detail
  
  const handleEdit = (book) => {
    // ตรวจสอบ Role ของผู้ใช้ที่ล็อกอิน
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const userRole = decodedToken.Role;

    // ถ้าผู้ใช้มี Role เป็น 'admin'
    if (userRole === 'admin') {
      // นำข้อมูลหนังสือที่เลือกไปเก็บใน state และเปิด Dialog
      setSelectedBook(book);
      setOpen(true);
      console.log(book)
    } else {
      // ถ้าผู้ใช้ไม่มี Role เป็น 'admin' ให้แจ้งเตือนหรือปฏิเสธการแก้ไข
      alert("คุณไม่ได้รับอนุญาตให้แก้ไขหนังสือ");
    }
  };

  const handleClose = () => {
    // ปิด Dialog เมื่อผู้ใช้กดปุ่มปิด
    setOpen(false);
  };

  const handleSave = async (bookID) => {

    console.log(bookID)
    if (bookID !== undefined && editedBookName !== undefined) {
      try {
        const response = await fetch(`http://localhost:3333/editbook/${bookID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editedBookName, publish: editedBookpublish, write: editedBookwrite, detail: editedBookdetail }),
        });

        if (response.ok) {
          console.log('Book updated successfully:', await response.json());
          handleClose();
          const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:3333/books');
              setBooks(response.data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
          fetchData();

        } else {
          console.error('Error updating book:', response.status);
        }
      } catch (error) {
        console.error('Error updating book:', error);
      }
    } else {
      console.error('Invalid bookId or editedBookName:', bookID, editedBookName);
    }
  };





  const handleInputChange = (event) => {
    setEditedBookName(event.target.value);
  };
  const handleInputChangepublish = (event) => {
    setEditedBookpublish(event.target.value);
  };
  const handleInputChangewrite = (event) => {
    setEditedBookwrite(event.target.value);
  };
  const handleInputChangedetail = (event) => {
    setEditedBookdetail(event.target.value);
  };

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={20}>

        {books.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', width: '160%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  pt: '0%',
                }}
              />
              <img
                alt={book.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                src={`data:image/jpeg;base64,${arrayBufferToBase64(book.cover_image.data)}`}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  {book.name}
                </Typography>

                
                <Typography sx={{ fontWeight: 'bold' }}>
                  Author: {book.write}
                </Typography>
                <Typography>
                  Publisher: {book.publish}
                </Typography>

                <Typography>
                  category: {book.categoryName}
                </Typography>
                <Typography>
                  Synopsis: {book.detail}...
                </Typography>



              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => displayPdfFromBuffer(book.PDF)}
                  style={{ color: 'white', backgroundColor: '#2196F3' }}
                >
                  Read
                </Button>

                <Button
                  size="small"
                  onClick={() => handleEdit(book.bookID)}
                  style={{ color: 'white', backgroundColor: 'green' }}
                >
                  EDIT
                </Button>


                <Button
                  size="small"
                  onClick={() => handleDelete(book.bookID)}
                  style={{ color: 'white', backgroundColor: 'red' }}
                >
                  DELETE
                </Button>
              </CardActions>
            </Card>
            {/* Dialog for Editing */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Book </DialogTitle>
              <DialogTitle>BookID: {selectedBook}</DialogTitle>
              <DialogContent    >
                {/* TextField สำหรับแก้ไขชื่อหนังสือ */}
                <br />
                <TextField
                  label="Book Name"
                  variant="outlined"
                  fullWidth
                  value={editedBookName}
                  onChange={handleInputChange}
                  autoFocus
                />
                <br />
                <br />

                {/* TextField สำหรับแก้ไข publish */}
                <TextField
                  label="Publish"
                  variant="outlined"
                  fullWidth
                  value={editedBookpublish}
                  onChange={handleInputChangepublish}
                />
                  <br />
                  <br />

                <TextField
                  label="write"
                  variant="outlined"
                  fullWidth
                  value={editedBookwrite}
                  onChange={handleInputChangewrite}
                />
                <br />
                <br />

                {/* TextField สำหรับแก้ไข write detail */}
                <TextField
                  label="Detail"
                  variant="outlined"
                  fullWidth
                  rows={6}
                  multiline
                  value={editedBookdetail}
                  onChange={handleInputChangedetail}
                />
                  <br />
                  <br />
                {/* กระทำเพิ่มเติมตามต้องการ */}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleSave(selectedBook)} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>



          </Grid>
        ))}
      </Grid>

      {/* Borrow Confirmation Dialog */}
      

    </Container>
  );
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default Book;
