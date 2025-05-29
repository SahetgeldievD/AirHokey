const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gm = true;
let ball_speed = 10;
let xspeed = 0;
let yspeed = 0;
let com_score = 0;
let player_score = 0;
let x_min = 30;
let x_max = 460;
let y_min = 30;
let y_max = 600;

document.addEventListener("mousemove", mouseMoveHandler, false);

function draw_rect(x, y, w, h, b) {
  ctx.beginPath();
  ctx.strokeStyle = getComputedStyle(document.documentElement)
    .getPropertyValue(b ? '--border-dark' : '--border-light');
  ctx.lineWidth = b ? 40 : 4;
  ctx.strokeRect(x, y, w, h);
  ctx.closePath();
}

function draw_goal(x, y, r, s) {
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.arc(x, y, r, s ? 0 : Math.PI, s ? Math.PI : 0, false);
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-light');
  ctx.stroke();
  ctx.closePath();
}

function draw_circle(x, y, r, w) {
  ctx.beginPath();
  ctx.lineWidth = w;
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-light');
  ctx.stroke();
  ctx.closePath();
}

function draw_filled_circle(x, y, r, d) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  const styles = get_circle_styles(d);
  ctx.fillStyle = styles.fill;
  ctx.strokeStyle = styles.stroke;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function get_circle_styles(d) {
  const root = getComputedStyle(document.documentElement);
  if (d === 1) return {
    fill: root.getPropertyValue('--circle-1-fill'),
    stroke: root.getPropertyValue('--circle-1-stroke')
  };
  if (d === 2) return {
    fill: root.getPropertyValue('--circle-2-fill'),
    stroke: root.getPropertyValue('--circle-2-stroke')
  };
  return {
    fill: root.getPropertyValue('--circle-default-fill'),
    stroke: root.getPropertyValue('--circle-default-stroke')
  };
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  const relativeY = e.clientY - canvas.offsetTop;

  if (relativeX > 60 && relativeX < canvas.width - 60) pMallet.x = relativeX;
  if (relativeY > 0 && relativeY < 600) pMallet.y = relativeY;
}

function draw_board() {
  draw_rect(0, 0, 520, 660, 1);
  draw_rect(30, 30, 460, 600, 0);
  draw_goal(260, 30, 70, 1);
  draw_goal(260, 30, 150, 1);
  draw_goal(260, 630, 70, 0);
  draw_goal(260, 630, 150, 0);
  draw_circle(260, 330, 40, 4);
  draw_circle(260, 330, 5, 4);

  ctx.beginPath();
  ctx.moveTo(30, 330);
  ctx.lineTo(490, 330);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(190, 30);
  ctx.lineTo(330, 30);
  ctx.lineWidth = 4;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--center-line');
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(190, 630);
  ctx.lineTo(330, 630);
  ctx.stroke();
  ctx.closePath();

    ctx.font = "50px Arial";
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--score-color');
    ctx.fillText(com_score, 440, 300);
    ctx.fillText(player_score, 440, 380);
}

// Функция вычисления расстояния между двумя точками
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Класс кия
const Mallet = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.radius = r;
}

// Кий игрока
let pMallet = new Mallet(260, canvas.height - 100, 30);
// Кий компьютера
let cMallet = new Mallet(260, 100, 30);

// Класс шайбы
const Ball = function(x, y, r) {
  this.x = x;
  this.y = y;
  this.radius = r;
}

// Шайба
let ball = new Ball(canvas.width / 2, canvas.height - 200, 15);

// Управление кием игрока через мышь
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  let relativeY = e.clientY - canvas.offsetTop;

  if (relativeX > 60 && relativeX < canvas.width - 60)
    pMallet.x = relativeX;
  if (relativeY > 330 && relativeY < 600)
    pMallet.y = relativeY;
}

// Главная функция отрисовки и логики
function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_board();
  draw_filled_circle(pMallet.x, pMallet.y, pMallet.radius, 1);
  draw_filled_circle(cMallet.x, cMallet.y, cMallet.radius, 2);
  draw_filled_circle(ball.x, ball.y, ball.radius, 0);

  // Отскок шайбы от боковых стен
  if (ball.x + xspeed > canvas.width - ball.radius - 30 || ball.x + xspeed < ball.radius + 30) {
    xspeed *= -1;
  }

  // Отскок шайбы от верхней/нижней стен и логика голов
  if (ball.x > 190 && ball.x < 330) {
    if (ball.y + yspeed > canvas.height + ball.radius - 30) {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2 + 100;
      xspeed = 0;
      yspeed = 0;
      com_score++;
    } else if (ball.y + yspeed < 30 - ball.radius) {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2 - 100;
      xspeed = 0;
      yspeed = 0;
      player_score++;
    }
  } else {
    if (ball.y + yspeed > canvas.height - ball.radius - 30 || ball.y + yspeed < 30 + ball.radius) {
      yspeed *= -1;
    }
  }

  // ИИ соперника
  let ed = false; // сложность
  let er = 1;
  let p2s;
  if (ed) er = 5;

  if ((Math.abs(xspeed) + Math.abs(yspeed)) < 10 && ball.y <= canvas.height / 2) {
    if (ball.y - 20 > cMallet.y) cMallet.y += 2;
    else cMallet.y -= 2;
  } else if (cMallet.y > 100) cMallet.y -= 2;
  else if (cMallet.y < 100) cMallet.y += 2;

  if (cMallet.x < x_min) cMallet.x = x_min + 30;
  if (cMallet.x > x_max) cMallet.x = x_max + 30;
  if (cMallet.y < y_min) cMallet.y = y_min + 60;
  if (cMallet.y > y_max) cMallet.y = y_max;

  p2s = !ed ? 2 : 3;

  if (ball.y < cMallet.y && ball.x > cMallet.x - 30 && ball.x < cMallet.x + 30)
    p2s = -2;

  if (cMallet.x < ball.x + er) cMallet.x += p2s;
  if (cMallet.x > ball.x - er) cMallet.x -= p2s;

  // Удар по шайбе игроком
  let pDist = distance(pMallet.x, pMallet.y, ball.x, ball.y);
  if (pDist < 45) {
    let dx = (ball.x - pMallet.x) / 30;
    let dy = (ball.y - pMallet.y) / 30;
    xspeed = dx * ball_speed;
    yspeed = dy * ball_speed;
  }

  // Удар по шайбе компьютером
  let cDist = distance(cMallet.x, cMallet.y, ball.x, ball.y);
  if (cDist < 45) {
    let cdx = (ball.x - cMallet.x) / 45;
    let cdy = (ball.y - cMallet.y) / 45;
    xspeed = cdx * ball_speed;
    yspeed = cdy * ball_speed;
  }

  // Обновление позиции шайбы
  ball.x += xspeed;
  ball.y += yspeed;
  xspeed *= 0.99;
  yspeed *= 0.99;
}

// Запуск игры
setInterval(play, 10);