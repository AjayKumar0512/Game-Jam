var ReplayPopUP = cc.Sprite.extend({
  ctor: function (gamePlay) {
    var path = "";
    path = res.popup;
    this.gamePlay = gamePlay;
    this._super(path);
  },

  onEnter: function () {
    this._super();
    this.m_visibleSize = cc.director.getVisibleSize();
    this.addTouchListener();
    this.runAction(cc.scaleTo(0.3, 1));
    this.addComponents();
  },
  addComponents() {
    this.addPoster();
    this.addBack();
    this.addReplay();
    this.addNext();
  },
  addNext() {
    this.next = new cc.Sprite(res.button1);
    this.next.setPosition(this.width * 0.7, this.height * 0.25);
    this.addChild(this.next);
    let nextIcon = new cc.Sprite(res.next_icon);
    nextIcon.setPosition(this.next.width * .25, this.next.height * .55);
    this.next.addChild(nextIcon, 2);

    let nextText = new cc.LabelTTF("Yes", "graphie_semibold", 50);
    nextText.setPosition(this.next.width * 0.6, this.next.height * 0.5);
    nextText.setFontFillColor(cc.color(50, 55, 156));
    this.next.addChild(nextText, 2);
  },
  addReplay() {
    this.replay = new cc.Sprite(res.button1);
    this.replay.setPosition(this.width * 0.3, this.height * 0.25);
    this.addChild(this.replay);
    let replayIcon = new cc.Sprite(res.replay_icon);
    replayIcon.setPosition(this.replay.width * 0.25, this.replay.height * 0.55);
    this.replay.addChild(replayIcon, 2);

    let replayText = new cc.LabelTTF("No", "graphie_semibold", 50);
    replayText.setPosition(this.replay.width * 0.65, this.replay.height * 0.5);
    replayText.setFontFillColor(cc.color(50, 55, 156));
    this.replay.addChild(replayText, 2);
  },
  addTouchListener() {
    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: this.onTouchBegan,
      },
      this
    );
  },
  addBack() {
    this.back = new cc.Sprite(res.popup_back);
    this.back.setPosition(this.width * 0.94, this.height * 0.94);
    this.addChild(this.back);
    this.back.setVisible(false);
  },
  onBackClicked() {
    return;
    this.gamePlay.gameManager.soundManager.playSound(res.tap);
    this.runAction(cc.sequence(cc.scaleTo(0.3, 0),
      cc.callFunc(() => {
        window.gameManager.changeToModeSelectionPage();
      })));

  },
  onTouchBegan(touch, event) {
    let self = event.getCurrentTarget();
    let location = self.convertToNodeSpace(touch.getLocation());
    let replayBox = self.replay.getBoundingBox();
    let backBox = self.back.getBoundingBox();
    let nextBox = self.next.getBoundingBox();
    if (cc.rectContainsPoint(replayBox, location)) {
      self.onreplayClicked();
    }
    if (cc.rectContainsPoint(backBox, location)) {
      self.onBackClicked();
    }
    if (cc.rectContainsPoint(nextBox, location)) {
      self.onNextClicked();
    }
  },
  addPoster() {
    this.poster = cc.Sprite.create(res.welldone_poster);
    this.poster.setPosition(this.width * 0.5, this.height * 0.72);
    this.addChild(this.poster);
  },
  onreplayClicked() {
    this.gamePlay.NoClicked();
  },
  getOtherMode(mode) {
    var totalModes = ModeNames.length;
    var val = mode;
    while (val == mode)
      val = Math.floor(Math.random() * totalModes);
    return val;
  },
  onNextClicked() {
    this.gamePlay.YesClicked();
  },
});
