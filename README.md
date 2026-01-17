#  Real-Time Collaborative Drawing Canvas

A real-time, multi-user drawing application where multiple users can draw simultaneously on a shared canvas with live synchronization, cursor indicators, and **global undo / redo**.

---

## 🌐 Live Demo

🔗 **[https://collaborative-canvas-r16m.onrender.com/](https://collaborative-canvas-r16m.onrender.com/)**

Open the link in multiple browsers or devices to test real-time collaboration.

---

## 📋 Assignment Overview

Build a multi-user drawing application where multiple people can draw simultaneously on the same canvas with real-time synchronization.

This project focuses on **real-time systems**, **canvas rendering**, and **state synchronization** across multiple users.

---

## 🚀 Features

### Core Features

* 🖌️ Brush and eraser tools
* 🎨 Color picker and stroke width adjustment
* ⚡ Real-time drawing (visible while users draw)
* 👆 Live cursor indicators
* 👥 Online users list
* 🔄 Global undo / redo (works across all users)
* 🧹 Clear canvas (global, undoable)
* 📱 Mobile touch support (bonus)

---

## 🧱 Technical Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | HTML, CSS, Vanilla JavaScript (ES Modules) |
| Drawing    | HTML5 Canvas API                           |
| Backend    | Node.js, Express                           |
| Real-time  | Socket.IO                                  |
| Deployment | Render                                     |

---

## 📂 Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── socket.js
│   ├── tools.js
│   └── main.js
├── server/
│   ├── server.js
│   ├── rooms.js
│   └── drawing-state.js
├── strokes.json
├── README.md
└── ARCHITECTURE.md
```

---

## 🛠️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start the Server

```bash
npm start
```

### 3️⃣ Open the App

```
http://localhost:3000
```

---

## 🧪 How to Test with Multiple Users

1. Open the live demo link or local app
2. Open a second browser or incognito window
3. Draw simultaneously in both windows
4. Verify:

   * Live drawing appears instantly
   * Cursor movements are visible
   * Online users list updates
   * Undo / redo works globally
   * Clear canvas affects all users

---

## 🔄 Persistence Behavior

* The canvas state is persisted on the server
* When the server restarts, the previous drawing session is restored
* Only finalized strokes and history mutations are persisted
* Live drawing and cursor movement are not persisted

This behavior demonstrates robustness and server-authoritative state management.

---

## ⚠️ Known Limitations

* No authentication
* Single shared room (architecture supports extension)
* No pressure-sensitive input
* No zoom / pan support

---

## ⏱️ Time Spent

Approximate time investment:

* Real-time drawing & synchronization: 6–7 hours
* Global undo / redo & clear logic: 4–5 hours
* Debugging & stabilization: 4–5 hours
* Architecture & documentation: 2 hours

**Total:** ~16–19 hours

---

## 🧠 What This Project Demonstrates

* Canvas API mastery without external libraries
* Real-time WebSocket-based collaboration
* Server-authoritative state synchronization
* Correct global undo / redo implementation
* Conflict resolution via ordered operations
* Clean separation of concerns
* Production-ready deployment

---

## 📄 Documentation

See **`ARCHITECTURE.md`** for:

* Data flow diagrams
* WebSocket protocol definitions
* Undo / redo strategy
* Performance considerations
* Conflict resolution approach

---

## 📌 Final Notes

This project prioritizes **correctness, real-time behavior, and maintainability** over premature optimization.
It is designed to be easily extensible with features such as multiple rooms, persistence backends, or advanced drawing tools.

---

**Author:** Saurabh Verma
**Project Type:** Real-Time Collaborative Systems
