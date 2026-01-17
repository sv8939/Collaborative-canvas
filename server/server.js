const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const drawingState = require("./drawing-state");
const rooms = require("./rooms");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ================= STATIC FILES =================
// This serves client/index.html, main.js, css, etc.
app.use(express.static("client"));

// ================= LOAD PERSISTED STATE =================
drawingState.load();

// ================= CURSOR RATE LIMIT =================
const lastCursorEvent = {};
function allowCursor(socket, limitMs = 16) {
  const now = Date.now();
  if (!lastCursorEvent[socket.id] || now - lastCursorEvent[socket.id] > limitMs) {
    lastCursorEvent[socket.id] = now;
    return true;
  }
  return false;
}

// ================= SOCKET.IO =================
io.on("connection", socket => {
  console.log("User connected:", socket.id);

  const ROOM_ID = "default";
  rooms.addUser(ROOM_ID, socket.id);

  // Send full state to new user
  socket.emit("init", {
    strokes: drawingState.getStrokes(),
    users: rooms.getRoom(ROOM_ID).users
  });

  socket.broadcast.emit("user:joined", { id: socket.id });

  // -------- Cursor movement --------
  socket.on("cursor:move", pos => {
    if (!pos || typeof pos.x !== "number") return;
    if (!allowCursor(socket)) return;

    socket.broadcast.emit("cursor:move", {
      userId: socket.id,
      x: pos.x,
      y: pos.y
    });
  });

  // -------- Live drawing (no throttling) --------
  socket.on("stroke:update", data => {
    if (!data || !data.point) return;

    socket.broadcast.emit("stroke:update", {
      userId: socket.id,
      ...data
    });
  });

  // -------- Finalize stroke --------
  socket.on("stroke:end", stroke => {
    if (!stroke || !stroke.points) return;

    const fullStroke = {
      id: uuidv4(),
      userId: socket.id,
      points: stroke.points,
      color: stroke.color,
      width: stroke.width,
      erase: stroke.erase,
      undone: false
    };

    drawingState.addStroke(fullStroke);
    io.emit("stroke", fullStroke);
  });

  // -------- Undo / Redo --------
  socket.on("undo", () => {
    drawingState.undo();
    io.emit("history:update", drawingState.getStrokes());
  });

  socket.on("redo", () => {
    drawingState.redo();
    io.emit("history:update", drawingState.getStrokes());
  });

  // -------- Clear canvas --------
  socket.on("clear", () => {
    drawingState.clear();
    io.emit("history:update", drawingState.getStrokes());
  });

  // -------- Disconnect --------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    rooms.removeUser(ROOM_ID, socket.id);
    io.emit("user:left", socket.id);
  });
});

// ================= START SERVER (DEPLOYMENT SAFE) =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
