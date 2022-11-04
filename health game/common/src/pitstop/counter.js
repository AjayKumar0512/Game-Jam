var Counter = ccui.Layout.extend({

  ctor: function (counterValue, fontSize, color, animatedBigStar, animateSmallStar) {
    this._super();
    this.setAnchorPoint(cc.p(1, 0.5));
    this.setClippingEnabled(true);
    this.setContentSize(cc.size(fontSize * 1.2, fontSize * 1.2));

    this.animatedBigStar = animatedBigStar;
    this.animateSmallStar = animateSmallStar;

    this.animationDuration = 0.5;
    this.counterValue = counterValue;
    this.counter = 0;

    this.counterTextDisplay = new ccui.Text(this.counter, getFontName(commonFonts.schoolbellregular_ttf), fontSize);
    this.counterTextDisplay.setColor(color);
    this.counterTextDisplay.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.48));
    this.addChild(this.counterTextDisplay);

    if (counterValue > 0) {
      this.counterTextNext = new ccui.Text(++this.counter, getFontName(commonFonts.schoolbellregular_ttf), fontSize);
      this.counterTextNext.setColor(color);
      this.counterTextNext.setPosition(cc.p(this.getContentSize().width * 0.5, this.counterTextDisplay.getPositionY() - this.getContentSize().height));
      this.addChild(this.counterTextNext);
    }

    // this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    // this.setBackGroundColor(cc.color(0,0,0));

  },

  addMoveUpTween: function (time) {

    if (this.counterValue < this.counter) {
      this.animatedBigStar && this.animatedBigStar();
      return;
    }

    if (this.counter === 1 || (this.counter % 3 === 0)) {
      this.animateSmallStar && this.animateSmallStar();
    }

    this.animationDuration = time;

    var againCallCounter = cc.callFunc(() => {
      this.counterTextDisplay.setString(this.counter);
      this.counterTextDisplay.setPositionY(this.counterTextDisplay.getPositionY() - this.getContentSize().height);
      this.counterTextNext.setString(++this.counter);
      this.counterTextNext.setPositionY(this.counterTextDisplay.getPositionY() - this.getContentSize().height);
      this.addMoveUpTween(this.animationDuration * 0.9);
    }, this);

    var moveBy = cc.moveBy(this.animationDuration, cc.p(0, this.getContentSize().height));
    var seq = cc.sequence(moveBy.clone(), againCallCounter);
    this.counterTextDisplay.runAction(moveBy.clone());
    this.counterTextNext.runAction(seq.clone());
  }
});
