const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./utils/database');

const isAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const trackRoutes = require('./routes/track');
const lapRoutes = require('./routes/lap-set');

const app = express();

app.use(express.json())

// parse JSON data
app.use(bodyParser.json());

app.use((req,res,next) => {
    console.log('Received request with method ' + req.method);
    next();
});

// set headers
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    if (req.method == 'OPTIONS') { // TODO - improve CORS preflight handling
        res.sendStatus(204);
    } else {
        next();
    }
});

// routes
app.use('/auth', authRoutes);
app.use('/track', isAuth, trackRoutes);
app.use('/lap', isAuth, lapRoutes);

// 404 handler
app.use((req,res) => {
    res.status(404).json();
});

// error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({msg: message, data: data});
});

// init database and app
sequelize
    .sync()
    //.sync({alter: true})
    //.sync({force: true})
    .then((result) => {
        app.listen(8000);
    })
    .catch((err) => {
        console.log(err);
    })
