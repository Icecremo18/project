var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret ='login-api'
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


app.use(cors())
app.use(bodyParser.json());


const mysql = require('mysql2');
// create the connection to database
const connection =  mysql.createConnection({
    host: "localhost",
  user: "root",
  password: "root",
  database: "mysql-nodejs",
  port: "3001",
});

app.post('/register', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            "INSERT INTO users (`username`, `password`, `email`, `phone`, `First Name`, `Last Name`, `Role`) VALUES (?, ?, ?, ?, ?, ?,'user')",
            [req.body.username, hash, req.body.email_address, req.body.phone, req.body.fname, req.body.lname],
            function(err, results, fields) {
                if (err) {
                    res.json({status: 'error', message: err})
                    return
                }
                res.json({status: 'ok'})     
            }
        );  
    });
})

app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE username=?',
        [req.body.username],
        function(err, users, fields) {
            if (err) { res.json({status: 'error', message: err}); return }
            if (users.length == 0) { res.json({status: 'error', message: 'no user found'}); return }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
                if (isLogin) {
                    var token = jwt.sign({ username: users[0].username,Role: users[0].Role}, secret, { expiresIn: '1h' });
                    res.json({status: 'ok', message: 'login success', token})
                    console.log(err)
                } else {
                    res.json({status: 'error', message: 'login failed'})
                }
            });
        }
    );  
})





app.post('/authen', jsonParser, function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', decoded }); // This line sends the response
    } catch(err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.listen(3333, jsonParser, function () {
  console.log('CORS-enabled web server listening on port 3333')
})





const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]);

app.post('/addbook', uploadMiddleware, async (req, res) => {
  try {
    const { name, detail, write, publish, typing } = req.body;
    const coverImage = req.files['coverImage'][0];
    const pdfFile = req.files['pdfFile'][0];
    console.log(typing)

    // Get categoryID from the database
    const sqlSelectCategoryID = 'SELECT categoryID FROM categories WHERE categoryName = ?';
    connection.promise().query(sqlSelectCategoryID, [typing])
      .then(([categoryResult]) => {
        if (!categoryResult || categoryResult.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }

        const categoryID = categoryResult[0].categoryID;

        // Insert book details including the cover image into 'books' table
        return connection.promise().query(
          'INSERT INTO book (`name`, `detail`, `write`, `publish`, `categoryID`, `cover_image`,`PDF`) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, detail, write, publish, categoryID, coverImage.buffer, pdfFile.buffer]
        );
      })
      .then(() => {
        // Values inserted successfully, send a success response
        res.status(200).send('Values inserted');
      })
      .catch(error => {
        console.error('Error:', error);
        // Error occurred, send an error response
        res.status(500).send('Error processing PDF file');
      });
  } catch (error) {
    console.error('Error:', error);
    // Error occurred, send an error response
    res.status(500).send('Error processing PDF file');
  }
});

// SELECT book.*, CONVERT(book.PDF USING utf8) AS pdf, category.categoryName
// FROM book
// JOIN category ON book.categoryID = category.categoryID
// ORDER BY book.name ASC;

  app.get('/books', async (req, res) => {
    connection.query('SELECT *, CONVERT(PDF USING utf8) as pdf , categories.categoryName FROM book  JOIN categories ON book.categoryID  = categories.categoryID   ORDER BY book.name ASC ' , (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(results);
      }
    });
  });
  
  
  app.get('/users', async (req, res) => {
    connection.query('SELECT * FROM users WHERE Role = ? ORDER BY username ASC', ['user'], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(results);
      }
    });
  });



  // Express route to update user data by userId
  app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    
  
    connection.query('DELETE FROM users WHERE ID = ?' , [ userId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send({ message: 'Delere ss' });
      }
    });
  });
  
  







app.delete('/books/:id', (req, res) => {
    const id = req.params.id; // Get the book ID from URL parameters
  
    // Define the SQL query
    const sql = 'DELETE FROM book WHERE bookID = ?';
  
    // Execute the query with the provided ID
    connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error deleting book data:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err });
      }
  
      // If no book with the specified ID was found
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Send a JSON response after successful deletion
      res.json({ message: 'Book deleted successfully' });
    });
  });

  
  





  app.put('/editbook/:bookID', (req, res) => {
    const bookId = req.params.bookID;
  
    // ตรวจสอบว่า req.body.name ไม่ได้เป็น undefined หรือ null
    if (!req.body.name && req.body.name !== null) {
      return res.status(400).json({ message: 'Invalid book name' });
    }
  
    const newName = req.body.name;
  
    // ทำการอัพเดทข้อมูลในฐานข้อมูล
    connection.query(
      'UPDATE book SET name = ?, detail = ?, `write` = ?, publish = ? WHERE bookID = ?',
      [newName,req.body.detail, req.body.write, req .body.publish, bookId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        // ตรวจสอบว่ามีการอัพเดทได้หรือไม่
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }
  
        // ส่ง response กลับไปยัง client
        res.status(200).json({ message: 'DONE' });
      }
    );
  });
  
  
  


  
  
  





  app.put('/edituser/:userID', (req, res) => {
    const userID = req.params.userID;
  
    // ตรวจสอบว่า req.body.name ไม่ได้เป็น undefined หรือ null
    if (!req.body.username || !req.body.useremail || !req.body.userphone) {
      return res.status(400).json({ message: 'Invalid user data. Please provide username, useremail, and userphone.' });
    }
    
  
    
  
    // ทำการอัพเดทข้อมูลในฐานข้อมูล
    connection.query(
      'UPDATE users SET username = ?, email = ?, phone = ? WHERE ID = ?',
      [req.body.username,req.body.useremail, req.body.userphone, userID],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
  
        // ตรวจสอบว่ามีการอัพเดทได้หรือไม่
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }
  
        // ส่ง response กลับไปยัง client
        res.status(200).json({ message: 'DONE' });
      }
    );
  });













