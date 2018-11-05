var WIDTH = 1950;
var HEIGHT = 1050;
// 关卡页数
var pages = 1;
// 关卡页面的列数
var columns = 5;
// 关卡页面的行数
var rows = 2;
// 关卡的列宽
var thumbWidth = 94*2;
// 关卡的行宽
var thumbHeight = 144*2;
// 两个关卡间距
var spacing = 30;
// 存储通关获得的星星级别
var stars = [];
// 本地存储通过数据的变量名
// var localStorageName = "levelselect";
var localStorageName = "PrincessLevelSelect";

// 正在进行的关卡的级别
var TotalLevel = 45;
// 记录当前等级
var level;
// 关卡json数据
var LevelJSON;
// 事件声音
var PuzzleSize = 150;
var PuzzleNum  =  8;
var MarginLeft = 525;
var MarginTop  = 150;

var allowDragStart = true;    //允许拖拽开始
var allowDragStop = false;
var temPosition={};
var ZoomSourceData = [0,1,2,3,4,5,6,7,8];
// 每个拼图有一个index编号,通过ZoomData方法遍历所有图片获取里面的index
var LevelData= [0,1,2,3,4,5,6,7,8];
// 拼图结果数据



var max = 0;
var front_emitter;
var mid_emitter;
var back_emitter;
var update_interval = 4 * 60;
var SnowCount = 0;

var imgUrl = "asset/img/";
var soundUrl = "asset/sound/";

//
//var imgUrl = "https://static.allinfun.cn/game/tale-of-crow-country/img/";
//var soundUrl = "https://static.allinfun.cn/game/tale-of-crow-country/sound/";

var userinfo;     //登陆用户信息
const MaiyajiaBaseURL = 'https://allinfun.cn';
const ua = navigator.userAgent.toLowerCase();
const wechatUrl = '/passport/wechatLogin.html';




function AddShadowMask(){

    var ShadowMask = game.add.sprite(0,0,'ShadowMask');

    var ShadowTween = game.add.tween(ShadowMask).to({ alpha:0 }, 1500, Phaser.Easing.Linear.None, true);

};


function CreateSnow() {


    back_emitter = game.add.emitter(game.world.centerX, -32, 600);
    back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    back_emitter.maxParticleScale = 0.6;
    back_emitter.minParticleScale = 0.2;
    back_emitter.setYSpeed(20, 100);
    back_emitter.gravity = 0;
    back_emitter.width = game.world.width * 1.5;
    back_emitter.minRotation = 0;
    back_emitter.maxRotation = 40;

    mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
    mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    mid_emitter.maxParticleScale = 1.2;
    mid_emitter.minParticleScale = 0.8;
    mid_emitter.setYSpeed(50, 150);
    mid_emitter.gravity = 0;
    mid_emitter.width = game.world.width * 1.5;
    mid_emitter.minRotation = 0;
    mid_emitter.maxRotation = 40;

    front_emitter = game.add.emitter(game.world.centerX, -32, 50);
    front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
    front_emitter.maxParticleScale = 1;
    front_emitter.minParticleScale = 0.5;
    front_emitter.setYSpeed(100, 200);
    front_emitter.gravity = 0;
    front_emitter.width = game.world.width * 1.5;
    front_emitter.minRotation = 0;
    front_emitter.maxRotation = 40;

    changeWindDirection();

    back_emitter.start(false, 14000, 20);
    mid_emitter.start(false, 12000, 40);
    front_emitter.start(false, 6000, 1000);

}

function SnowUpdate() {

    SnowCount++;

    if (SnowCount === update_interval)
    {
        changeWindDirection();
        update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
        SnowCount = 0;
    }

}

function changeWindDirection() {

    var multi = Math.floor((max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    max = max + frag;

    if (max > 200) max = 150;
    if (max < -200) max = -150;

    setXSpeed(back_emitter, max);
    setXSpeed(mid_emitter, max);
    setXSpeed(front_emitter, max);

}

function setXSpeed(emitter, max) {

    emitter.setXSpeed(max - 20, max);
    emitter.forEachAlive(setParticleXSpeed, this, max);

}

function setParticleXSpeed(particle, max) {

    particle.body.velocity.x = max - Math.floor(Math.random() * 30);

}