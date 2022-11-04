var GamePlayLayer = cc.Layer.extend({
  ctor: function (data, gameManager) {
    this._super();
    this.gameManager = gameManager;
    this.isSafariBrowseer = isSafariBrowser();
    this.contentScalefactor = 0.5;
    if (this.gameManager.isRetinaDevice)
      this.contentScalefactor = 1;
    window.gamePlay = this;
    this.basicIphoneRes = cc.rect(0, 0, 2436, 1125);
    this.basicIpadRes = cc.rect(0, 0, 2048, 1536);
    this.startSubLevel(data);
  },
  onEnter: function () {
    this._super();
    this.setContentSize(
      cc.size(this.m_visibleSize.width, this.m_visibleSize.height)
    );
    this.addTouchListener();
    this.hintManager = new HintManager(this);
    this.scheduleUpdate();
    this.addComponents();
  },
  update(deltaTime) {
    this.runningTime += deltaTime;
  },
  startSubLevel(data) {
    this.m_visibleSize = cc.director.getVisibleSize();
    this.data = data;
    this.touchAllowed = true;
  },
});
