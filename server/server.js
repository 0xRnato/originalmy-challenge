const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

require('./config/config');
const db = require('./db/db');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'client/')));
// app.use(favicon(path.join(__dirname, 'client', 'favicon.ico')));

require('./routes/user.route')(app, db);

app.get('*', (req, res) => {
    res.sendFile(path.resolve('client/index.html'));
});

app.listen(process.env.PORT);
console.log(`Magic happens at http://localhost:${process.env.PORT}`);
