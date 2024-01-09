import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const EditUserForm = ({ open, onClose, userId  }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  // useEffect(() => {
  //   // ดึงข้อมูลผู้ใช้ที่จะแก้ไขจาก API
  //   axios.get(`http://localhost:3333/users/${userId}`)
  //     .then(response => {
  //       if (response.data && response.data.username) {
  //         setUserData(response.data);
  //         console.log(userId);
  //       } else {
  //         console.error('Invalid user data format:', response.data);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user data:', error);
  //     });
  // }, [userId]);
  

  const handleSave = async () => {
    if (userId !== undefined) {
      try {
        console.log(userId)
        console.log(userData)
        const response = await fetch(`http://localhost:3333/edituser/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: userData.username, useremail: userData.email, userphone: userData.phone }),
        });
  
        if (response.ok) {
          console.log('User updated successfully:', await response.json());
          
          
  
          
          
          
        
        onClose()
          
          console.log('Updated user data:', );
        } else {
          console.error('Error updating user:', response.status);
          
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      console.error('Invalid userID:', userId);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          fullWidth
          type="number"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserForm;
