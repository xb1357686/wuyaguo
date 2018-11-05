
var Phaser = Phaser || {};
var Crow = Crow || {};

Crow.BaseState = function () {
  "use strict";
  Phaser.State.call(this);
};

Crow.BaseState.prototype = Object.create(Phaser.State.prototype);
Crow.BaseState.prototype.constructor = Crow.BaseState;
