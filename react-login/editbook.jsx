import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import EditUserForm from './EditUserForm';
const EditMember = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้ทั้งหมดจาก API
    axios.get('http://localhost:3333/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDelete = (userId) => {
    // Delete user
    axios.delete(`http://localhost:3333/users/${userId}`)
      .then(response => {
        console.log('User deleted successfully:', response.data);
        // Optionally, trigger a callback to update user data in the parent component
        axios.get('http://localhost:3333/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
        // Close the dialog
        onClose();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        // Handle errors or show a message to the user
      });
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Member</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Delete</TableCell>
                {/* เพิ่มฟิลที่ต้องการแสดงเพิ่มเติม */}
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.map((user) => (
                <TableRow key={user.ID}> 
                  <TableCell>{user.Role}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(user.ID)}>Delete</Button>
                  </TableCell>
                  {/* เพิ่มฟิลที่ต้องการแสดงเพิ่มเติม */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        
      </DialogActions>

      {/* Popup สำหรับแก้ไขผู้ใช้ */}
      {openEdit && (
        <EditUserForm
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          userId={selectedUserId}
        />
      )}
    </Dialog>
  );
};

export default EditMember;
