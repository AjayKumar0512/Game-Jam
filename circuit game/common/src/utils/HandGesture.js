var HandGesture = cc.Sprite.extend({
  ctor: function () {
    this._super();
    this.setAnchorPoint(cc.p(0.2, 0.8));
    this.loadHandSpriteSheet();
    this.clickTag = 100;
    this.dragTag = 10;
    this.playClickSoundCb = null;
    this.setScale(1.1);
  },

  loadHandSpriteSheet: function () {
    cc.spriteFrameCache.addSpriteFrames(commonRes.Hand_Gesture_plist, commonRes.Hand_Gesture_png);
  },

  setPlayClickSoundCb: function (playClickSoundCb) {
    this.playClickSoundCb = playClickSoundCb;
  },

  runClickAnimation: function (initialPoint) {
   
    this.setVisible(true);
    this.x = initialPoint.x;
    this.y = initialPoint.y;
    this.setOpacity(255);
    if (this.getActionByTag(this.clickTag)) { //do nothing if already doing click animation
      return;
    }
    if (this.getActionByTag(this.dragTag)) { //if(drag animation is going on earlier)
      this.stopAction(this.getActionByTag(this.dragTag));
    }
    let action = cc.repeatForever(cc.sequence(cc.callFunc(this.playClickSound, this), this.getClickAnimation()));
    action.setTag(100);
    this.runAction(action);
  },

  runClickAnimationWithoutRelease(initialPoint) {
    this.stopAllActions();
    this.x = initialPoint.x;
    this.y = initialPoint.y;
    this.runAction(this.getClickAndHoldAnimation());
  },
  runClickReleaseAnimation() {
    this.stopAllActions();
    this.runAction(this.getClickReleaseAnimation());
  },
  runClickAndDragAnimation: function (initialPoint, finalDragPoint, startDelay = 0, speed = 1000, delay2 = 0.1) {
    if (this.getActionByTag(this.dragTag)) { //do nothing if already doing drag animation
      return;
    }
    if (this.getActionByTag(this.clickTag)) { //if(click animation is going on earlier)
      this.stopAction(this.getActionByTag(this.clickTag));
    }
    this.x = initialPoint.x;
    this.y = initialPoint.y;
    if (!this.isVisible()) {
      var showCall = cc.callFunc((target) => {
        target.setVisible(true);
      }, this);
      this.runAction(cc.sequence(cc.delayTime(startDelay), showCall));
    }
    var distance = Math.sqrt(Math.pow(initialPoint.x - finalDragPoint.x, 2) + Math.pow(initialPoint.y - finalDragPoint.y, 2));
    var moveDuration = distance / speed;

    var clickAndDragAction = cc.sequence(
      cc.delayTime(startDelay),
      cc.fadeIn(0),
      cc.moveTo(0, cc.p(initialPoint.x, initialPoint.y)),
      cc.callFunc(this.playClickSound, this),
      this.getSingleClickDragAnimation(),
      cc.moveTo(moveDuration, cc.p(finalDragPoint.x, finalDragPoint.y)),
      cc.delayTime(delay2),
      this.getClickReleaseAnimation(),
      cc.fadeOut(0.1)
    );
    let repeatAction = cc.repeatForever(clickAndDragAction);
    repeatAction.setTag(this.dragTag);
    this.runAction(repeatAction);
  },

  runClickAndDragAnimationForMovingObject: function (object, initialPoint, finalDragPoint, startDelay = 0, speed = 1000, delay2 = 0.1) {

    if (this.getActionByTag(this.dragTag)) { //do nothing if already doing drag animation
      return;
    }
    if (this.getActionByTag(this.clickTag)) { //if(click animation is going on earlier)
      this.stopAction(this.getActionByTag(this.clickTag));
    }
    this.x = initialPoint.x;
    this.y = initialPoint.y;
    if (!this.isVisible()) {
      var showCall = cc.callFunc((target) => {
        target.setVisible(true);
      }, this);
      this.runAction(cc.sequence(cc.delayTime(startDelay), showCall));
    }
    var distance = Math.sqrt(Math.pow(initialPoint.x - finalDragPoint.x, 2) + Math.pow(initialPoint.y - finalDragPoint.y, 2));
    var moveDuration = distance / speed;

    var clickAndDragAction = cc.sequence(
      cc.delayTime(startDelay),
      cc.fadeIn(0),
      cc.callFunc(() => {
        if (object && object.parent) {

          var objectPos = object.parent.convertToWorldSpace(object.getPosition());
          objectPos = object.parent.convertToNodeSpace(objectPos);
          this.setPosition(objectPos);
        }
      }),
      // cc.moveTo(0, cc.p(initialPoint.x, initialPoint.y)),
      cc.callFunc(this.playClickSound, this),
      this.getSingleClickDragAnimation(),
      cc.moveTo(moveDuration, cc.p(finalDragPoint.x, finalDragPoint.y)),
      cc.delayTime(delay2),
      this.getClickReleaseAnimation(),
      cc.fadeOut(0.1)
    );
    let repeatAction = cc.repeatForever(clickAndDragAction);
    repeatAction.setTag(this.dragTag);
    this.runAction(repeatAction);
  },
  stopAction: function () {
    this.setPlayClickSoundCb(null);
    this.setVisible(false);
    this.stopAllActions();
  },

  runClickHoldAnimation: function (delayBetweenHoldAndRelease, position) {
    this.stopAllActions();
    this.setPosition(position);
    this.setVisible(true);
    var clickAndHoldAction = cc.sequence(
      cc.fadeIn(0),
      this.getClickAndHoldAnimation(),
      //cc.delayTime(delayBetweenHoldAndRelease),
      this.getClickReleaseAnimation(),
      cc.fadeOut(0.1)
    );
    let repeatAction = cc.repeatForever(clickAndHoldAction);
    repeatAction.setTag(15);
    this.runAction(repeatAction);
  },

  runClickAndDragAnimationOnPath: function (arrayOfPoints, timeForAction, delayAfterAction) {
    if (this.getActionByTag(11)) {
      return;
    }
    if (arrayOfPoints[1][0]) {
      var initialPoint = arrayOfPoints[0][0];
      var initialPoint1 = arrayOfPoints[1][0];
      var clickAndDragAction = cc.sequence(
        cc.delayTime(1),
        cc.fadeIn(0),
        cc.moveTo(0, cc.p(initialPoint.x, initialPoint.y)),
        this.getSingleClickDragAnimation(),
        cc.catmullRomTo(timeForAction, arrayOfPoints[0]),
        this.getClickReleaseAnimation(),
        cc.moveTo(0, cc.p(initialPoint1.x, initialPoint1.y)),
        this.getSingleClickDragAnimation(),
        cc.catmullRomTo(timeForAction, arrayOfPoints[1]),
        this.getClickReleaseAnimation(),
        cc.fadeOut(0.1)
      );
      let repeatAction = cc.repeatForever(clickAndDragAction);
      repeatAction.setTag(11);
      this.runAction(repeatAction);
    } else {
      var initialPoint = arrayOfPoints[0];
      var clickAndDragAction = cc.sequence(
        cc.delayTime(1),
        cc.fadeIn(0),
        cc.moveTo(0, cc.p(initialPoint.x, initialPoint.y)),
        this.getSingleClickDragAnimation(),
        cc.catmullRomTo(timeForAction, arrayOfPoints),
        cc.delayTime(delayAfterAction),
        this.getClickReleaseAnimation(),
        cc.fadeOut(0.1)
      );
      let repeatAction = cc.repeatForever(clickAndDragAction);
      repeatAction.setTag(11);
      this.runAction(repeatAction);
    }
  },

  getClickAnimation: function () {
    var animFrames = [];
    var str = "";
    for (var i = 1; i < 26; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    var animation = new cc.Animation(animFrames, 0.08);
    return new cc.Animate(animation);
  },

  getClickAndHoldAnimation: function () {
    var animFrames = [];
    //single Click
    var str = "";
    for (var i = 1; i < 11; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    for (var i = 11; i <= 19; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    for (var i = 11; i <= 19; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    for (var i = 11; i <= 19; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    for (var i = 11; i <= 19; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }

    var animation = new cc.Animation(animFrames, 0.08);
    return new cc.Animate(animation);
  },

  getSingleClickDragAnimation: function () {
    var animFrames = [];
    //single Click
    var str = "";
    for (var i = 1; i < 20; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    var animation = new cc.Animation(animFrames, 0.08);
    return new cc.Animate(animation);
  },

  getClickReleaseAnimation: function () {
    var animFrames = [];
    var str = "";
    for (var i = 20; i < 26; i++) {
      str = "000" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    var animation = new cc.Animation(animFrames, 0.08);
    return new cc.Animate(animation);
  },

  playClickSound: function () {
    this.playClickSoundCb && this.playClickSoundCb();
  },

  moveHandGetstureOnPath(arrayOfPaths, time) {
    this.setPosition(arrayOfPaths[0]);
    var clickAction = getSpriteFrameAnimation("000", 25, 25, 0.06);
    var resetToStartAction = cc.moveTo(0.01, arrayOfPaths[0]);
    this.runAction(cc.repeatForever(cc.sequence(clickAction, cc.catmullRomTo(time, arrayOfPaths), cc.delayTime(0.7), resetToStartAction)));
  },

  moveHandGetstureOnPathOnTrigger(arrayOfPaths, time) {
    this.setPosition(arrayOfPaths[0]);
    var clickAction = getSpriteFrameAnimation("000", 25, 25, 0.06);
    this.runAction(cc.sequence(clickAction, cc.catmullRomTo(time, arrayOfPaths)));
  },
});