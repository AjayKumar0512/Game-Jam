var ProgressBarStar = cc.Sprite.extend({
  ctor:function(textureName, emptyStarTexture){
    this._super(textureName);
    this.starTexture= textureName;
    this.emptyStarTexture = emptyStarTexture;
    this.addSplitStar();
  },

  show: function(callback = () => { }) {
    if (!this.spliteStar) {
      this.addSplitStar();
    }
    this.setVisible(true);
     let sp = new cc.Sprite(this.starTexture);
     this.setSpriteFrame(sp.getSpriteFrame());
    //this.setTexture(this.starTexture);
    this.showAnim(callback);
  },

  addSplitStar: function() {
    this.spliteStar = new StarsBlast(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    this.addChild(this.spliteStar);
    this.spliteStar.setScale(0.2);
  },

  fade: function() {
    let sp = new cc.Sprite(this.emptyStarTexture);
    this.setSpriteFrame(sp.getSpriteFrame());
    //this.setTexture(this.emptyStarTexture);
  },

  hide: function() {
    this.setVisible(false);
  },

  showAnim: function(callBack = () => { }) {
    this.spliteStar.startAnimation(callBack);
  },

});