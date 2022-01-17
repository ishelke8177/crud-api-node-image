const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// connect to the DB
connectDB();

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use('/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
