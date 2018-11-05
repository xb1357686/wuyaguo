
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.PreloadState = function () {
  "use strict";
  Crow.BaseState.call(this);
};

Crow.PreloadState.prototype = Object.create(Crow.BaseState.prototype);
Crow.PreloadState.prototype.constructor = Crow.PreloadState;

Crow.PreloadState.prototype.preload = function () {

  "use strict";

  this.load.crossOrigin = 'Anonymous';


  game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');

  var preloadSprite = this.game.add.sprite(WIDTH/2, HEIGHT/2, 'loading');

  preloadSprite.anchor.setTo(0.5, 0.5);

  var plashka = game.add.image(WIDTH/2 - 169, HEIGHT/2 - 160,'plashka');

  var load1   = game.add.sprite(WIDTH/2 - 159, HEIGHT/2 - 150,"load1");

  game.load.setPreloadSprite(load1);

  var dian = this.game.add.sprite(WIDTH/2 + 170, HEIGHT/2 - 230, 'dian');
  dian.anchor.setTo(0.5, 0.5);
  dian.animations.add('loading');
  dian.animations.play('loading', 3, true);

  //var style = { font: "bold 48px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  //var text = game.add.text(WIDTH/2 - 30, HEIGHT/2 - 200, "0%", style);
  //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
  
  game.load.spritesheet('theme', imgUrl+'theme.png',600,180);
  //game.load.image('mask', 'asset/img/mask.png');


  //game.load.image('princess','asset/img/princess.png');
  game.load.spritesheet('princessSprite',imgUrl+'princessSprite.png',150,300);
  game.load.image('platform',imgUrl+'platform.png');


  game.load.spritesheet("button_icon",imgUrl+"button.png",140,140);
  game.load.image("play_button",imgUrl+"play108.png");

  //加载字体
  game.load.bitmapFont('desyrel', imgUrl+'desyrel.png', imgUrl+'desyrel.xml');
  // 关卡锁定背景
  game.load.image("locker",imgUrl+"locker.png");
  // 加载关卡的缩略图
  game.load.spritesheet("levelthumb", imgUrl+"level-box.png", 188, 188);


  game.load.spritesheet("hand",imgUrl+"hand.png",118,190);

  // 关卡的背景图
  game.load.image("levelpages", imgUrl+"levelpages.png");
  // 用作背景过渡的透明背景
  game.load.image("transp", imgUrl+"transp.png");

  //加載tip显示图片
  game.load.image('tipImg',imgUrl+"tip.png")
  game.load.image('goApply',imgUrl+"goApply.png")



  // 加载等级图片背景
  game.load.image("LevelBox",imgUrl+"level-box.png",94,94);
  // 加载弹出框背景
  game.load.image("PopUp",imgUrl+"success_full.png");

  //game.load.image("NextLevel",imgUrl+"next.png");
  game.load.image("Next",imgUrl+"right.png");
  game.load.image("Back",imgUrl+"left.png");
  game.load.image("second",imgUrl+"second.png")

  game.load.spritesheet("button",imgUrl+"button.png",70,70);
  game.load.spritesheet("start",imgUrl+"start.png",70,70);
  game.load.spritesheet("score",imgUrl+"score.png",120,122);
  //game.load.spritesheet("fingerLeft","asset/img/fingerLeft.png",180,180);
  //game.load.spritesheet("fingerRight","asset/img/fingerRight.png",180,180);

  /***************************/
  // 加载关卡的排列数据
  game.load.json("LevelData", "./src/js/level.json");

  //game.load.image("puzzle_1","asset/img/puzzle_1.png");
  //game.load.image("puzzle_2","asset/img/puzzle_2.png");
  //game.load.image("puzzle_3","asset/img/puzzle_3.png");
  //game.load.image("puzzle_4","asset/img/puzzle_4.png");
  //game.load.image("puzzle_5","asset/img/puzzle_5.png");
  //game.load.image("puzzle_6","asset/img/puzzle_6.png");
  //game.load.image("puzzle_7","asset/img/puzzle_7.png");

  game.load.image("puzzle_1",imgUrl+"puzzle_1.png");
  game.load.image("puzzle_2",imgUrl+"puzzle_2.png");
  game.load.image("puzzle_3",imgUrl+"puzzle_3.png");
  game.load.image("puzzle_4",imgUrl+"puzzle_4.png");
  game.load.image("puzzle_5",imgUrl+"puzzle_5.png");
  game.load.image("puzzle_6",imgUrl+"puzzle_6.png");
  game.load.image("puzzle_7",imgUrl+"puzzle_7.png");

  game.load.image("chessBoard",imgUrl+"chessBoard.png");
  game.load.image("board",imgUrl+"board.png");
  game.load.image("red",imgUrl+"red.png");


  game.load.audio("sound-menu", [soundUrl+"menu.wav"], true);
  game.load.audio("sound-win", [soundUrl+"win.wav"], true);
  game.load.audio("sound-right", [soundUrl+"right.wav"], true);
  game.load.audio("sound-nextlevel", [soundUrl+"nextlevel.wav"], true);
  game.load.audio("sound-gameover", [soundUrl+"gameover.wav"], true);
  game.load.audio("sound-startlevel", [soundUrl+"startlevel.wav"], true);
  game.load.audio("sound-swap",[soundUrl+"combineRight.wav"],true);

  game.load.spritesheet("ring",imgUrl+"ring.png",200,200);
  game.load.spritesheet('snowflakes', imgUrl+'snowflakes.png', 17, 17);
  game.load.spritesheet('snowflakes_large', imgUrl+'snowflakes_large.png', 64, 64);
  game.load.image("mirror",imgUrl+'mirror.png');
  //game.load.image("mirrorText",imgUrl+'mirrorText.png');
  game.load.image("mirrorGui",imgUrl+"mirrorGui.png");
  game.load.spritesheet("colorRect",imgUrl+"colorRect.png",20,50);
  //game.load.spritesheet("PuGong",imgUrl+"PuGong.png",100,100);
  game.load.onFileComplete.add(function(process) {

  game.load.image("RedBg",imgUrl+"RedBg.png");
  game.load.image("YellowBg",imgUrl+"YellowBg.png");
 // game.load.image("GreenBg",imgUrl+"GreenBg.png");

  game.load.image("clockBg",imgUrl+"clockBg.png");
  game.load.spritesheet("story",imgUrl+"story.png",1950,1050);
  game.load.spritesheet("storyNext",imgUrl+"storyNext.png",128,128);

  game.load.image("about",imgUrl+"about.png");

  game.load.image("logo",imgUrl+"logo.png");
    //text.text = process + "%";

  });

};

Crow.PreloadState.prototype.create = function () {
  "use strict";
  // 初始化全局对象
  game.soundManager = new Crow.SoundManager();
  game.sound.setDecodedCallback(["sound-menu", "sound-win", "sound-right", "sound-nextlevel", "sound-gameover", "sound-startlevel", "sound-swap"], function() {
  game.state.start('StartState');
  }, this);
};
