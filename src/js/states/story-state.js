
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.StoryState = function () {
    "use strict";
    Crow.BaseState.call(this);
};

Crow.StoryState.prototype = Object.create(Crow.BaseState.prototype);
Crow.StoryState.prototype.constructor = Crow.StoryState;

Crow.StoryState.prototype.preload = function () {
    "use strict";

};

//var content = [
//    "艾 达 公 主 ， 别 担 心 ， 我 可 以 化 身 为 台 阶 ， 给 你 搭 路 。 现 在 跟 着 我 的 指 引 ， 一 起 通 往 第 一 个 通 关 台 吧"
//];
//
//var content = [
//    "艾 达 公 主 ， 别 担 心 ， 我 可 以 化 身 为 台 阶 ，",
//    "给 你 搭 路 。 现 在 跟 着 我 的 指 引 ， 一 起 通 往 ",
//    "第 一 个 通 关 台 吧!"
//];


var content = [

    "一 个 美 丽 而 祥 和 的 王 国 ，",
    "住 着 善 良 的 乌 鸦 人 。",
    "很 久 以 前 ，",
    "那 里 的 世 界 是 平 面 的 ，",
    "乌 鸦 人 也 不 是 人 的 样 子 。",
    "某 天 ，",
    "来 自 外 世 界 的 巫 师 ，",
    "带 来 神 圣 能 量 石 ，",
    "成 就 了 这 里 美 好 的 一 切 。",
    "乌 鸦 人 把 巫 师 视 为 神 明 ，",
    "为 他 建 造 神 庙 。",
    "后 来 ，",
    "巫 师 离 开 了 ，",
    "留 下 能 量 石 ，",
    "让 乌 鸦 王  子 守 护 。",
    "小 公 主 艾 达 ，",
    "被 能 量 石 迷 住 ，",
    "偷 偷 拿 走 了 当 作 自 己 的 玩 具 。",
    "能 量 场 被 移 动 ，",
    "天 崩 地 裂 ，",
    "乌 鸦 人 又 变 回 了 乌 鸦 的 样 子 ，",
    "神 庙 也 沉 入 湖 底 ，",
    "王 子 也 因 此 被 困 。",
    "艾 达 后 悔 万 分 ，",
    "决 心 要 把 能 量 宝 石 送 回 原 位 。",
    "可 是 空 间 已 经 破 碎 ，",
    "熟 悉 的 路 不 复 存 在 ，",
    "艾 达 必 须 运 用 她 的 智 慧 、 勇 气 、",
    "坚 毅 去 完  成 救 赎 ..  "


];

var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 60;
var lineDelay = 500;
var text;
var story;


Crow.StoryState.prototype.nextLine = function () {

    if (lineIndex === content.length) {
        // 结束

        story.events.onInputDown.add(this.NextStory, this);

        lineIndex = 0;


        return 1;
    }
    // 当前行拆分成单词数组
    line = content[lineIndex].split(' ');
    // 词索引清零
    wordIndex = 0;
    // 处理单词
    game.time.events.repeat(wordDelay, line.length, this.nextWord, this);
    // 行索引加一
    lineIndex++;
};


Crow.StoryState.prototype.nextWord = function () {

    // 添加下一个词
    text.text = text.text.concat(line[wordIndex] + " ");

    //&&((line[wordIndex]=='，')||)(line[wordIndex]=='.')

    if((text.text.length > 105)&&((line[wordIndex]=='，')||(line[wordIndex]=='.'))){

        setTimeout(function(){

            text.text = '';

        },499);
    }
    //console.log(text.text.length);
    // 下一个词

    wordIndex++;
    // 最后一个词
    if (wordIndex === line.length) {
        // 加一个回车
        text.text = text.text.concat("\n");
        // 延迟一会儿添加下一行
        game.time.events.add(lineDelay, this.nextLine, this);
    }
};


Crow.StoryState.prototype.create = function () {
    "use strict";

    var LevelStartArray = [];
    var levelStarDate  = localStorage.getItem(localStorageName)==null?LevelStartArray.toString():localStorage.getItem(localStorageName);
    // 将字符串转换为数组数据
    LevelStartArray= levelStarDate.split(",");

    this.TellStory();


    //if(LevelStartArray.length > 1){
    //
    //    if(LevelStartArray[0]<=0){
    //
    //        this.TellStory();
    //
    //    }else{
    //
    //        game.state.start('StartState');
    //
    //    }
    //
    //}else{
    //
    //    this.TellStory();
    //}
    //game.state.start('StartState');


};


Crow.StoryState.prototype.TellStory = function () {


    $("body").css("background-image","url(./asset/img/story.png)");

    story = game.add.tileSprite(0, 0, WIDTH, HEIGHT, "transp");


    //game.add.image(0, 0, 'mask');

    game.add.button(50,HEIGHT - 150,'storyNext',this.storyNext,this,0,0,0);

    game.add.text(180, HEIGHT - 80, '略过', { font: "50px Arial", fill: "#000" });


    story.inputEnabled = true;

    text = game.add.text(120, 50, '', { font: "50px Arial", fill: "#ffffff" });

    text.lineSpacing = 35;

    this.nextLine();

};

Crow.StoryState.prototype.NextStory = function () {

    game.state.start('StartState');

};


Crow.StoryState.prototype.storyNext = function () {

    game.state.start('StartState');

};

