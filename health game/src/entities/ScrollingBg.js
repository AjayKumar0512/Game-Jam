var ScrollingBg = cc.Sprite.extend({
  ctor: function (image, sWidth) {
    this._super(image);

    this.sWidth = sWidth;

    this.speed = 0;

    this.resetX = null;

    this.setDirection(GameConstants.Direction.LEFT);
    this.addExtraView(image);
    this.scheduleUpdate();
  },

  onEnter: function () {
    this._super();
    LOG("ScrollingBg onEnter");
  },

  onExit: function () {
    this._super();
    this.removeAllChildren(true);
    LOG("ScrollingBg onExit");
  },

  addExtraView: function (image) {
    let count = 1;
    if (this.sWidth > this.width) {
      count += (Math.floor(this.sWidth / this.width) + 1);
    }
    let overlapping = 2;
    for (let index = 1; index <= count; index++) {
      let imageLeft = new cc.Sprite(image);
      this.addChild(imageLeft);
      imageLeft.setAnchorPoint(cc.p(0, 0));
      imageLeft.setPosition(cc.p(-(this.width - overlapping) * index, 0));

      let imageRight = new cc.Sprite(image);
      this.addChild(imageRight);
      imageRight.setAnchorPoint(cc.p(0, 0));
      imageRight.setPosition(cc.p((this.width - overlapping) * index, 0));
    }
  },
  setDirection: function (direction) {
    switch (direction) {
      case GameConstants.Direction.NONE:
        this.dir = 0;
        this.unscheduleUpdate();
        break;
      case GameConstants.Direction.LEFT:
        this.dir = -1;
        this.scheduleUpdate();
        break;
      case GameConstants.Direction.RIGHT:
        this.dir = 1;
        this.scheduleUpdate();
        break;
    }
  },

  update(dt) {
    if (!this.resetX) {
      this.resetX = this.x + this.width * this.dir;
    }
    var x = this.x;
    x += this.speed * this.dir * dt;
    switch (this.dir) {
      case -1: {
        if (x <= this.resetX) {
          x += this.width;
        }
      }
        break;
      case 1: {
        if (x >= this.resetX) {
          x -= this.width;
        }
      }
        break;
    }
    this.x = x;
  }
});