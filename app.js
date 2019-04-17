const express = require('express');
const app = express(); 
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(
    'mongodb://giorbismiguel:' + 
    process.env.MONGO_ATLAS_PW + 
    '@cluster0-shard-00-00-drksp.mongodb.net:27017,cluster0-shard-00-01-drksp.mongodb.net:27017,cluster0-shard-00-02-drksp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    { 
        useNewUrlParser: true 
    }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('uploads ', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({}); 
    }
    next();
});

// Handle incoming request GET request for all.

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status(404);
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});
    
module.exports = app;