// Star and ShootingStar objects (plain JS, no types)
let canvas = null;
let ctx = null;
let width = 0;
let height = 0;
let stars = [];
let shootingStars = [];

function getCanvas() {
  const el = document.getElementById("stars");
  if (el && el instanceof HTMLCanvasElement) {
    return el;
  }
  return null;
}

function resizeCanvas() {
  canvas = getCanvas();
  ctx = canvas ? canvas.getContext("2d") : null;
  if (!canvas) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createStars();
}

function createStars() {
  stars = [];
  for (let i = 0; i < 250; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 1.5,
      alpha: Math.random() * 0.6 + 0.2,
      delta: Math.random() * 0.02
    });
  }
}

function createShootingStar() {
  // Start from the top or left edge, not the middle
  const edge = Math.random() < 0.5 ? 'top' : 'left';
  let x, y, angle;
  if (edge === 'top') {
    x = Math.random() * width;
    y = 0;
    angle = (Math.PI / 2) + (Math.random() - 0.5) * 1.2; // Downward, random spread
  } else {
    x = 0;
    y = Math.random() * (height * 0.7); // Top 70% of screen
    angle = (Math.PI / 4) + (Math.random() - 0.5) * 1.2; // Diagonal, random spread
  }
  shootingStars.push({
    x,
    y,
    length: 60 + Math.random() * 40,
    speed: 5 + Math.random() * 2,
    angle,
    alpha: 1,
    active: true
  });
}

function drawStars() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  }
}

function drawShootingStars() {
  if (!ctx) return;
  for (let s of shootingStars) {
    if (!s.active) continue;
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - Math.cos(s.angle) * s.length,
      s.y - Math.sin(s.angle) * s.length
    );
    ctx.shadowColor = "white";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }
}

function updateShootingStars() {
  for (let s of shootingStars) {
    if (!s.active) continue;
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.012;
    if (
      s.x > width + s.length ||
      s.y > height + s.length ||
      s.alpha <= 0
    ) {
      s.active = false;
    }
  }
  shootingStars = shootingStars.filter((s) => s.active);
}

function animate() {
  drawStars();
  drawShootingStars();
  updateShootingStars();
  requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", () => {
  resizeCanvas();
  animate();
  window.addEventListener("resize", resizeCanvas);
  // Occasionally spawn a shooting star
  setInterval(() => {
    if (Math.random() < 0.18) createShootingStar(); // Less frequent
  }, 1800); // Less frequent interval
});
