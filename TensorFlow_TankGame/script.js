//#region speech api
let speechAPI;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

    speechAPI = true;
  } else {

    speechAPI = false;
    console.log("Speech API is not supported by this browser, use Chrome or Edge");

  }
let myRec = new p5.SpeechRec('en-US', parseResult);
myRec.continuous = true;
myRec.interimResults = true;

function setup()
{
    myRec.start(); // start engine
}
//#endregion
//#region Canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;

//#endregion
//#region variables etc.
let spriteSheet, sw, sh, greenTank, backGround;

spriteSheet = new Image();
spriteSheet.src = "images/tanksheet.png";
//#endregion
//#region greenTank
greenTank = {};
greenTank.animationArray = [8,7,6,5,4,3,2,1];
greenTank.index = 0;
greenTank.direction = 0;
greenTank.speed = 5

greenTank.x = 120;
greenTank.y = 200;

greenTank.vx = 0;
greenTank.vy = -greenTank.speed;


greenTank.draw = function(){
  greenTank.sx = greenTank.animationArray[greenTank.index]%8 * 84;
  greenTank.sy = Math.floor(greenTank.animationArray[greenTank.index]/8) * 84;
  context.save();
  context.translate(greenTank.x,greenTank.y)
  context.rotate(greenTank.direction)

  context.drawImage(spriteSheet,greenTank.sx,greenTank.sy,84,84,-42,-42,84,84);
  context.restore();
}

greenTank.update = function(){
  greenTank.x += greenTank.vx;
  greenTank.y += greenTank.vy;
  if(greenTank.y <0){
    greenTank.y = height;
  }
  if(greenTank.x <0){
    greenTank.x = width;
  }
  if(greenTank.y > height){
    greenTank.y = 0;
  }
  if(greenTank.x > width){
    greenTank.x = 0;
  }
}
//#endregion
//#region eventlisteners

function parseResult()
{
    // recognition system will often append words into phrases.
    // so hack here is to only use the last word:
    let mostrecentword = myRec.resultString.split(' ').pop();
    if(mostrecentword.indexOf("left")!==-1) { greenTank.vx = -greenTank.speed; greenTank.vy = 0; greenTank.direction = 1.5 * Math.PI;}
    else if(mostrecentword.indexOf("up")!==-1) { greenTank.vx = 0; greenTank.vy = -greenTank.speed; greenTank.direction = 0;}
    else if(mostrecentword.indexOf("down")!==-1) { greenTank.vx = 0; greenTank.vy = greenTank.speed; greenTank.direction = Math.PI;}
    else if(mostrecentword.indexOf("right")!==-1) { greenTank.vx = greenTank.speed; greenTank.vy = 0; greenTank.direction = 0.5 * Math.PI;}
    console.log(mostrecentword);
}

spriteSheet.addEventListener('load',()=>
{
  sw = spriteSheet.width / 8;
  sh = spriteSheet.height / 4;
  setInterval(animate, 100);
});
//#endregion
//#region  animate
function animate()
{
  context.clearRect(0,0,width,height);
  drawBackground();

  greenTank.update();
  greenTank.draw();
  greenTank.index += 1;

  if(greenTank.index >= greenTank.animationArray.length)
  {
    greenTank.index = 0;
  }
}
//#endregion
//#region background
backGround = [
  30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
  31, 0,31, 0,31, 0,31, 0, 0, 0,30,30,30, 0, 0, 0,31, 0,31, 0,31, 0,31,
  31, 0,31, 0, 0, 0, 0, 0,30, 0, 0, 0, 0, 0,30, 0, 0, 0, 0, 0,31, 0,31,
  31, 0,31, 0, 0,31, 0,30,30,30,30,30,30,30,30,30, 0,31, 0, 0,31, 0,31,
  31, 0, 0, 0, 0,31, 0,31, 0, 0, 0, 0, 0, 0, 0,31, 0,31, 0, 0, 0, 0,31,
  31, 0,30,30,30,31, 0, 0, 0,30,30, 0,30,30, 0, 0, 0,31,30,30,30, 0,31,
  31, 0, 0, 0, 0,31, 0,31, 0, 0, 0, 0, 0, 0, 0,31, 0,31, 0, 0, 0, 0,31,
  31, 0,31, 0, 0,31, 0,30,30,30,30,30,30,30,30,30, 0,31, 0, 0,31, 0,31,
  31, 0,31, 0, 0, 0, 0, 0,30, 0, 0, 0, 0, 0,30, 0, 0, 0, 0, 0,31, 0,31,
  31, 0,31, 0,31, 0, 0, 0, 0, 0,30,30,30, 0, 0, 0,31, 0,31, 0,31, 0,31,
  30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
            ];
function drawBackground(){
  for(i=0;i<backGround.length;i++)
  {
    let tileWidth = 84;
    let tileHeight = 84;
    let tilesOnOneRow = 23;

    let tileX = (i % tilesOnOneRow) * tileWidth;
    let tileY = Math.floor(i / tilesOnOneRow) * tileHeight;

    let sX = (backGround[i] % 8) * tileWidth;
    let sY = Math.floor(backGround[i] / 8) * tileHeight;

    context.drawImage(spriteSheet, sX, sY, 84, 84, tileX,tileY, 84, 84);

  }
}
//#endregion