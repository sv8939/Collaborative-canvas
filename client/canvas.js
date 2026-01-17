export function setupCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas.getContext("2d");
}

export function drawLine(ctx, a, b, color, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}
