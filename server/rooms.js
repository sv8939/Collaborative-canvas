const rooms = {};

function getRoom(roomId = "default") {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      users: {}
    };
  }
  return rooms[roomId];
}

function addUser(roomId, socketId) {
  const room = getRoom(roomId);
  room.users[socketId] = { id: socketId };
}

function removeUser(roomId, socketId) {
  const room = getRoom(roomId);
  delete room.users[socketId];
}

module.exports = {
  getRoom,
  addUser,
  removeUser
};
