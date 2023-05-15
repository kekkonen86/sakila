const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const etag = require('etag')
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public', { 'extensions': ['css'] }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sakila'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the Sakila database');
  });

  app.get('/films', (req, res) => {
    const { hae } = req.query;
    const searchQuery = hae || ''; // Provide a default value of an empty string if hae is undefined
  
    let filmQuery = 'SELECT * FROM film';
    const categoryQuery = 'SELECT * FROM category';
  
    connection.query(filmQuery, (filmError, filmResults) => {
      if (filmError) {
        console.error('Error executing the film query:', filmError);
        return;
      }
  
      connection.query(categoryQuery, (categoryError, categoryResults) => {
        if (categoryError) {
          console.error('Error executing the category query:', categoryError);
          return;
        }
  
        res.render('films', { films: filmResults, categories: categoryResults, searchQuery: searchQuery });
      });
    });
  });
    
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });