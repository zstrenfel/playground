
/** Socket File  */
module.exports =  function(socket) {
  var clients, newData;

  /** On user connecting */
  console.log('user connected');

  /** On intialization of game, broadcase to the other user name of opponent. */
  socket.on('init', (data) => {
    socket.broadcast.to(data.room).emit('init', data.user);
  })

  /** Name emitted by current user already in the room */
  socket.on('give_name', (data) => {
    socket.broadcast.to(data.room).emit('take_name', data.user);
  })
  /** Join the correct room */


  /** Send current points to the other user */
  socket.on('tell_points', (data) => {
    console.log('logging points', data.score, 'to: ', data.room);
    socket.broadcast.to(data.room).emit('take_points', data.score);
  })

  /** Send users correct guess to the other side. */
  socket.on('push_message', (data) => {
    console.log('recieved push');
    socket.broadcast.to(data.room).emit('pull_message', (data));
  })

  /** On user leaving the room */
  socket.on('disconnect', function(){
    console.log('user diconnected');
  });

  socket.on('join_room', (data) => {
    console.log('user joinning room: ', data.room)
    socket.join(data.room);
  })
}
