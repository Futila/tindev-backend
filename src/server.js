const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { use } = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  
});

const connectedUsers = {};


io.on('connection', socket=>{
    const {user}= socket.handshake.query;

    connectedUsers[user] = socket.id;
});

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@goweek-backend.0toen.mongodb.net/onministack8?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) =>{
    req.io = io;
    req.connectedUsers = connectedUsers;


    return next();
});

app.use(cors());
app.use(express.json());
app.use(require('./routes'));


server.listen(process.env.PORT || 3333);