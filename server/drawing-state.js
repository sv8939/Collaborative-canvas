const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "strokes.json");

let strokes = [];
let redoStack = [];
let clearStack = []; // ✅ NEW

function load() {
  if (fs.existsSync(DATA_FILE)) {
    strokes = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  }
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(strokes, null, 2));
}

function getStrokes() {
  return strokes;
}

function addStroke(stroke) {
  strokes.push(stroke);
  redoStack = [];
  clearStack = [];
  save();
}

function undo() {
  // If last action was CLEAR
  if (clearStack.length > 0) {
    strokes = clearStack.pop();
    save();
    return;
  }

  for (let i = strokes.length - 1; i >= 0; i--) {
    if (!strokes[i].undone) {
      strokes[i].undone = true;
      redoStack.push(strokes[i].id);
      save();
      return;
    }
  }
}

function redo() {
  if (redoStack.length === 0) return;

  const id = redoStack.pop();
  const stroke = strokes.find(s => s.id === id);
  if (stroke) {
    stroke.undone = false;
    save();
  }
}

function clear() {
  if (strokes.length === 0) return;
  clearStack.push(JSON.parse(JSON.stringify(strokes))); // deep copy
  strokes = [];
  redoStack = [];
  save();
}

module.exports = {
  load,
  getStrokes,
  addStroke,
  undo,
  redo,
  clear
};
