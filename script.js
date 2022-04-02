//global constants
const clueHoldTime = 1000; //how long to hold each clue's light and sound
const cluePauseTime = 333; //how long to pause btwn clues
const nextClueWaitTime = 1000; //how long to wait before playing sequence
//global variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false; 
var volume = 0.5; // must be btwn 0 and 1.0
var guessCounter = 0;
var mistakes;

function createPattern(){ //optional feature
  for(let i = 0; i < pattern.length; i++){
    pattern[i] = Math.floor((Math.random() * 4) + 1); //add 1 to make it floor[1-4]
  }
}

function startGame(){
  //initialize game variables
  progress = 0;
  mistakes = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  createPattern();
  playClueSequence();
}
function stopGame(){
  //initialize game variables
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("mistakesBtn").innerHTML = "Mistakes = 0";

}
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn); //call clearButton in 1000 seconds for the button that is currently playing
  }
}
function playClueSequence(){
  guessCounter = 0;
  context.resume() //do I need this
  let delay = nextClueWaitTime; //set delay to initial wait time (increments by 1333)
  for(let i = 0;i <= progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(){
  stopGame();
  alert("Game over. You lost.");
  document.getElementById("mistakesBtn").innerHTML = "Mistakes = 0";
}
function winGame(){
  stopGame();
  alert("Game over. You won!");
}
function guess(btn){ 
  console.log("user guessed: " + btn);
  if(!gamePlaying){ //if startGame not called
    return;
  }
  
  // add game logic here
    if(btn == pattern[guessCounter]){
      if(guessCounter == progress){ //is turn over? (guessCounter should equal progress at end of each turn)
        if(progress == pattern.length - 1) { //progress tracks turns if 8 turns pass progress == 7
          winGame();
        }else{
          progress++;
          playClueSequence(); //(progress <= pattern.length + 1 && mistakes < 3)
        }
      }else{
        guessCounter++;
      }
    } else {
      mistakes++;
      if (mistakes < 3){
      document.getElementById("mistakesBtn").innerHTML = "Mistakes = "+mistakes;
      playClueSequence(); //redo same turn
      } else {
        document.getElementById("mistakesBtn").innerHTML = "Mistakes = "+mistakes;
        loseGame();
      }
    }
  
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ //plays tone for amount of time specified
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){ //starts tone after button pressed
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){ //stops tone 
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


