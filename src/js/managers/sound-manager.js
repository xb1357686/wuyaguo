
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.SoundManager = function() {
  "use strict";
  Object.call(this);
  this.soundMenu = game.add.audio("sound-menu", 1, true);
  this.soundWin = game.add.audio("sound-win");
  this.soundRight = game.add.audio("sound-right");
  this.soundSwap = game.add.audio("sound-swap");
  this.soundNextLevel = game.add.audio("sound-nextlevel");
  this.soundGameOver = game.add.audio("sound-gameover");
  this.soundError = game.add.audio("sound-error");
  this.soundStartLevel = game.add.audio("sound-startlevel");
};

Crow.SoundManager.prototype = Object.create(Object.prototype);
Crow.SoundManager.prototype.constructor = Crow.SoundManager;

Crow.SoundManager.prototype.playSound = function(key) {
  try {
    this[key].play();
  } catch (e) {}
}

Crow.SoundManager.prototype.playSoundMenu = function() {
  if(!this.soundMenu.isPlaying) {
    this.soundMenu.play();
  }
}

Crow.SoundManager.prototype.playSoundSwap = function() {
  if(!this.soundSwap.isPlaying) {
    this.soundSwap.play();
  }
}



Crow.SoundManager.prototype.stopSoundMenu = function() {
  this.soundMenu.stop();
}

Crow.SoundManager.prototype.playSoundWin = function() {
  this.playSound('soundWin');
}

Crow.SoundManager.prototype.playSoundRight = function() {
  this.playSound('soundRight');
}

Crow.SoundManager.prototype.playSoundNextLevel = function() {
  this.playSound('soundNextLevel');
}

Crow.SoundManager.prototype.playSoundGameOver = function() {
  this.playSound('soundGameOver');
}

Crow.SoundManager.prototype.playSoundError = function() {
  this.playSound('soundError');
}

Crow.SoundManager.prototype.playSoundStartLevel = function() {
  this.playSound('soundStartLevel');
}
