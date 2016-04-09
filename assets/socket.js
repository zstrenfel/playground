

var actions = function(socket) {
  socket.emit('init', {
    message: "here we go"
  });
}

module.export = actions;