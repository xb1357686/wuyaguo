
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.StartState = function () {
  "use strict";
  Crow.BaseState.call(this);
};

Crow.StartState.prototype = Object.create(Crow.BaseState.prototype);
Crow.StartState.prototype.constructor = Crow.StartState;

Crow.StartState.prototype.create = function () {
  "use strict";


  this.LockState = true;
  //// 背景，遮罩，实现

 // $("body").css("background-image","url(./asset/img/GreenBg.png)");

  //game.add.image(0, 0, 'RedBg');
  //game.add.image(0, 0, 'mask');
  //AddShadowMask();
  CreateSnow();

  LevelJSON = game.cache.getJSON('LevelData');

  this.canChangePage = true;

  // 第一关设置为0星状态,使可进入
  stars[0] = 0;
  // 除第一关外,其他关卡都设置为-1,锁住状态
  for(var l = 1; l < columns * rows * pages; l++){
    stars[l] = -1;
    //stars[l] = 1;

  }
 

  // 从本地存储中获取星星等级的数据,用作继续上次的游戏进度
  this.savedData = localStorage.getItem(localStorageName)==null?stars.toString():localStorage.getItem(localStorageName);
  // 将字符串转换为数组数据
  stars = this.savedData.split(",");

  // 透明背景图,用作翻页效果,长度为 页面数量*游戏页面宽度
  this.scrollingMap = game.add.tileSprite(0, 0, pages * WIDTH, HEIGHT, "transp");
  // 使能透明背景图的对输入响应
  this.scrollingMap.inputEnabled = true;
  // 使能透明背景图的拖动输入
  this.scrollingMap.input.enableDrag(false);
  // 禁止透明背景图的垂直方向的拖动
  this.scrollingMap.input.allowVerticalDrag = false;
  this.scrollingMap.input.allowHorizontalDrag = true;

  // 检测边界的盒子,限制拖拽的范围
  this.scrollingMap.input.boundsRect = new Phaser.Rectangle(WIDTH - this.scrollingMap.width, HEIGHT - this.scrollingMap.height, this.scrollingMap.width * 2 - WIDTH, this.scrollingMap.height * 2 - HEIGHT);

  // 从第一页开始启动
  this.currentPage = 0;
  // 关卡缩略图的数组
  this.pageSelectors = [];
  // 根据 缩略图的宽度/间隔和列数决定 缩略图布局的宽度
  var rowLength = thumbWidth * columns + spacing * (columns - 1);
  // 缩略图两边的空白宽度
  var leftMargin = (WIDTH - rowLength) / 2;
  // 同样的方法设置上下的布局
  var colHeight = thumbHeight * rows + spacing * (rows - 1);
  //var topMargin = (game.height - colHeight) / 2;
  var topMargin = (HEIGHT - colHeight) / 2;

 // this.MenuButton = game.add.button(WIDTH/2,HEIGHT - 300,'button_icon',this.BackToMenuPage,this,0,0,0);
 // this.NextPageButton   = game.add.button(WIDTH/2+240,HEIGHT - 280,'Next',this.NextPageClick,this,0,0,0);
 // this.BackPageButton   = game.add.button(WIDTH/2-240,HEIGHT - 280,'Back',this.BackPageClick,this,0,0,0);

 // this.MenuButton.anchor.set(0.5,0);
 // this.NextPageButton.anchor.set(0.5,0);
 // this.BackPageButton.anchor.set(0.5,0);

 // this.NextPageButton.scale.set(0.6,0.6);
 // this.BackPageButton.scale.set(0.6,0.6);


 // this.BackPageButton.visible = false;

  this.scrollingMap.events.onDragStart.add(function(sprite, pointer){
    this.scrollingMap.startPointerPosition = new Phaser.Point(pointer.x, pointer.y);
    this.scrollingMap.startPosition = this.scrollingMap.x;
  }, this);
  // 结束拖拽事件处理
  this.scrollingMap.events.onDragStop.add(function(sprite, pointer){
    // 如果坐标没有发生改变,判断为点击关卡事件
    if(this.scrollingMap.startPosition == this.scrollingMap.x && this.scrollingMap.startPointerPosition.x == pointer.x && this.scrollingMap.startPointerPosition.y == pointer.y){
      // 检测哪个关卡被点击
      for(i = 0; i < this.scrollingMap.children.length; i++){

        var bounds = this.scrollingMap.children[i].getBounds();
        // 检查关卡是否被锁定
        if(bounds.contains(pointer.x, pointer.y)){

          if(this.LockState){

            if(this.scrollingMap.children[i].frameNum > 0){

              game.soundManager.playSoundRight();


              level = this.scrollingMap.children[i].levelNumber;

              // 从JSON加载关卡数据

              //var LevelDataSource = LevelJSON.level[level].result;
              //
              //for(var i in LevelData){
              //
              //  LevelData[i] = LevelDataSource[i];
              //}

              //AddShadowLayer(50);
              //alert('play level:'+LevelData);
              game.state.start("WinState");
            }
            // 如果关卡被锁定,抖动关卡缩略图
            else{

              this.LockState = false;

              game.soundManager.playSoundNextLevel();


              var buttonTween = game.add.tween(this.scrollingMap.children[i]);

              // 设置抖动幅度重复次数
              for(var repeat=0;repeat<4;repeat++)
              {
                buttonTween.to({
                  x: this.scrollingMap.children[i].x + thumbWidth / 15
                }, 20, Phaser.Easing.Cubic.None);
                buttonTween.to({
                  x: this.scrollingMap.children[i].x - thumbWidth / 15
                }, 20, Phaser.Easing.Cubic.None);

              }
              // 回到初始位置
              buttonTween.to({
                x: this.scrollingMap.children[i].x
              }, 20, Phaser.Easing.Cubic.None);
              buttonTween.start();
              buttonTween.onComplete.add(function(){this.LockState = true}, this);
            }
            break;
          }


        }
      }
    }
    else{
      // 拖拽1/8 页面判断为切换页面的操作
      if(this.scrollingMap.startPosition - this.scrollingMap.x > game.width / 8){
        this.changePage(1);
      }
      else{
        if(this.scrollingMap.startPosition - this.scrollingMap.x < - game.width / 8){
          this.changePage(-1);
        }
        else{
          this.changePage(0);
        }
      }
    }
  }, this);

  // 遍历所有页面
  for(var k = 0; k < pages; k++){
    // 遍历所有列
    for(var i = 0; i < columns; i++){
      if(i > 2){
        break;
      }
      // 遍历所有行
      for(var j = 0; j < rows; j++){
        // 添加关卡缩略图

        if(j ===1 ){
          break;
        }
        var thumb = game.add.image(k * game.width + leftMargin + i * (thumbWidth + spacing), topMargin + j * (thumbHeight + spacing - 30), "levelthumb");

        // 每个关卡设置一个的数字(关卡关数)
        thumb.levelNumber = k * (rows * columns) + j * columns + i;

        if(thumb.levelNumber < TotalLevel ) {

          // 根据星星等级数组图标

          thumb.frameNum = parseInt(stars[thumb.levelNumber]) + 1;

          if(stars[thumb.levelNumber] > -1){
            this.bmpText = game.add.bitmapText(thumb.width/2, thumb.height/2-12, 'desyrel', '', 96);
            this.bmpText.anchor.set(0.5,0.5);
            this.bmpText.text = '' + (thumb.levelNumber+1) ;
            thumb.addChild(this.bmpText);


            for(var p=0;p<3;p++){

              var startEmpty = game.add.sprite(25*2+20*2*p,thumb.height/2+15*2,'start',0);
              startEmpty.scale.set(0.4);
              thumb.addChild(startEmpty);

            }

            for(var q=0;q<stars[thumb.levelNumber];q++){
              //var startFull = game.add.sprite(25+20*q,thumb.height/2+15,'start',1);
              var startFull = game.add.sprite(25*2+20*2*q,thumb.height/2+15*2,'start',1);
              startFull.scale.set(0.4);
              thumb.addChild(startFull);
            }



          }else{
            this.locker = game.add.image(thumb.width/2, thumb.height/2,'locker');
            this.locker.anchor.set(0.5,0.5);
            thumb.addChild(this.locker);



          }

          //thumb.scale.setTo(2,2);
          this.scrollingMap.addChild(thumb);

        }


      }
    }



  }
//  this.tipImg =  game.add.image(10,0,'tipImg');
//  this.tipImg.inputEnabled = true;
//  this.tipImg.events.onInputDown.add(this.tipHide, this);

};
Crow.StartState.prototype.tipHide = function() {

//  this.tipImg.destroy();

};


