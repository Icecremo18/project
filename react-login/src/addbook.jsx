import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
const Swal = require('sweetalert2')
function BookForm() {
    const [name , setname] = useState('')
    const [write , setwrite] = useState('')
    const [detail , setdetail] = useState('')
    const [publish , setpublish] = useState('')
    const [typing,settypeing] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
  
  
    const navigate = useNavigate()

    const addbook = async (e) => {
      e.preventDefault();
    
      if (!name || !write || !detail || !publish || !typing || !coverImage) {
        setError('Please fill in all fields');
        return;
      }
    
      try {
        setLoading(true);
        setError(null);
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('write', write);
        formData.append('detail', detail);
        formData.append('publish', publish);
        formData.append('typing', typing);
        formData.append('coverImage', coverImage);
        formData.append('pdfFile', pdfFile);
    
        const response = await axios.post('http://localhost:3333/addbook', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "เพิมหนังสือสำเร็จ",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/album');
        console.log(response.data);
      } catch (error) {
        console.error('Error adding book:', error);
        navigate('/album');
        console.log(error)
        setError('Error adding book. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    

  const handgohome = () => {
    navigate('/album');
  };

  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

const handlePdfFileChange = (e) => {
  const file = e.target.files[0];
  setPdfFile(file);
};

  const [selectedOption, setSelectedOption] = useState('');

  
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    settypeing(selectedValue.toString());
  }

  
  return (
    
    <Box
    
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 2,
        border: '1px solid #ccc',
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      }}
    >   <br /><br /><br /><br />
      <h2
        sx={{
          fontSize: '1.5rem',
          marginBottom: 2,
          textAlign: 'center',
        }}
      >
        Add a New Book
      </h2>
      <form>
        <div sx={{ marginBottom: 2 }}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            fullWidth
            onChange={e => setname(e.target.value)}
          />
        </div><br />

        <div sx={{ marginBottom: 2 }}>
          <TextField
            id="write"
            label="Write"
            variant="outlined"
            fullWidth
            onChange={e => setwrite(e.target.value)}
          />
        </div><br />

        <div sx={{ marginBottom: 2 }}>
          <TextField
            id="detail"
            label="Detail"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            onChange={e => setdetail(e.target.value)}
          />
        </div><br />

        <div sx={{ marginBottom: 2 }}>
          <TextField
            id="publish"
            label="Publish"
            variant="outlined"
            fullWidth
            onChange={e => setpublish(e.target.value)}
          />
        </div>
        <br />
        <br />
        <div sx={{ marginBottom: 2 }}>
        <div sx={{ marginBottom: 2 }}>

          เลือกประเภท
      <Select
      
        label="Select Option"
        variant="outlined"
        
        fullWidth
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <MenuItem value="นิยาย">นิยาย</MenuItem>
        <MenuItem value="การ์ตูน">การ์ตูน</MenuItem>
        <MenuItem value="วรรณกรรม">วรรณกรรม</MenuItem>
        <MenuItem value="วรรณกรรม">นิทาน</MenuItem>
      </Select>
      <br />
      <br />
    </div>
          <br />
        <br />
        </div>
        ภาพหน้าปกหนังสือ <br />
        <input type="file" accept="image/*" onChange={handleCoverImageChange} />
            <br />
        <br />
        เนื้อหาภายในหนังสือ <br />
        <input type="file" accept=".pdf" onChange={ handlePdfFileChange} />
        <br /><br /><br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: 1, fontSize: '1rem' }}
          onClick={addbook}
        >
          Add Book
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handgohome}
          sx={{ padding: 1, fontSize: '1rem', marginLeft:'230px' }}
        >
          main
        </Button>
      </form>
    </Box>
  );
}



export default BookForm;
