const express = require('express');
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')

app.use(express.json());
dotenv.config();


// connecting to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if connection is successful
db.connect((err) => {
    if(err){
        console.log('Error connecting to mysql', err.message);
        return;
        
    }
    console.log('Connected succesfully to the MYSQL id:', db.threadId);
    
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// Question 1
app.get('/patients', (req, res) =>{
    db.query(
        `SELECT patient_id, first_name, last_name, date_of_birth 
            FROM patients`,
        (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).send('Error retireving data')
            }
            else{
                res.render('data', {results:results})
            }
        });
});

// Question 2
app.get('/providers', (req, res) => {
    db.query(
        `SELECT first_name, last_name, provider_specialty
            FROM providers
        `,
        (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).send('Error retrieving data')
                
            }else{
                res.render('providers', {results:results})
            }
        });
});


// Question 3
app.get('/display', (req, res) =>{
    db.query(
        `SELECT first_name
            FROM patients
        `
    ,
    (err, results) => {
        if(err){
            console.log(err);
            res.status(500).send('Error retrieving data');
        }else{
            res.render('display_firstname', {results:results})
        }
    });
})


// Question 4
app.get('/specialty', (req, res) => {
    db.query(
        `
            SELECT CONCAT(first_name, ' ', last_name) AS full_name, provider_specialty
            FROM providers
        `,
        (err, results) => {
            if(err){
                res.status(500).send('Error retrieving data')
            }else{
                res.render('specialty', {results:results});
            }
        });
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    app.get('/', (req, res) =>{
        res.send('Server started succesfully');  

    })
})
