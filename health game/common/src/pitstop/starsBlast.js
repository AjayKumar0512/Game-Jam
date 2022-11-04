var StarsBlast = cc.Sprite.extend({
  
  ctor: function (pos) {
    this._super();
    this.setPosition(pos);
    this.setVisible(false);
    this.loadSpriteSheet();
  },

  loadSpriteSheet: function () {
    cc.spriteFrameCache.addSpriteFrames(commonRes.PitStop_Stars_plist, commonRes.PitStop_Stars_Sheet_png);
  },

  startAnimation : function(callBack) {
    this.setVisible(true);
    var starsFrameAnim = this.getStarsFrameAnimation();
    var callStartRemove = cc.callFunc(() => {
      if (!callBack){
        this.removeFromParent(true);
      } else {
        this.setVisible(false);
        callBack();
      }
    }, this);
    this.runAction(cc.sequence(starsFrameAnim, callStartRemove));
  },

  getStarsFrameAnimation: function () {
    var animFrames = [];
    var str = "";
    for (var i = 1; i <= 26; i++) {
      str = "star00" + (i < 10 ? ("0" + i) : i) + ".png";
      var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
      var animFrame = new cc.AnimationFrame();
      animFrame.initWithSpriteFrame(spriteFrame, 1, null);
      animFrames.push(animFrame);
    }
    var animation = new cc.Animation(animFrames, 0.03);
    return new cc.Animate(animation);
  }
});
