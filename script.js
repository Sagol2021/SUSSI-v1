// JavaScript Document
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");

// set starting values
var fps = 60;    // fotogramas por segundo
var percent = 0 //porcentaje
var direction = 1; //dirección

// start the animation
cuadroSm();
cuadroBg();
drawText("poblaci\u00F3n que no",canvas.width/20,canvas.height/2);
drawText("puede polinizar bien",canvas.width/20 - 10,canvas.height/2 + 15);
drawText("Poblaci\u00F3n que puede polinizar bien", canvas.width/2,canvas.height/2);
graph();
animate();

function animate() {

  // set the animation position (0-100)
  percent += direction;
  if (percent < 0) {
    percent = 0;
    direction = 1;
  };
  if (percent > 100) {
    percent = 100;
    direction = -1;
  };

  draw(percent);

  // request another frame
  setTimeout(function() {
    requestAnimationFrame(animate);
  }, 1000 / fps);
}
/////////////////////////////
// draw the current frame based on sliderValue
function graph() {

  // redraw path
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.lineWidth = 5;

  ctx.beginPath(); //trazo de la linea roja 
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.strokeStyle = 'red';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.quadraticCurveTo(200, 0, 320,100);
  ctx.strokeStyle = 'green';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(320, 100);
  //ctx.bezierCurveTo(460, 200, 340, 100, 520, 200);
  ctx.quadraticCurveTo(500, 250, 700,180);
  ctx.strokeStyle = 'blue';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(700, 180);
  ctx.lineTo(1000, 100);
  ctx.strokeStyle = 'gold';
  ctx.stroke();


}


function cuadroSm(){
	ctx.fillStyle = '#e6e6e6';
	ctx.fillRect(0,0,150,200);
 }
 
 function cuadroBg(){
	ctx.fillStyle = '#eddbca';
	ctx.fillRect(150,0,850,200);
 }
 
function drawText(text,x,y){
    ctx.fillStyle = "#000";
    ctx.font = "12px sans-serif";
    ctx.fillText(text, x, y);
}



// draw the current frame based on sliderValue
function draw(sliderValue) {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  // draw the tracking rectangle
  var xy;

  if (sliderValue < 25) {
    var percent = sliderValue / 24;
    xy = getLineXYatPercent({x: 0, y: 0}, {x: 100, y: 0}, percent);
  } else if (sliderValue < 50) {
    var percent = (sliderValue - 25) / 24
    xy = getQuadraticBezierXYatPercent({x: 100, y: 0}, {x: 200, y: 0}, {x: 320, y: 100}, percent);
  } else if (sliderValue < 75) {
    var percent = (sliderValue - 50) / 24
    xy = getQuadraticBezierXYatPercent({x: 320, y: 100}, {x: 500, y: 250}, {x: 700, y: 180}, percent);
  } else {
    var percent = (sliderValue - 75) / 25
    xy = getLineXYatPercent({x: 700, y: 180}, {x: 1000, y: 100}, percent);
  }
  drawBall(xy, "red"); //Llama a la función para pintar según la psición 

}


// Popiedades de la bola
function drawBall(point, color) {
  ctx2.fillStyle = "magenta";
  ctx2.strokeStyle = "gray";
  ctx2.lineWidth = 3;
  ctx2.beginPath();
  ctx2.arc(point.x, point.y, 8, 0, Math.PI * 2, false)
  ctx2.closePath()
  ctx2.fill();
  ctx2.stroke();
}


// line: percent is 0-1
function getLineXYatPercent(startPt, endPt, percent) {
  var dx = endPt.x - startPt.x;
  var dy = endPt.y - startPt.y;
  var X = startPt.x + dx * percent;
  var Y = startPt.y + dy * percent;
  return ({x: X, y: Y});
}

// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
  var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
  var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
  return ({x: x, y: y});
}

// cubic bezier percent is 0-1
function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
  var x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
  var y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
  return ({x: x, y: y});
}

// cubic helper formula at percent distance
function CubicN(pct, a, b, c, d) {
  var t2 = pct * pct;
  var t3 = t2 * pct;
  return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}
