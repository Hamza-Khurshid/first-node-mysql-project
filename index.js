const express = require('express');
const db = require('./server/config/db');
const dotenv = require('dotenv');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// use the modules
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();

// Connect MySQL
db.connect();

// Import Routes
const authRoute = require('./server/routes/auth');

// Route Middlewares
app.use('/api/users', authRoute);

app.get('/list', (req, res) => {
    // get user lists
    let sql = `SELECT * FROM users`;
    db.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.json({
            status: 200,
            data,
            message: "User lists retrieved successfully"
        })
    })
})

app.listen(3005, () => console.log('Server is running'));