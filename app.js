const express = require('express');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const sequelize = require('./utils/database');

const isAuth = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const trackRoutes = require('./routes/track');
const lapRoutes = require('./routes/lap-set');

const app = express();

app.use(express.json())

app.use(cors());

// parse JSON data
app.use(express.json());

app.use((req,res,next) => {
    next();
});

// set headers
app.use((req,res,next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
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
        app.listen(8000, '0.0.0.0'); // TODO: listen to IPv6 address
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app;
