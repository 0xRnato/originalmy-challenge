const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

require('./config/config');
const db = require('./db/db');

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../client'));
app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));

require('./routes/user.route')(app, db);

app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, '../client', 'index.html'));
});

let users = [];
require('./socket')(io, users);

http.listen(process.env.PORT);
console.log(`Server running at http://localhost:${process.env.PORT}`);

module.exports = {app, db};
