
var Phaser = Phaser || {};
var Crow = Crow || {};

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game',null,true);

game.state.add("BootState", new Crow.BootState());
game.state.add("PreloadState", new Crow.PreloadState());
game.state.add("MenuState", new Crow.MenuState());
game.state.add("StartState", new Crow.StartState());
game.state.add("WinState", new Crow.WinState());
game.state.add("StoryState", new Crow.StoryState());

game.state.start("BootState");
