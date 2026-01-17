import socket from "./socket.js";

// ================= CANVAS =================
const mainCanvas = document.getElementById("mainCanvas");
const liveCanvas = document.getElementById("strokeCanvas");
const cursorCanvas = document.getElementById("cursorCanvas");

const mainCtx = mainCanvas.getContext("2d");
const liveCtx = liveCanvas.getContext("2d");
const cursorCtx = cursorCanvas.getContext("2d");

[mainCanvas, liveCanvas, cursorCanvas].forEach(c => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
});

// ================= UI =================
const colorPicker = document.getElementById("colorPicker");
const strokeWidth = document.getElementById("strokeWidth");
const clearBtn = document.getElementById("clearBtn");
const usersList = document.getElementById("usersList");

// ================= STATE =================
let strokes = [];
let users = {};
let drawing = false;
let currentStroke = null;
let lastRemote = {};

// ================= HELPERS =================
function getPoint(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return {
    x: e.clientX,
    y: e.clientY
  };
}

function draw(ctx, a, b, stroke) {
  ctx.save();
  ctx.globalCompositeOperation = stroke.erase
    ? "destination-out"
    : "source-over";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();
}

// ================= DRAW START =================
function startDraw(e) {
  e.preventDefault();
  drawing = true;

  const p = getPoint(e);

  currentStroke = {
    points: [p],
    color: colorPicker.value,
    width: Number(strokeWidth.value),
    erase: window.tools.current === "eraser"
  };
}

// ================= DRAW MOVE =================
function moveDraw(e) {
  e.preventDefault();
  const p = getPoint(e);

  socket.emit("cursor:move", p);
  if (!drawing) return;

  const last = currentStroke.points.at(-1);

  draw(
    currentStroke.erase ? mainCtx : liveCtx,
    last,
    p,
    currentStroke
  );

  currentStroke.points.push(p);

  socket.emit("stroke:update", {
    point: p,
    color: currentStroke.color,
    width: currentStroke.width,
    erase: currentStroke.erase
  });
}

// ================= DRAW END =================
function endDraw(e) {
  e.preventDefault();
  if (!drawing) return;
  drawing = false;

  socket.emit("stroke:end", currentStroke);
  liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);
}

// ================= MOUSE EVENTS =================
mainCanvas.addEventListener("mousedown", startDraw);
mainCanvas.addEventListener("mousemove", moveDraw);
mainCanvas.addEventListener("mouseup", endDraw);
mainCanvas.addEventListener("mouseleave", endDraw);

// ================= TOUCH EVENTS =================
mainCanvas.addEventListener("touchstart", startDraw, { passive: false });
mainCanvas.addEventListener("touchmove", moveDraw, { passive: false });
mainCanvas.addEventListener("touchend", endDraw);
mainCanvas.addEventListener("touchcancel", endDraw);

// ================= SOCKET EVENTS =================
socket.on("init", data => {
  strokes = data.strokes;
  users = data.users;
  updateUsers();
  redraw();
});

socket.on("user:joined", u => {
  users[u.id] = u;
  updateUsers();
});

socket.on("user:left", id => {
  delete users[id];
  updateUsers();
});

socket.on("cursor:move", d => {
  users[d.userId] = users[d.userId] || {};
  users[d.userId].cursor = d;

  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  Object.values(users).forEach(u => {
    if (!u.cursor) return;
    cursorCtx.beginPath();
    cursorCtx.arc(u.cursor.x, u.cursor.y, 4, 0, Math.PI * 2);
    cursorCtx.fill();
  });
});

socket.on("stroke:update", d => {
  if (!lastRemote[d.userId]) {
    lastRemote[d.userId] = d.point;
    return;
  }

  draw(
    d.erase ? mainCtx : liveCtx,
    lastRemote[d.userId],
    d.point,
    d
  );

  lastRemote[d.userId] = d.point;
});

socket.on("stroke", s => {
  strokes.push(s);
  delete lastRemote[s.userId];
  if (!drawing) redraw();
});

socket.on("history:update", serverStrokes => {
  strokes = serverStrokes;
  redraw();
});

// ================= REDRAW =================
function redraw() {
  mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  liveCtx.clearRect(0, 0, liveCanvas.width, liveCanvas.height);

  strokes.forEach(s => {
    if (s.undone) return;
    for (let i = 1; i < s.points.length; i++) {
      draw(mainCtx, s.points[i - 1], s.points[i], s);
    }
  });
}

// ================= USERS =================
function updateUsers() {
  usersList.innerHTML = "";
  Object.values(users).forEach(u => {
    const li = document.createElement("li");
    li.textContent = u.id.slice(0, 5);
    usersList.appendChild(li);
  });
}

// ================= CLEAR =================
clearBtn.onclick = () => {
  if (confirm("Clear canvas for everyone?")) {
    socket.emit("clear");
  }
};

// ================= SHORTCUTS =================
document.onkeydown = e => {
  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    socket.emit("undo");
  }
  if (e.ctrlKey && e.key === "y") {
    e.preventDefault();
    socket.emit("redo");
  }
};
