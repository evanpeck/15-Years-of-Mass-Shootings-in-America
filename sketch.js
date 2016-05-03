
// PRELOADED DATA 
var data;
var numRows;
var shot; 

// The current date
var date = new Date("4/7/2001");
var nextShootingIndex = 0;
var nextShootingDate = new Date("1/16/02");

// REPRESENTATION OF COLOR
var redValue = 0;

// INSTRUCTION TEXT
var title = "15 Years of Mass Shootings in the USA"
var instructions = "During this presentation, each mass shooting is represented by the sound of a single gunshot.\n The color of your screen will intensify when more people are killed, before slowly fading to black.\n See and hear how we have changed. \n\n Created by Evan Peck (evan.peck@bucknell.edu) \n\n\n\n Best experienced fullscreen with headphones on a modern computer (resource intensive - sorry mobile).\nWARNING: Gunshot sounds are used. Be aware of your surroundings\n[Click to begin]"
var instructCol = 255;
var INSTRUCTIONS = true;

var NOT_DONE = true;
var BEGIN = false;

var endText = "data: https://library.stanford.edu/projects/mass-shootings-america \n 40 Wesson Smith sound: Recorded by Mike Koenig \n my email: evan.peck@bucknell.edu"
var endCol = 0;

const TITLE = 1;
const LOCATION = 2;
const FATALITIES = 4;
const VICTIMS = 6;
const DESCRIPTION = 7;
const DATE = 8;

const FATALITY_FREQ = 2;
const EVERY_X_DAYS = 7;
var FADE_FREQ = 1;

function preload() {
  data = loadTable("data/Stanford_MSA_Database01.csv","csv","header");
  shot = loadSound("data/40_smith_wesson.mp3")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(255);
  textFont("Helvetica");
  numRows = (data.getRows()).length
}


function draw() {
  if (redValue > 0) {
    redValue -= FADE_FREQ;
  }
  
  if (BEGIN) {
    if (instructCol > 0) {
      instructCol -= 1;
    } else {
      INSTRUCTIONS = false;
    }
  }
  background(redValue, 0, 0);
  
  if (INSTRUCTIONS) {
  // The Instructions
    textAlign(CENTER) 
    fill(instructCol);
    textSize(40);
    text(title, width/2, height*.2);
    textSize(17);
    text(instructions, width/2, height*.2 + 35);
  }
  fill(255);
  
  if (BEGIN) {
    // Change date and print it on screen
    if (NOT_DONE) {
      date.setDate(date.getDate() + 1);
    }
    textSize(35);
    textAlign(RIGHT)
    text(date.toISOString().substring(0, 10), width*.95, height*.9);
    
    // If this is a shooting, change the color
    while (date.getTime() == nextShootingDate.getTime() && NOT_DONE) {
      shot.play();
      var fatalities = data.getNum(nextShootingIndex, FATALITIES);
      redValue += fatalities * EVERY_X_DAYS;
      
      nextShootingIndex += 1;
      if (nextShootingIndex >= numRows) {
        NOT_DONE = false;
        FADE_FREQ = 2.5;
        break;
      }
      nextShootingDate = new Date(data.getString(nextShootingIndex, DATE));
    }
  }
  
  if (!NOT_DONE && redValue == 0) {
    endCol += FADE_FREQ;
    fill(endCol);
    textSize(17);
    textAlign(CENTER);
    text(endText, width/2, height/2)
  }

}

function mouseClicked() {
  BEGIN = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}