Crow.StartState.prototype.BackToMenuPage = function() {

  game.soundManager.playSoundRight();


  game.state.start('MenuState');

};


Crow.StartState.prototype.changePage = function(page){

  if(this.canChangePage){
    // 当页面切换过程,禁止重复触发切换页面
    this.canChangePage = false;
    // 切换到目标页面
    this.currentPage += page;


    //console.log(this.currentPage);

    if(this.currentPage > 0){

    //  this.BackPageButton.visible = true;


      if(this.currentPage >=4){

       // this.NextPageButton.visible = false;

      }
    }

    if(this.currentPage < 4){

    //  this.NextPageButton.visible = true;


      if(this.currentPage <=0){

      //  this.BackPageButton.visible = false;

      }
    }

    // 切换页面的转换效果
    var tween = game.add.tween(this.scrollingMap).to({
      x: this.currentPage * -game.width
    }, 100, Phaser.Easing.Cubic.Out, true);
    // 切换完成将使能换页标志
    tween.onComplete.add(function(){
      this.canChangePage = true;
    }, this);
  }
};


Crow.StartState.prototype.NextPageClick = function() {

  game.soundManager.playSoundRight();

  this.changePage(1);

  if(this.currentPage > 0){

 //   this.BackPageButton.visible = true;


    if(this.currentPage >=4){

    //  this.NextPageButton.visible = false;

    }
  }




};


Crow.StartState.prototype.BackPageClick = function() {

  //console.log(this.currentPage);

  game.soundManager.playSoundRight();


  this.changePage(-1);

  if(this.currentPage < 4){

  //  this.NextPageButton.visible = true;


    if(this.currentPage <=0){

    //  this.BackPageButton.visible = false;

    }
  }

};


Crow.StartState.prototype.update = function() {

  SnowUpdate();

};




