var ProgressBar = ccui.LoadingBar.extend({
  ctor: function (textureName, percentage, emptyBar = commonRes.Progress_Empty_Bar_png) {
    this._super(textureName, percentage);
    this.currentPercentage = percentage;
    this.progressToPrecent = percentage;
    this.callback = null;
    this.counter = 0;
    this.mode = 1;//change value accordingly to manage the update speed of bar
    //this.loadTexture(getSpriteNameForButton(textureName),ccui.Widget.PLIST_TEXTURE);
    this.addEmptyBar(emptyBar);
    //this.setScale9Enabled(true);
  },

  addEmptyBar: function (emptyBar) {
    this.emptyBar = new cc.Sprite(emptyBar);
    this.emptyBar.setPosition(cc.p(this.getContentSize().width * 0.5, this.getContentSize().height * 0.5));
    this.addChild(this.emptyBar, -1);
  },

  presetProgressBar: function (percentage) {
    this.setPercent(percentage);
    this.currentPercentage = percentage;
  },

  resetProgressBar: function (callback = () => { }) {
    this.setPercent(0);
    this.currentPercentage = 0;
  },

  updateProgressBar: function (percent, callback = () => { }) {
    this.progressToPrecent = percent;
    this.callback = callback;
    if (this.currentPercentage < this.progressToPrecent) {
      this.unscheduleUpdate();
      this.scheduleUpdate();
    } else {
      this.progressToPrecent = this.currentPercentage;
      this.callback && this.callback();
    }
  },

  update: function (dt) {
    this.counter++;
    if (this.counter % this.mode == 0) {
      this.currentPercentage++;
    }
    this.setPercent(this.currentPercentage);
    if (this.progressToPrecent <= this.currentPercentage) {
      this.currentPercentage = this.progressToPrecent;
      this.setPercent(this.progressToPrecent);
      this.unscheduleUpdate();
      this.callback && this.callback();
    }
  },
});