
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.BootState = function () {
  "use strict";
  Crow.BaseState.call(this);
};

Phaser.World.prototype.displayObjectUpdateTransform = function() {
  if(!game.scale.correct) {
    //this.x = game.camera.y + game.width;
    //this.y = -game.camera.x;
    //this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(90));


  } else {
    this.x = -game.camera.x;
    this.y = -game.camera.y;
    this.rotation = 0;
  }

  PIXI.DisplayObject.prototype.updateTransform.call(this);
};

Crow.BootState.prototype = Object.create(Crow.BaseState.prototype);
Crow.BootState.prototype.constructor = Crow.BootState;

Crow.BootState.prototype.preload = function () {
  "use strict";
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


  game.load.image('loading', imgUrl+'loading.png');
  game.load.image("background",imgUrl+"MainPageBg.png");
  game.load.spritesheet('dian', imgUrl+'dian-sheet.png', 60, 12);

  game.load.image("load1",imgUrl+"load1.png",48,48);
  game.load.image("plashka",imgUrl+"plashka.png");


  if(game.scale.isLandscape) {
    game.scale.correct = true;
    game.scale.setGameSize(WIDTH, HEIGHT);
  } else {
    //game.scale.correct = false;
    //game.scale.setGameSize(HEIGHT, WIDTH);
  }
};


Crow.BootState.prototype.create = function () {
  "use strict";
  this.load.crossOrigin = 'Anonymous';


  game.scale.onOrientationChange.add(function() {
    if(game.scale.isLandscape) {
      game.scale.correct = true;
      game.scale.setGameSize(WIDTH, HEIGHT);
    } else {
      // game.scale.correct = false;
      // game.scale.setGameSize(HEIGHT, WIDTH);
    }
  }, this);


  //先查看是否有用户信息
  $.ajax({
    type: "GET",
    dataType: "JSON",
    url: MaiyajiaBaseURL + '/v1/users/me',
    success: function (data) {
      if (data.success) {
        userinfo = data.userinfo;
        var nickname = userinfo.nickname;
        if (nickname && nickname.length > 11) {
          userinfo.nickname = nickname.substring(0, 12) + '··';
        }
      }
    }
  });

  game.state.start('PreloadState');
};

