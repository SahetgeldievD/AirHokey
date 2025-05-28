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

draw_board();