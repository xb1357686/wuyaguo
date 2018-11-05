
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.MenuState = function () {
  "use strict";
  Crow.BaseState.call(this);
};

Crow.MenuState.prototype = Object.create(Crow.BaseState.prototype);
Crow.MenuState.prototype.constructor = Crow.MenuState;

Crow.MenuState.prototype.create = function () {
  "use strict";

  $("body").css("background-image","url(./asset/img/MainPageBg.png)");

//  game.add.sprite(50,40,'logo');
 // game.add.text(50, HEIGHT-40, "Copyright © 2017 深圳市万有引力科技有限公司", { font: "bold 26px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" });
  //var background = this.game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
  //var mask = game.add.sprite(WIDTH/2, HEIGHT/2, "mask");
  //mask.anchor.setTo(0.5, 0.5);
  //AddShadowMask();
  //game.add.sprite(50,40,'logo');


  var theme = this.game.add.sprite(WIDTH/2, HEIGHT/2 - 300, 'theme');
  theme.anchor.setTo(0.5, 0.5);

  var themeBlink = theme.animations.add('themeBlink');

  theme.animations.play('themeBlink', 1 , true);

  CreateSnow();


  //theme.animations.add('shake');
  //theme.animations.play('shake', 3, true);



  //var logoText = game.add.text(WIDTH/2, HEIGHT * 0.88, "Touch Screen", {
  //    fontSize: "48px",
  //    fill: "#ffffff",
  //    fontWeight: '100'
  //});
  //logoText.anchor.setTo(0.5, 0.5);
  //logoText.alpha = 0.5;

  //game.soundManager.playSoundMenu();

  // 动画完毕之后添加事件
  this.spriteAll = game.add.sprite(0, 0);
  this.spriteAll.addChild(theme);
  //this.spriteAll.addChild(logoText);
  this.spriteAll.y = -1080;
  var allTween = game.add.tween(this.spriteAll).to({y: 0}, 0, Phaser.Easing.Exponential.Out, true,250);

  allTween.onComplete.add(function() {
    //var tween = game.add.tween(logoText).to({alpha: 1}, 500, "Linear", true, 0, -1);
    //tween.yoyo(true, 500);
    //game.input.onTap.add(this.onNextState, this);
    //var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //space.onDown.add(this.onNextState, this);
  }, this);

 // var company_button = game.add.button(WIDTH/2 - 200, 0, 'button_icon', this.CompanyOnClick, this, 4,4,4);

  var play_button = game.add.button(WIDTH/2, 0, 'play_button', this.onNextState, this, 0, 0, 0);

 // var speaker_frame = (this.game.sound.mute?3:2);

  //this.SpeakButton = game.add.button(WIDTH/2+200, 0, 'button_icon', this.SpeakerOnClick, this,speaker_frame,speaker_frame,speaker_frame);

  //this.SpeakButton.anchor.set(0.5,0.5);

  play_button.anchor.set(0.5,0.5);

 // company_button.anchor.set(0.5,0.5);

  game.soundManager.playSoundMenu();

 // game.add.tween(company_button).to( { y:HEIGHT/2+350 }, 700, Phaser.Easing.Bounce.Out, true);
  game.add.tween(play_button).to( { y:HEIGHT/2+350 }, 700, Phaser.Easing.Bounce.Out, true,100);
 // game.add.tween(this.SpeakButton).to( { y:HEIGHT/2+350 }, 700, Phaser.Easing.Bounce.Out, true,200);




};

Crow.MenuState.prototype.update = function() {

  SnowUpdate();

};




Crow.MenuState.prototype.onNextState = function() {

  game.soundManager.playSoundRight();

  var allTween = game.add.tween(this.spriteAll).to({y: -1080}, 0, Phaser.Easing.Exponential.Out, true);
  allTween.onComplete.add(function() {
    game.soundManager.stopSoundMenu();

    game.state.start("StartState");


  }, this);

};

Crow.MenuState.prototype.SpeakerOnClick = function() {

  game.soundManager.playSoundRight();

  if (!this.game.sound.mute) {
    this.game.sound.mute = true;
      this.SpeakButton.setFrames(3,3,3);
  } else {
    this.game.sound.mute = false;
      this.SpeakButton.setFrames(2,2,2);
  }

};


Crow.MenuState.prototype.CompanyOnClick = function() {

  game.soundManager.playSoundRight();

  $("body").append("<div class='divMask'></div>");

  this.about = game.add.sprite(0,0,"about");

  this.about.alpha = 0;

  game.add.tween(this.about).to({alpha: 1}, 1000, Phaser.Easing.Exponential.Out, true);

  this.about.inputEnabled = true;

  this.about.events.onInputDown.add(this.aboutEvent, this);
};

Crow.MenuState.prototype.aboutEvent = function() {

  this.about.destroy();

  $('.divMask').remove();



};