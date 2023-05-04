require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dbConnection = require('./database/db');
const app = express();
const { createServer } = require('http');
const realtimeServer = require('./realtimeServer');
const bodyParser = require('body-parser');
const httpServer = createServer(app);

dbConnection()

const PORT = 4000;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./routes/user.routes'))

httpServer.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

realtimeServer(httpServer)