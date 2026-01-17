// ================= TOOL STATE =================
window.tools = {
  current: "brush"
};

// ================= DOM ELEMENTS =================
const brushBtn = document.getElementById("brushBtn");
const eraserBtn = document.getElementById("eraserBtn");

// ================= TOOL SELECTION =================
function setTool(tool) {
  window.tools.current = tool;

  brushBtn.classList.toggle("active", tool === "brush");
  eraserBtn.classList.toggle("active", tool === "eraser");
}

// ================= EVENTS =================
brushBtn.addEventListener("click", () => {
  setTool("brush");
});

eraserBtn.addEventListener("click", () => {
  setTool("eraser");
});

// ================= DEFAULT =================
setTool("brush");
