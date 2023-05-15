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
    const searchQuery = hae || ''; 
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

  app.get('/films/:id', (req, res) => {
    const filmId = req.params.id;
    const filmQuery = `SELECT * FROM film WHERE film_id = ${filmId}`;
    const filmTextQuery = `SELECT * FROM film_text WHERE film_id = ${filmId}`;
    const query = 'SELECT * FROM films WHERE title LIKE ?';
    const searchQuery = req.query.hae ? '%' + req.query.hae + '%' : ''; 
  
    connection.query(filmQuery, (filmError, filmResults) => {
      if (filmError) {
        console.error('Error executing the film query:', filmError);
        return;
      }
  
      connection.query(filmTextQuery, (filmTextError, filmTextResults) => {
        if (filmTextError) {
          console.error('Error executing the film_text query:', filmTextError);
          return;
        }
  
        const film = filmResults[0]; 
        const filmText = filmTextResults[0]; 
  
        res.render('film-details', { film, filmText, searchQuery });
      });
    });
  });
        
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });