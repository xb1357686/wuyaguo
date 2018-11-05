var Phaser = Phaser || {};
var Crow = Crow || {};
var InnerGroup;
var OuterGroup;
var CoverGroup;
var PuzzleSize = 150;
var PuzzleBlockX = 6;
var PuzzleBlockY = 5;
var EmptyValue = 0;
var OccupyValue = 1;
var scene = [];
var CellScene = [];
var cells = [[[1,1,1,1],[1,1,1,1],[1,1,0.3,1]],[[1,1,1,1],[1,1,1,1],[1,1,1,0.3]],[[1,1,1,1],[1,1,0.3,1]], [[1,1,1,1],[1,1,1,0.3]], [[1,1,1,1],[1,1,1,1]], [[1,1,1,1]], [[1,1,1,1]] ];
var TurState = true;
var mirror;
//var PuzzlePosition = [[-2,1],[-1,1],[-2,3],[-1,3],[6,1],[7,1],[6,3],[7,3]];
var PuzzlePosition = [[-2,1],[7,1],[-2,3],[7,3]];
var TimerText;
var Inner = [];
var Outer = [];
var InnerPosition = [];
var Result = [];
var WalkPath = [];
var princess;
var platform;
var SuspendColor = 0x0fffff;
var GameFinish = false;
var ShowTime;

var BackGroundName = ["RedBg","GreenBg","YellowBg"];

var PuzzleShape = {

    3 : { "down":[[0,0],[0,-1],[0,1]],"up":[[0,0],[0,1],[0,-1]],"left":[[0,0],[1,0],[-1,0]],"right":[[0,0],[-1,0],[1,0]]},

    2 : { "down":[[0,0],[0,1]],"up":[[0,0],[0,-1]],"left":[[0,0],[-1,0]],"right":[[0,0],[1,0]]},

    1 : { "down":[[0,0]],"up":[[0,0]],"left":[[0,0]],"right":[[0,0]]}
};



Crow.WinState = function () {
  "use strict";
  Crow.BaseState.call(this);
};

Crow.WinState.prototype = Object.create(Crow.BaseState.prototype);

Crow.WinState.prototype.constructor = Crow.WinState;

Crow.WinState.prototype.preload = function () {

  if (userinfo) {
    game.load.image('headerImg', userinfo.avatarUrl);     //如果有登陆了就加载头像
  } else {
    game.load.image('headerImg', './asset/img/personimg.jpg');
  }


};

Crow.WinState.prototype.create = function () {

  "use strict";

  this.load.crossOrigin = 'Anonymous';

  var t = this;
  game.soundManager.playSoundStartLevel();

  GameFinish = false;

  //game.add.image(0,0,"wood-background");
  //game.add.image(0,0,"MainGameBg");
  //game.add.image(0,0,BackGroundName[Math.floor(level/17)]);
  this.goApply  = game.add.button(20,20,'goApply',this.goApplyLink,this);
  this.goApply.scale.set(1.5,1.5);

  //var RotateButton = game.add.button(WIDTH - 300,50,'gameButton',this.RotateClick,this,2,0,0);
  //var MirrorButton = game.add.button(WIDTH - 500,50,'gameButton',this.RotateClick,this,2,0,0);

  //game.add.image(WIDTH-300,50,'gameButton');

  //game.add.image(MarginLeft,MarginTop,"board");
  //mirror = game.add.sprite(WIDTH-220,20,'mirror');
  mirror = game.add.sprite(WIDTH-220,10,'mirror');


  mirror.inputEnabled = true;

  mirror.events.onInputDown.add(this.MirrorGui, this);

  $("body").css("background-image","url(./asset/img/GreenBg.png)");


  game.add.image(MarginLeft,MarginTop+750,"chessBoard");

  //var mask = game.add.sprite(WIDTH/2, HEIGHT/2, "mask");

  //mask.anchor.setTo(0.5, 0.5);

  //AddShadowMask();

  this.userInFo();

  //this.BackPageButton = game.add.button(10,HEIGHT - 150,'button_icon',this.BackToMenuPage,this,0,0,0);
 // this.BackPageButton = game.add.button(10,0,'button_icon',this.BackToMenuPage,this,0,0,0);
 // this.BackPageButton.scale.set(0.9,0.9);

  //this.PlayButton = game.add.button(150,0,'play_button',this.MoveToTarget,this);

  //this.PlayButton.scale.set(0.585,0.585);

  this.getJsonData();

  this.CountTime = new Date().getTime();


  // 初始化背景数组
  this.SceneInit();


  this.createInnerPuzzle();

  this.createOuterPuzzle();

  this.CoverInit();

  if(TurState&&(level == 0)){

    this.TurGuide();

  }else if(level == 2 || level == 3){

    this.MirrorGui();

  }


  //var ClockBg = game.add.image(WIDTH/2,100,'clockBg');
  //var ClockBg = game.add.image(WIDTH/2,100,'clockBg');


  //ClockBg.anchor.setTo(0.5,0.5);


  var style = { font: "bold 56px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };

  //  The Text is positioned at 0, 100
  TimerText = game.add.text(WIDTH/2, 100, "00    00", style);
  TimerText.anchor.setTo(0.5,0.5);
  TimerText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

  //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
  //text.setTextBounds(0, 100, 800, 100);


};

Crow.WinState.prototype.MoveToTarget = function () {


  if(!this.CheckViolate()){

    if(this.IsGameOk()){


    }else{

      OuterGroup.forEach(function(OutSprite){

        OutSprite.input.enabled = false;

      });

      var _this = this;

      //this.PlayButton.inputEnabled = false;
      princess.inputEnabled = false;


      var PathX = [];
      var PathY = [];

      for(var n in WalkPath){

        PathX.push(MarginLeft+WalkPath[n][0]*PuzzleSize);
        PathY.push(MarginTop+5*PuzzleSize - WalkPath[n][1]*PuzzleSize);

      }

      console.log(600*PathX.length);

      //PathX.push(PathX[PathX.length -1 ]);
      //PathY.push(PathY[PathY.length -1 ]- 70);


      var tween = game.add.tween(princess).to({
          x: PathX,
          y: PathY
        }, 600*PathX.length,Phaser.Easing.Quadratic.Out, true).interpolation(function(v, k){
          return Phaser.Math.bezierInterpolation(v, k);
        });


      tween.onComplete.add(function () {

        setTimeout(function(){

          princess.alpha = 0;

          var origin = game.add.tween(princess).to({x:MarginLeft+Result[0][0]*PuzzleSize,y:MarginTop+PuzzleBlockY*PuzzleSize - Result[0][1]*PuzzleSize},100,Phaser.Easing.Quadratic.Out,true);


          origin.onComplete.add(function(){

            princess.alpha = 1;

            //_this.PlayButton.inputEnabled = true;
            princess.inputEnabled = true;


            OuterGroup.forEach(function(OutSprite){

              OutSprite.input.enabled = true;

            });

          //  _this.BackPageButton.inputEnabled = true;



          });

        },1000);




      });



    }

  }

  // 失败的动画效果







};


Crow.WinState.prototype.update = function () {

  if(!GameFinish) {


    ShowTime = Math.floor((new Date().getTime() - this.CountTime)/1000);


    var second = ShowTime%60;
    var minute = Math.floor(ShowTime/60);

    second = ("0"+second).substr(-2,2);
    minute = ("0"+minute).substr(-2,2);


    TimerText.text = minute + ":" + second;



  }



};


Crow.WinState.prototype.RestartGame = function() {

  game.soundManager.playSoundRight();

  game.state.start('WinState');

  $('.divMask').remove();


};

Crow.WinState.prototype.BackToMenuPage = function() {

  game.soundManager.playSoundRight();


  game.state.start('StartState');

  $('.divMask').remove();


};




Crow.WinState.prototype.createInnerPuzzle = function () {


  platform = game.add.sprite(MarginLeft+Result[1][0]*PuzzleSize,MarginTop+PuzzleBlockY*PuzzleSize - Result[1][1]*PuzzleSize,'platform');
  platform.anchor.set(0,1);
  princess = game.add.sprite(MarginLeft+Result[0][0]*PuzzleSize,MarginTop+PuzzleBlockY*PuzzleSize - Result[0][1]*PuzzleSize,'princessSprite',0);

  princess.anchor.set(0,1);

  princess.inputEnabled = true;

  princess.events.onInputDown.add(this.MoveToTarget, this);

  var Blink = princess.animations.add('blink');

  setInterval(function(){

    if(princess){

      princess.animations.play('blink', 8 , false);

    }


  }, 3000);

  InnerGroup = game.add.group();

  for(var j=0;j<Inner.length;j++){

    var tempSprite;

    tempSprite = InnerGroup.create(4*PuzzleSize + (InnerPosition[j][0])*PuzzleSize ,5.5*PuzzleSize-InnerPosition[j][1]*PuzzleSize,'puzzle_'+(Inner[j]+1));

    tempSprite.half = HaveHalf(cells[Inner[j]]);

    tempSprite.cell = [];

    // 生成每个积木的形状数据

    for(var l=0;l<cells[Inner[j]].length;l++){

      var cellArray = [];

      // 每小块积木用四个数据表示, 完整的积木 [1,1,1,1] ,缺口积木 [1,1,1,0]
      for(var k=0;k<4;k++){

        cellArray.push(cells[Inner[j]][l][k]);

      }
      tempSprite.cell.push(cellArray);
    }

    tempSprite.length = cells[Inner[j]].length;

    tempSprite.PuzzleWidth = 1;

    tempSprite.PuzzleHeight = cells[Inner[j]].length;


    // 积木锚点在板子的位置数组[x,y]
    tempSprite.boardIndex = [];

    tempSprite.boardIndex.push(InnerPosition[j][0]);

    tempSprite.boardIndex.push(4-InnerPosition[j][1]);
    // 添加输入/拖拽属性

    tempSprite.inputEnabled = true;

    //tempSprite.input.enableDrag(false,true);

    // 长度为2的积木块的锚点

    if(tempSprite.length === 2) {

      tempSprite.anchor.set(0.5,0.25);

    }else{
      tempSprite.anchor.set(0.5);

    }

    //tempSprite.input.enableSnap(PuzzleSize, PuzzleSize, false, true, MarginLeft+0.5*PuzzleSize,MarginTop+0.5*PuzzleSize);

    //拖动开始监听
    //tempSprite.events.onDragStart.add(this.dragStart, this);

    ////拖动结束事件监听
    //tempSprite.events.onDragStop.add(this.dragStop, this);

  }

};


Crow.WinState.prototype.checkOverlap = function (spriteA) {


    var boundsA = spriteA.getBounds();
    var boundsB = mirror.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

};

Crow.WinState.prototype.createOuterPuzzle = function () {


  OuterGroup = game.add.group();

  for(var j=0;j<Outer.length;j++){

    var tempSprite;

    tempSprite = OuterGroup.create(MarginLeft + (PuzzlePosition[j][0]+0.5)*PuzzleSize ,MarginTop + (PuzzlePosition[j][1]+0.5)*PuzzleSize,'puzzle_'+(Outer[j]+1));



    tempSprite.half = HaveHalf(cells[Outer[j]]);

    tempSprite.cell = [];

    tempSprite.index = j;

    // 生成每个积木的形状数据

    for(var l=0;l<cells[Outer[j]].length;l++){

      var cellArray = [];

      // 每小块积木用四个数据表示, 完整的积木 [1,1,1,1] ,缺口积木 [1,1,1,0]
      for(var k=0;k<4;k++){

        cellArray.push(cells[Outer[j]][l][k]);

      }
      tempSprite.cell.push(cellArray);
    }

    tempSprite.length = cells[Outer[j]].length;

    tempSprite.PuzzleWidth = 1;

    tempSprite.PuzzleHeight = cells[Outer[j]].length;


    // 积木锚点在板子的位置数组[x,y]
    tempSprite.boardIndex = [];

    tempSprite.boardIndex.push(PuzzlePosition[j][0]);

    tempSprite.boardIndex.push(PuzzlePosition[j][1]);
    // 添加输入/拖拽属性

    tempSprite.inputEnabled = true;

    tempSprite.input.enableDrag(false,true);

    // 长度为2的积木块的锚点

    if(tempSprite.length === 2) {

      tempSprite.anchor.set(0.5,0.25);

    }else{
      tempSprite.anchor.set(0.5);

    }

    tempSprite.input.enableSnap(PuzzleSize, PuzzleSize, false, true, MarginLeft+0.5*PuzzleSize,MarginTop+0.5*PuzzleSize);

    //拖动开始监听
    tempSprite.events.onDragStart.add(this.dragStart, this);

    ////拖动结束事件监听
    tempSprite.events.onDragStop.add(this.dragStop, this);

  }
};




Crow.WinState.prototype.dragStart = function(sprite) {

  game.soundManager.playSoundRight();

  if(allowDragStart){

    allowDragStart = false;
    allowDragStop = true;
    // 正在移动的精灵的原位置
    temPosition.x = sprite.position.x;
    temPosition.y = sprite.position.y;

  }else{

    sprite.input.disableDrag();   //阻止精灵拖拽
  }

};


Crow.WinState.prototype.dragStop = function(sprite,pointer) {


  var t = this;

  if(allowDragStop){
    //sprite.scale.set(1,1);


    // 计算精灵的索引位置
    var temX = Math.floor((sprite.position.x-MarginLeft)/PuzzleSize);
    var temY = Math.floor((sprite.position.y-MarginTop)/PuzzleSize);


    sprite.boardIndex = [];
    sprite.boardIndex.push(temX);
    sprite.boardIndex.push(temY);


    if(temPosition.x === sprite.position.x && temPosition.y === sprite.position.y){

      //console.log(sprite.cell);


          //if(!this.InnerBoard(sprite.boardIndex)){

            sprite.angle += 90;

            // 交换图形的长宽
            var tempHeight = sprite.PuzzleHeight;

            var tempWidth = sprite.PuzzleWidth;

            sprite.PuzzleHeight = tempWidth;

            sprite.PuzzleWidth = tempHeight;

            // 旋转数组

            for(var n=0;n<sprite.cell.length;n++){


              var temp = sprite.cell[n][0];

              sprite.cell[n][0] = sprite.cell[n][2];

              sprite.cell[n][2] = sprite.cell[n][3];

              sprite.cell[n][3] = sprite.cell[n][1];

              sprite.cell[n][1] = temp;


            }

              this.SceneInit();
              //
              this.SceneUpdate();

              //console.log(scene);
              //// 检查scene数组,潘敦是否重叠,如果重叠显示半透明的遮罩
              this.CoverCheck();


              //// CellScene[] 数组用作存储积木的具体描述的数组,用作判断通关和悬空
              this.CellSceneInit();
              //
              this.CellSceneUpdate();
              //console.log(CellScene);


              //
              //if(!this.CheckViolate()){
              //
              //  this.IsGameOk();
              //
              //}

              allowDragStart = true;
              allowDragStop = false;
              OuterGroup.setAll('input.draggable', true);

          //}


    // 超出边界返回

    }else if(sprite.position.x <=0 || sprite.position.x >=WIDTH || sprite.position.y <=0 ||sprite.position.y >=HEIGHT){


      // 超出边界返回原来位置
      //sprite.position.x = temPosition.x;
      //sprite.position.y = temPosition.y;

      // 超出边界返回边界位置
      sprite.position.x = (sprite.position.x<=0?PuzzleSize/2:(sprite.position.x>=WIDTH?WIDTH-PuzzleSize/2:sprite.position.x));
      sprite.position.y = (sprite.position.y<=0?PuzzleSize/2:(sprite.position.y>=HEIGHT?HEIGHT-PuzzleSize/2:sprite.position.y));


      if(this.checkOverlap(sprite)){

        var scaleX = sprite.scale.x;
        var scaleY = sprite.scale.y;


        if(sprite.PuzzleHeight > sprite.PuzzleWidth){

          for(var e=0;e<sprite.cell.length;e++){

            var tt = sprite.cell[e][0];
            var gg = sprite.cell[e][2];

            sprite.cell[e][0] = sprite.cell[e][1];
            sprite.cell[e][1] = tt;
            sprite.cell[e][2] = sprite.cell[e][3];
            sprite.cell[e][3] = gg;

          }

        }else{

          for(var e=0;e<sprite.cell.length;e++){

            var tt = sprite.cell[e][0];
            var gg = sprite.cell[e][1];

            sprite.cell[e][0] = sprite.cell[e][2];
            sprite.cell[e][2] = tt;
            sprite.cell[e][1] = sprite.cell[e][3];
            sprite.cell[e][3] = gg;

          }

        }


        game.add.tween(sprite.scale).to( { x:scaleX*(-1),y:scaleY  }, 600, Phaser.Easing.Linear.None, true);



        //sprite.scale.set(scaleX*(-1),scaleY);
      }

      allowDragStart = true;
      allowDragStop = false;
      OuterGroup.setAll('input.draggable', true);




    }else{

      if(this.checkOverlap(sprite)){

        var scaleX = sprite.scale.x;
        var scaleY = sprite.scale.y;


        if(sprite.PuzzleHeight > sprite.PuzzleWidth){

          for(var e=0;e<sprite.cell.length;e++){

            var tt = sprite.cell[e][0];
            var gg = sprite.cell[e][2];

            sprite.cell[e][0] = sprite.cell[e][1];
            sprite.cell[e][1] = tt;
            sprite.cell[e][2] = sprite.cell[e][3];
            sprite.cell[e][3] = gg;

          }

        }else{

          for(var e=0;e<sprite.cell.length;e++){

            var tt = sprite.cell[e][0];
            var gg = sprite.cell[e][1];

            sprite.cell[e][0] = sprite.cell[e][2];
            sprite.cell[e][2] = tt;
            sprite.cell[e][1] = sprite.cell[e][3];
            sprite.cell[e][3] = gg;

          }

        }

        if(this.mirrorLeft && this.mirrorLeft.isRunning) {

        }else{

          this.mirrorLeft = game.add.tween(sprite.scale).to( { x:scaleX*(-1),y:scaleY  }, 600, Phaser.Easing.Linear.None, true);

        }




        //sprite.scale.set(scaleX*(-1),scaleY);
      }

      game.soundManager.playSoundSwap();

      // 更新当前积木的坐标
      //
      //
      //// 初始化背景信息并更新,scene数组用作判断是否重叠
      this.SceneInit();
      //
      this.SceneUpdate();

      //console.log(scene);
      //// 检查scene数组,潘敦是否重叠,如果重叠显示半透明的遮罩
      this.CoverCheck();
      //
      //
      //// CellScene[] 数组用作存储积木的具体描述的数组,用作判断通关和悬空
      this.CellSceneInit();
      //
      this.CellSceneUpdate();

      //console.log(CellScene);

      //
      //
      //// 遍历积木块更新积木信息
      //// 检测重叠区域,添加红色蒙板
      this.SuspendedCheck(OuterGroup);

      // 开启拖拽开关
      allowDragStart = true;
      allowDragStop = false;
      OuterGroup.setAll('input.draggable', true);

      //console.log(CellScene);

      // 如何积木摆放符合 重叠和悬空的检测,测试通关路径
      //if(!this.CheckViolate()){
      //
      //  this.IsGameOk();
      //
      //}





    }


  }

};



Crow.WinState.prototype.Direction = function(angleValue) {


  var dir;
  
  switch(angleValue){
    
    case 0:
      dir = "down";
          break;
    case -180:
      dir = "up";
          break;
    case -90:
      dir = "right";
          break;
    case 90:
      dir = "left";
          break;
    
  }
  
  return dir;
  
};



Crow.WinState.prototype.CoverInit = function() {

  CoverGroup = game.add.group();

  for(var i=0;i<PuzzleBlockY;i++){

    for(var j=0;j<PuzzleBlockX;j++){

      var cover = CoverGroup.create(MarginLeft+j*PuzzleSize,MarginTop+i*PuzzleSize,'red');

      cover.visible = false;
    }
  }

};


Crow.WinState.prototype.CellSceneInit = function() {

  CellScene = [];

  for(var m=0;m<PuzzleBlockY;m++){

    var temp = [];

    for(var n=0;n<PuzzleBlockX;n++){


      var ct = [];

      for(var l=0;l<4;l++){

        ct.push(EmptyValue);
      }

      temp.push(ct);

    }

    CellScene.push(temp);
  }


};


Crow.WinState.prototype.SceneInit = function() {

  scene = [];

  for(var m=0;m<PuzzleBlockY;m++){

    var temp = [];

    for(var n=0;n<PuzzleBlockX;n++){

      temp.push(EmptyValue);

    }

    scene.push(temp);
  }


};

// 重叠检测
Crow.WinState.prototype.CoverCheck = function() {



  for(var k=0;k<PuzzleBlockY;k++){

    for(var j = 0;j<PuzzleBlockX;j++){


      if(scene[k][j] > 1) {

        CoverGroup.children[k*PuzzleBlockX+j].visible = true;



      }else{

        CoverGroup.children[k*PuzzleBlockX+j].visible = false;

      }
    }
  }


};


Crow.WinState.prototype.CheckViolate = function() {

 // 当且仅当重叠和悬空两个条件都符合,才判断规则正确
 var CoverStat = false;
 var SuspendStat = false;
 var AllinBoardStat = false;

 // 根据scene数据得出是否有重叠
 for(var i=0;i<PuzzleBlockY;i++){

   for(var j=0;j<PuzzleBlockX;j++){

     if(scene[i][j] > 1){

       CoverStat = true;

     }
   }
 }

  // 根据精灵的颜色判断是否有存在悬空对象
 OuterGroup.forEach(function(item){

    if(item.tint == SuspendColor){

       SuspendStat = true;

    }

 });

       AllinBoardStat = this.AllInBoard();

  if(!CoverStat&&!SuspendStat&&AllinBoardStat){

      //console.log('合规');

      return false;

  }else{

      //console.log('违规');

      return true;
  }

};



Crow.WinState.prototype.AllInBoard = function() {

  var t = this;
  var tempStat = true;
  OuterGroup.forEach(function (item) {

    if(!t.InnerBoard(item.boardIndex)){

      tempStat = false;
    }

  });

  return tempStat;

};

// 悬空检测
Crow.WinState.prototype.SuspendedCheck = function(InputGroup) {

  var t = this;
  InputGroup.forEach(function(sprite){

    var dir = t.Direction(sprite.angle);

    if(t.InnerBoard(sprite.boardIndex)){

      if(sprite.length == 1){

        if(sprite.boardIndex[1] == 4){

          sprite.tint = 0xffffff;

        }else{

          if(t.HaveSupport(sprite.boardIndex)){

            sprite.tint = 0xffffff;

          }else{

            //sprite.tint = SuspendColor;
            sprite.tint = SuspendColor;


          }

        }


      }else if(sprite.length == 2){

        if(sprite.PuzzleHeight > sprite.PuzzleWidth){

            if( dir == "up"){

              if(sprite.boardIndex[1] == 4){

                sprite.tint = 0xffffff;

              }else{

                //if((CellScene[sprite.boardIndex[1]+1][sprite.boardIndex[0]][0] ==1)&&CellScene[sprite.boardIndex[1]+1][sprite.boardIndex[0]][1] == 1){
                if(t.HaveSupport(sprite.boardIndex)){
                  sprite.tint = 0xffffff;

                }else{

                  sprite.tint = SuspendColor;

                }

              }

            }else if(dir == "down"){

              if(sprite.half){

                sprite.tint = SuspendColor;

              }else{

                if(sprite.boardIndex[1] == 3){

                  sprite.tint = 0xffffff;

                }else{

                  if(sprite.boardIndex[1]+2 <= 4){
                    if((CellScene[sprite.boardIndex[1]+2][sprite.boardIndex[0]][0] ==1)&&CellScene[sprite.boardIndex[1]+2][sprite.boardIndex[0]][1] == 1){

                      sprite.tint = 0xffffff;

                    }else{

                      sprite.tint = SuspendColor;

                    }

                  }else{

                    sprite.tint = SuspendColor;

                  }

                }
              }


            }


        }else{


          if(dir == "left"){

            if(sprite.boardIndex[1] == 4){

              sprite.tint = 0xffffff;

            }else{


              if(t.HaveSupport(sprite.boardIndex)){

                sprite.tint = 0xffffff;


              }else{

                sprite.tint = SuspendColor;

              }

            }



          }else if(dir == "right"){


            if(sprite.boardIndex[1] == 4){

              sprite.tint = 0xffffff;

            }else {

              if (t.HaveSupport(sprite.boardIndex)) {

                sprite.tint = 0xffffff;


              } else {

                sprite.tint = SuspendColor;

              }
            }
          }

        }


      }else if(sprite.length == 3){



        if(dir == "left" || dir == "right"){

          if(sprite.boardIndex[1] == 4){

            sprite.tint = 0xffffff;

          }else{

            if(t.HaveSupport(sprite.boardIndex)){

              sprite.tint = 0xffffff;

            }else{

              var x0 = sprite.boardIndex[0]-1;
              var x1 = sprite.boardIndex[0]+1;
              var y  = sprite.boardIndex[1];

              var tempArr0 = [];
              var tempArr1 = [];

              tempArr0.push(x0);
              tempArr0.push(y);

              tempArr1.push(x1);
              tempArr1.push(y);

              if(x1 <= 5 && x0 >=0) {
                //if ((CellScene[tempArr0[1]][tempArr0[0]][2] == 1) && (CellScene[tempArr0[1]][tempArr0[0]][3] == 1) && (CellScene[tempArr1[1]][tempArr1[0]][2] == 1) && (CellScene[tempArr1[1]][tempArr1[0]][3] == 1)) {
                //  if (t.HaveSupport(tempArr0) && t.HaveSupport(tempArr1)) {
                //
                //    sprite.tint = 0xffffff;
                //
                //
                //  } else {
                //
                //    sprite.tint = SuspendColor;
                //
                //
                //  }
                //
                //} else


                var a = ((CellScene[tempArr0[1]+1][tempArr0[0]][0]==0)&&(CellScene[tempArr0[1]+1][tempArr0[0]][1]==0));
                var b =  ((CellScene[tempArr1[1]+1][tempArr1[0]][0]==0)&&(CellScene[tempArr1[1]+1][tempArr1[0]][1]==0));
                //console.log('a,b:',a,b,tempArr0[1]+1,tempArr0[0],tempArr1[1]+1,tempArr1[0]);
                  if( !a&&!b ) {

                    sprite.tint = 0xffffff;

                  }else{

                    sprite.tint = SuspendColor;

                  }




              }else{

                sprite.tint = SuspendColor;

              }
            }

          }
        }else if(dir == "down"){

          sprite.tint = SuspendColor;

        }else if(dir == "up"){

          if(sprite.boardIndex[1] == 3){

            sprite.tint = 0xffffff;

          }else if(sprite.boardIndex[1] == 4){

            sprite.tint = SuspendColor;

          }else{

            if((CellScene[sprite.boardIndex[1]+2][sprite.boardIndex[0]][0] ==1)&&CellScene[sprite.boardIndex[1]+2][sprite.boardIndex[0]][1] == 1){

              sprite.tint = 0xffffff;

            }else{

              sprite.tint = SuspendColor;

            }
          }
        }

      }

    }else{

      sprite.tint = 0xffffff;
    }

  });


};



Crow.WinState.prototype.CellSceneUpdate = function() {

  var t = this;

  InnerGroup.forEach(function(item){


    if(t.InnerBoard(item.boardIndex)){
      var boardX = item.boardIndex[0];
      var boardY = item.boardIndex[1];

      var dir = t.Direction(item.angle);


      for(var i=0;i<item.length;i++) {

        var x = boardX + PuzzleShape[item.length][dir][i][0];
        var y = boardY + PuzzleShape[item.length][dir][i][1];

        if(x>=0&&x<=5&&y>=0&&y<=4){

          //scene[y][x] += OccupyValue;
          for(var p=0;p<4;p++){

            CellScene[y][x][p] += item.cell[i][p];
          }
          //CellScene[y][x] += item.cell[i];

        }
      }
    }

  });

  OuterGroup.forEach(function(item){


    if(t.InnerBoard(item.boardIndex)){
      var boardX = item.boardIndex[0];
      var boardY = item.boardIndex[1];

      var dir = t.Direction(item.angle);


      for(var i=0;i<item.length;i++) {

        var x = boardX + PuzzleShape[item.length][dir][i][0];
        var y = boardY + PuzzleShape[item.length][dir][i][1];

        if(x>=0&&x<=5&&y>=0&&y<=4){

          //scene[y][x] += OccupyValue;
          for(var p=0;p<4;p++){

            CellScene[y][x][p] += item.cell[i][p];
          }
          //CellScene[y][x] += item.cell[i];

        }
      }
    }

  });


};
Crow.WinState.prototype.SceneUpdate = function() {

  var t = this;


  InnerGroup.forEach(function(item){

    if(t.InnerBoard(item.boardIndex)){
      var boardX = item.boardIndex[0];
      var boardY = item.boardIndex[1];

      var dir = t.Direction(item.angle);


      for(var i=0;i<item.length;i++) {

        var x = boardX + PuzzleShape[item.length][dir][i][0];
        var y = boardY + PuzzleShape[item.length][dir][i][1];

        if(x>=0&&x<=5&&y>=0&&y<=4){

          scene[y][x] += OccupyValue;

        }
      }
    }

  });


  OuterGroup.forEach(function(item){

    if(t.InnerBoard(item.boardIndex)){
      var boardX = item.boardIndex[0];
      var boardY = item.boardIndex[1];

      var dir = t.Direction(item.angle);


      for(var i=0;i<item.length;i++) {

        var x = boardX + PuzzleShape[item.length][dir][i][0];
        var y = boardY + PuzzleShape[item.length][dir][i][1];

        if(x>=0&&x<=5&&y>=0&&y<=4){

          scene[y][x] += OccupyValue;

        }
      }
    }

  });




};


Crow.WinState.prototype.MirrorOperation = function(item) {

  var scaleX = item.scale.x;
  var scaleY = item.scale.y;
  item.scale.set(scaleX*(-1),scaleY);


};


Crow.WinState.prototype.PuzzleToScene = function() {

};


Crow.WinState.prototype.InnerBoard = function(index) {


  if(index[0]<=5&&index[0]>=0&&index[1]<=4&&index[1]>=0){

    return true;
  }else{

    return false;
  }


};


Crow.WinState.prototype.InnerMirror = function(index) {


  if(index[0]<=5&&index[0]>=0&&index[1]==-1){

    return true;

  }else{

    return false;
  }


};

Crow.WinState.prototype.getJsonData = function() {

  Inner = [];
  Outer = [];
  InnerPosition = [];
  Result = [];
  var InnerData = LevelJSON.level[level].Inner;

  for (var n in InnerData) {

    Inner.push(InnerData[n]);
  }

  var OuterData = LevelJSON.level[level].Outer;

  for (var m in OuterData) {

    Outer.push(OuterData[m]);
  }

  var InnerPositionData = LevelJSON.level[level].position;

  for(var l in InnerPositionData){

    InnerPosition.push(InnerPositionData[l]);
  }

  var ResultData = LevelJSON.level[level].result;

  for(var h in ResultData){

    Result.push(ResultData[h]);
  }

  //console.log(Inner, Outer, InnerPosition,Result);

};

Crow.WinState.prototype.HaveSupport = function(index) {

  if((CellScene[index[1]+1][index[0]][0] ==1)&&CellScene[index[1]+1][index[0]][1] == 1) {

    return true;

  }else{

    return false;
  }

};



Crow.WinState.prototype.MirrorGui = function() {


  if(this.mirrorTween && this.mirrorTween.isRunning){

    return;
  }

  var mirrorGui = game.add.sprite(WIDTH - 750,10,'mirrorGui');

  this.mirrorTween = game.add.tween(mirrorGui).to({ alpha:0 }, 3000, Phaser.Easing.Linear.None, true,1000);


};

Crow.WinState.prototype.TurGuide = function() {


  OuterGroup.forEach(function(item){


    item.inputEnabled = false;

  });

  var puzzle_one = OuterGroup.children[0];
  var puzzle_two = OuterGroup.children[1];
  //var fingerLeft = game.add.sprite(MarginLeft - PuzzleSize,MarginTop,'fingerLeft');
  //var fingerRight = game.add.sprite(MarginLeft + 7*PuzzleSize - 200,MarginTop +100,'fingerRight');

  var fingerLeft = game.add.sprite(MarginLeft - PuzzleSize-100,MarginTop+120,'hand');
  var fingerRight = game.add.sprite(MarginLeft + 7*PuzzleSize+40,MarginTop +160,'hand');


  fingerLeft.animations.add('fingerLeft');
  fingerRight.animations.add('fingerRight');

  fingerLeft.animations.play('fingerLeft', 2, false);

    //game.add.tween(thumbSprite.animation);

    game.add.tween(puzzle_one).to( { angle: 90 }, 1000, Phaser.Easing.Linear.None, true,2000);

    game.add.tween(puzzle_one).to({x:WIDTH-200,y:100},1000,Phaser.Easing.Linear.None, true,3000);
    //game.add.tween(fingerLeft).to({x:WIDTH-200,y:40},1000,Phaser.Easing.Linear.None, true,2900);


    var fingerLeftTween = game.add.tween(fingerLeft).to({ x:MarginTop+5*PuzzleSize ,y:MarginTop+4.5*PuzzleSize - 100 }, 1000, Phaser.Easing.Linear.None, true,2900);
    fingerLeftTween.onComplete.add(function () { fingerLeft.destroy();

      fingerRight.animations.play('fingerRight', 3, false);


    });
    game.add.tween(puzzle_one).to( { x:MarginTop+5*PuzzleSize ,y:MarginTop+4.5*PuzzleSize }, 1000, Phaser.Easing.Linear.None, true,3000);

    var fingerRightTween = game.add.tween(fingerRight).to({ x:MarginTop+7*PuzzleSize - 20 ,y:MarginTop+4.5*PuzzleSize - 50}, 1000, Phaser.Easing.Linear.None, true,4900);
    game.add.tween(puzzle_two).to( { x:MarginTop+7*PuzzleSize ,y:MarginTop+4.5*PuzzleSize }, 1000, Phaser.Easing.Linear.None, true,5000);

    fingerRightTween.onComplete.add(function () {

      fingerRight.destroy();

      var PrincessClick = game.add.sprite(560,800,'hand');

      PrincessClick.animations.add('fingerLeft');

      PrincessClick.animations.play('fingerLeft', 2, false);

      setTimeout(function(){PrincessClick.destroy();},1000);

    });





  var PathA = [525, 675, 825, 975, 1125, 1275, 1275];
    var PathB =  [900, 750, 750, 750, 750, 750, 700];

    var LastFrame = game.add.tween(princess).to({
      x: PathA,
      y: PathB
    }, 3000,Phaser.Easing.Linear.None, true,7000);



    LastFrame.onComplete.addOnce(function(){


      var ring = game.add.sprite(MarginLeft+Result[1][0]*PuzzleSize,MarginTop+PuzzleBlockY*PuzzleSize - Result[1][1]*PuzzleSize-180,'ring',0);

      ring.animations.add('ring');

      ring.animations.play('ring',8,true);

      setTimeout(function(){TurState = false;

        game.state.start("WinState");

      },3000);


    });


  };




Crow.WinState.prototype.popDialog = function(spriteGroup) {


  $("body").append("<div class='divMask'></div>");

  if(this.success_animation && this.success_animation.isRunning){

    return;
  }

  game.soundManager.playSoundWin();


  var PopUp = game.add.sprite(game.world.centerX, 90,"PopUp");

  PopUp.anchor.set(0.5);





  this.MenuButton = game.add.button(-140,190,'button_icon',this.BackToMenuPage,this,0,0,0);
  this.NextLevelButton  = game.add.button(140,190,'Next',this.NextPageClick,this);
 
 // this.RestartButton = game.add.button(0,190,'button_icon',this.RestartGame,this,1,1,1);
 // this.RestartButton.anchor.setTo(0.5,0.5);
  this.NextLevelButton.anchor.setTo(0.5,0.5);
  this.NextLevelButton.scale.set(0.4,0.4);
 // this.MenuButton.anchor.setTo(0.5,0.5);
 // this.MenuButton.scale.set(0.8,0.8);
 // this.RestartButton.scale.set(0.8,0.8);



  PopUp.addChild(this.NextLevelButton);
 // PopUp.addChild(this.RestartButton);

//  this.MenuButton.inputEnabled = false;
  this.NextLevelButton.inputEnabled = false;
  //this.RestartButton.inputEnabled = false;

  var Results = game.add.bitmapText(-50,20, 'desyrel', '', 110);
  Results.anchor.set(0.5,0.5);
  Results.text = ''+((ShowTime).toFixed(0));
  var second = game.add.image(Results.width-10,30,'second');
  second.anchor.set(0.5,0.5);
  second.scale.set(1);
  PopUp.addChild(Results);
  PopUp.addChild(second);







  if(level == 2){

    this.NextLevelButton.visible = false;
    this.goApply  = game.add.button(-120,110,'goApply',this.goApplyLink,this);
    this.goApply.scale.set(1.5,1.5);
    PopUp.addChild(this.goApply);
   // this.MenuButton.position.x = 0;
  }


  this.success_animation = game.add.tween(PopUp).to( { y: game.world.centerY }, 1000, Phaser.Easing.Bounce.Out, true);

  this.success_animation.onComplete.addOnce(function(){


    var starNumbers = stars[level] ;

    var StarGroup = game.add.group();

    for(var u=0;u<starNumbers;u++){

      var GetStar = StarGroup.create(856+120*u,320,'score',u);

      GetStar.scale.set(0);

      GetStar.anchor.set(0.5);

      var starTween = game.add.tween(GetStar.scale).to( { x: 1, y: 1 }, 200, Phaser.Easing.Linear.None, true,u*500);

    }


   // this.MenuButton.inputEnabled = true;
    this.NextLevelButton.inputEnabled = true;
   // this.RestartButton.inputEnabled = true;
  //  this.BackPageButton.inputEnabled = true;
    //this.PlayButton.inputEnabled = true;
    princess.inputEnabled = true;






  }, this);




  var emitter = game.add.emitter(game.world.centerX, -100, 50);
  //emitter.minParticleSpeed.setTo(-100, -200);
  //emitter.maxParticleSpeed.setTo(100, -200);
  emitter.gravity = 150;
  emitter.makeParticles('colorRect',[0,1,2,3,4]);
  emitter.start(false, 5000, 100);


  //this.CountSate = false;

};

Crow.WinState.prototype.goApplyLink = function() {
  window.location.href="http://u9018329.viewer.maka.im/k/JIE03ZG4";

};

Crow.WinState.prototype.NextPageClick = function() {


  level = level + 1;

  //var LevelDataSource = LevelJSON.level[level].result;
  //
  //for(var i in LevelData){
  //
  //  LevelData[i] = LevelDataSource[i];
  //}

  //AddShadowLayer(50);

  game.state.start("WinState");


  $('.divMask').remove();

};



Crow.WinState.prototype.IsGameOk = function() {


 // this.BackPageButton.inputEnabled = false;


  if(this.FindPath(Result))
  {



    OuterGroup.forEach(function(OutSprite){

      OutSprite.input.enabled = false;

    });




    GameFinish = true;


    if(level == 44){

      //this.DisablePuzzle();

      stars[level] = 3;

      localStorage.setItem(localStorageName, stars.toString());


      //this.popDialog();
      this.WalkAnimation();



    }else{

      //this.DisablePuzzle();





      var timeKill = (ShowTime).toFixed(0);

      if(timeKill < 10){

        stars[level] = 3;

      }else if(timeKill < 20){

        stars[level] = 2;

      }else{

        stars[level] = 1;

      }



      if(stars[level + 1] != undefined && stars[level + 1] == -1){
        stars[level + 1] = 0;

        //console.log("level:!!!",stars[level + 1]);
      }
      localStorage.setItem(localStorageName, stars.toString());

      this.WalkAnimation();

      //this.popDialog();
    }

    return 1;

  }else{

    return 0;

  }

};

Crow.WinState.prototype.WalkAnimation = function() {


  //this.PlayButton.inputEnabled = false;
  princess.inputEnabled = false;

  //console.log(WalkPath);

  var PathX = [];
  var PathY = [];

  for(var n in WalkPath){

    PathX.push(MarginLeft+WalkPath[n][0]*PuzzleSize);
    PathY.push(MarginTop+5*PuzzleSize - WalkPath[n][1]*PuzzleSize);

  }

  //console.log("path!!!!!!",PathX,PathY);

  PathX.push(PathX[PathX.length -1 ]);
  PathY.push(PathY[PathY.length -1 ]- 70);


  var tween = game.add.tween(princess).to({
    x: PathX,
    y: PathY
  }, 3000,Phaser.Easing.Quadratic.Out, true).interpolation(function(v, k){
    return Phaser.Math.bezierInterpolation(v, k);
  });






  tween.onComplete.addOnce(this.popDialog, this);
  //
  //tween.onComplete.addOnce(function(){
  //
  //
  //  var emitter = game.add.emitter(WIDTH/2, HEIGHT + 100, 30);
  //
  //  emitter.makeParticles('PuGong',[0,1,2,3,4,5,6,7]);
  //
  //  emitter.setRotation(0, 0);
  //  emitter.setAlpha(0.3, 1);
  //  emitter.setScale(0.5, 1);
  //  emitter.gravity = -150;
  //  emitter.start(false, 3000, 100);
  //
  //
  //}, this);
  //
  //
  //  var t = this;
  //
  //  setTimeout(function(){
  //
  //    t.popDialog();
  //
  //  },5000);

  //var emitter = game.add.emitter(game.world.centerX, -100, 50);
  ////emitter.minParticleSpeed.setTo(-100, -200);
  ////emitter.maxParticleSpeed.setTo(100, -200);
  //emitter.gravity = 150;
  //emitter.makeParticles('colorRect',[0,1,2,3,4]);
  //emitter.start(false, 5000, 100);


  //this.success_animation = game.add.tween(PopUp).to( { y: game.world.centerY }, 1000, Phaser.Easing.Bounce.Out, true);




};




Crow.WinState.prototype.FindPath = function(resultInput) {


     var success = true;

     var resultArr = CellScene.slice();

     var resultArrSimple = [];

     for(var i=0;i<PuzzleBlockY;i++){

       var row = [];

       for(var j=0;j<PuzzleBlockX;j++){

         row.push(Array_Simple(resultArr[i][j]));

       }

       resultArrSimple.push(row);
     }





     var chartHeight = {

       0:[0,0],
       1:[0,0],
       2:[0,0],
       3:[0,0],
       4:[0,0],
       5:[0,0]

     };


    for(var p=0;p<PuzzleBlockX;p++){

      for(var q=0;q<PuzzleBlockY;q++){

        if(resultArrSimple[q][p]!=0){

          chartHeight[p][0] = 5 - q;

          if(resultArrSimple[q][p] == 0.5){

            chartHeight[p][1] = 1;

          }else if(resultArrSimple[q][p] == -0.5){

            chartHeight[p][1] = -1;

          }else{

            chartHeight[p][1] = 0;

          }

            break;
        }
      }
    }


  //console.log("simple:",chartHeight);

  var start = [];
  start.push(resultInput[0][0]);
  start.push(resultInput[0][1]);

  var end = [];
  end.push(resultInput[1][0]);
  end.push(resultInput[1][1]);





  //console.log(chartHeight[0][0],start[1],chartHeight[end[0]][0],end[1],chartHeight[0][1],chartHeight[1][1]);

  if(chartHeight[0][0]!=start[1] || chartHeight[end[0]][0]!=end[1] || chartHeight[0][1]!=0 ||chartHeight[end[0]][1]!=0)
  {
    success = false;

    return success;
  }


  var temp = [];
  temp.push(resultInput[0][1]);
  temp.push(0);

  WalkPath = [];
  var WalkFirstCell = [];
  WalkFirstCell.push(resultInput[0][0]);
  WalkFirstCell.push(resultInput[0][1]);
  WalkPath.push(WalkFirstCell);

  //for(var i=1;i<=end[0];i++){
  for(var i=resultInput[0][0]+1;i<=end[0];i++){


    if((chartHeight[i][0]-temp[0]) == 0){

        if(temp[1] == 0 && chartHeight[i][1] == 1){
          success = false;
          break;

        }else if(temp[1] == -1 && chartHeight[i][1] == 0){

          success = false;
          break;
        }else if((temp[1] == 1 && chartHeight[i][1] == 1)||(temp[1] == -1 && chartHeight[i][1] == -1)){

          success = false;
          break;
        }

    }else{

      if(chartHeight[i][0]-temp[0]==1){

        if(chartHeight[i][1] == 1){

          if(temp[1]!=-1){


          }else{

            success = false;
            break;

          }

        }else{

         success = false;
         break;
        }
      }else if(chartHeight[i][0]-temp[0]==-1){


        // 暂定
        //if(chartHeight[i][1] == -1){

        if(temp[1] == -1){

        }else{

          success = false;
          break;
        }

      }else{

          success = false;
          break;
      }
    }

    var WalkCell = [];
    WalkCell.push(i);
    WalkCell.push(chartHeight[i][0]);
    WalkPath.push(WalkCell);


    temp[0] = chartHeight[i][0];
    temp[1] = chartHeight[i][1];


  }

  PathInsert();


return success;
};


function PathInsert(){

  var walkX = WalkPath[0][0];
  var walkY = WalkPath[0][1];
  //console.log(WalkPath);


  var InsertPoint = [];

  for(var i=1;i<WalkPath.length;i++) {


    if ((Math.abs(WalkPath[i][0] - walkX) == 1) && (Math.abs(WalkPath[i][1] - walkY) == 1)) {

      InsertPoint.push(i-1);

    }

    walkX = WalkPath[i][0];
    walkY = WalkPath[i][1];

  }


  //console.log("walk path",WalkPath);
  //console.log("insert point ",InsertPoint);

  for(var i=InsertPoint.length-1;i>=0;i--){

    var InsertTemp = [];

    console.log(InsertPoint[i]);

    InsertTemp.push((WalkPath[InsertPoint[i]][0] + WalkPath[InsertPoint[i]+1][0])/2);
    InsertTemp.push((WalkPath[InsertPoint[i]][1] + WalkPath[InsertPoint[i]+1][1])/2);

    WalkPath.splice(InsertPoint[i],0,InsertTemp);
  }


  console.log(WalkPath);

  };

function ArrayMin(arr){

  var min = 1;
  var temp ;

  for( temp in arr){

    if(arr[temp] < min){

      min = arr[temp];
    }

  }

  return min;

};


function Array_Simple(arr){

  var average = 0;

  if(arr[0]==arr[1]==arr[2]==arr[3]){

    average = arr[0];

  }else if(arr[0]==0.3){

    average = 0.5;

  }else if(arr[1]==0.3){

    average = -0.5;

  }else{

    average = 1;
  }

  return average;
};


function HaveHalf(arr){

  for(var i=0;i<arr.length;i++){

    for(var j=0;j<4;j++){

      if(arr[i][j] == 0.3){

        return 1;
      }
    }
  }

  return 0;
};


Crow.WinState.prototype.userInFo = function () {

  this.headerImg = game.add.sprite(-1150 + 10, 5, 'headerImg');
  this.headerImg.scale.set(0.16,0.16);
  var mask = game.add.graphics(0, 0);

  mask.beginFill(0xffffff);

  mask.drawCircle(10 + 150+this.headerImg.width/2, 5+this.headerImg.height/2 , this.headerImg.width);

  console.log(this.headerImg.width);

  this.headerImg.mask = mask;

  var style = {font: "30px Arial", fill: "#000", align: "center"};
  if (userinfo) {
    this.userinfoName = game.add.text(300, 60, userinfo.nickname, style);
  } else {
    this.userinfoName = game.add.text(-1000, 60, '登陆', style);
    this.userinfoName.inputEnabled = true;
    //this.userinfoName.input.enableDrag();
    this.userinfoName.events.onInputDown.add(this.weChatLogin, this);
  }
};

Crow.WinState.prototype.weChatLogin = function () {      //微信PC端登陆
  if(ua.match(/MicroMessenger/i)=="micromessenger") {               //判断是否微信端登陆
    var url = window.location.href;
    $.ajax({
      type: "GET",
      dataType: "JSON",
      url: MaiyajiaBaseURL + '/v1/users/me',
      success: function (data) {
        if(data.success){
          userinfo = data.userinfo;
          var nickname = userinfo.nickname
          if(nickname && nickname.length>11){
            userinfo.nickname =  nickname.substring(0,12) + '··';
          };
          game.state.start("WinState");
          return;
        }else{
          let callbakcUrl = encodeURIComponent(url);
          window.location.href = MaiyajiaBaseURL +'/v1/wx-gongzonghao-auth?callback=' + callbakcUrl;
        };
      }
    });
  }else{
    let url = encodeURIComponent(MaiyajiaBaseURL + '/v1/');
    let calUrl = encodeURIComponent(MaiyajiaBaseURL + wechatUrl);
    openWin('https://open.weixin.qq.com/connect/qrconnect?appid=wx53a09f4b5c9d4cec&redirect_uri=' + url + 'wx-open-auth&response_type=code&scope=snsapi_login&state=' + calUrl + '#wechat_redirect', '微信登陆', '800', '600');
    window.addEventListener('message', function (event) {
      if (event.origin != MaiyajiaBaseURL) return;
      $.ajax({
        type: "GET",
        dataType: "JSON",
        url: MaiyajiaBaseURL + '/v1/users/me',
        success: function (data) {
          if (data.success) {
            userinfo = data.userinfo;
            var nickname = userinfo.nickname
            if (nickname && nickname.length > 11) {
              userinfo.nickname = nickname.substring(0, 12) + '··';
            };
            game.state.start("WinState");
          }
        }
      });
    }, false);
  }
};



function openWin(url, name, iWidth, iHeight) {
  //获得窗口的垂直位置
  var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
  //获得窗口的水平位置
  var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
  window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
}

function getCookie(sName) {
  var arr, reg = new RegExp("(^| )" + sName + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    var value = unescape(arr[2]);
    return JSON.parse(value);
  }
  else
    return null;
}
