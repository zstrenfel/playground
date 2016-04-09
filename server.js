// ==============================
// server.js
// ==============================

// modules ----------------------
var express             = require('express');
var path                = require('path');
var cors = require('express-cors')

// Environment ------------------
var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8000;

// Express Setup ----------------
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port);


//allows CORs
app.use(cors({
  allowedOrigins: [
    'localhost:7000', 'localhost:8000'
  ]
}));


io.on('connection', function(socket){
  console.log('user connectd');
  //on intialization of game
  socket.on('init', (data) => {
    socket.broadcast.to(data.room).emit('init', data.user);
  })
  //add to correct room
  socket.on('join_room', (data) => {
    socket.join(data.room);
  })
  //send message logic
  socket.on('push_message', (data) => {
    socket.broadcast.to(data.room).emit('pull_message', (data));
  })
  //on
  socket.on('disconnect', function(){
  });
})

// Static files -----------------
app.use(express.static(__dirname + '/production'));

// Routes -----------------------
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './production', 'index.html'));
});

// Launch app -------------------
//app.listen(port);

//app.listen(port, '10.134.0.227');
console.log("*** server running");
exports = module.exports = app;
